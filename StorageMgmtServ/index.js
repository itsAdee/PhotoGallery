require("dotenv").config();

const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const db = require("mongoose");
const GridFSBucket = require("mongodb").GridFSBucket;

const uri = process.env.MONGO_URI;

// UserStorage Model
const userStorageSchema = new db.Schema({
  userID: String,
  usedStorage: { type: Number, default: 0 }, // in Bytes
  totalStorage: { type: Number, default: 1000000 }, // 10 MB in Bytes
});

const UserStorage = db.model("UserStorage", userStorageSchema);

// Define the schema for the Images table
const imageSchema = new db.Schema({
  userID: String,
  imageName: String,
  imageSize: Number,
});

// Create a Mongoose model for the Images table
const Image = db.model('Image', imageSchema);

// Create a storage object with a given configuration
const storage = new GridFsStorage({
  url: uri,
  file: (req, file) => {
    //If it is an image, save to photos bucket
    console.log("Grid", file, req.body)
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      return {
        bucketName: "photos",

        filename: `${Date.now()}_${file.originalname}`,
      };
    } else {
      //Otherwise save to default bucket
      return `${Date.now()}_${file.originalname}`;
    }
  },
});

// Set multer storage engine to the newly created object
const upload = multer({ storage });

const app = express();
app.use(bodyParser.json());
app.use(cors());

const handleEvent = async (type, data) => {
  if (type === "ImageUploaded") {
    await axios.post("http://localhost:4001/upload", data).catch((err) => {
      console.log(err.message);
    });
    if (type === "NewUserCreated") {
      res.send({ status: "OK" });
    }
  }
}


// Endpoint to handle user uploads
app.post("/upload", upload.single("avatar"), async (req, res) => {
  console.log("Uploading in Progress...", req.file)
  const { userID, photoSize } = req.body
  console.log(userID, photoSize)

  try {
    const userStorage = await UserStorage.findOne({ userID });

    if (!userStorage) {
      return res.status(404).json({ message: "User not found." });
    }

    const { usedStorage, totalStorage } = userStorage;

    if (usedStorage + photoSize > totalStorage) {
      return res.status(400).json({ message: "Storage limit exceeded." });
    }

    // Update used storage for the user
    userStorage.usedStorage += photoSize;
    await userStorage.save();

    res.status(200).json({ message: "Upload successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// Endpoint to handle storage usage alert
// This can be triggered by an event or scheduled task
app.post("/usageAlert", async (req, res) => {
  const { userID } = req.body;

  try {
    const userStorage = await UserStorage.findOne({ userID });

    if (!userStorage) {
      return res.status(404).json({ message: "User not found." });
    }

    const { usedStorage, totalStorage } = userStorage;

    if ((usedStorage / totalStorage) * 100 >= 80) {
      // Generate storage alert for the user (via EventBus or other means)
      // This might involve publishing an event or notifying another service
      // For example:
      axios.post("http://localhost:4000/events", {
        type: "StorageAlert",
        data: {
          userID,
          message: "Storage usage is nearing the limit.",
        },
      });
    }

    res.status(200).json({ message: "Usage check completed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});


app.post("/events", (req, res) => {
  const { type, data } = req.body;

  console.log("StorageMgmtServ: Received Event:", type);

  handleEvent(type, data);

  res.send({});
});


db.connect(process.env.MONGO_URI)
  .then((result) => {
    console.log("Connected to the Database...");
    // Listen for Requests
    app.listen(4001, () => {
      console.log("StorageMgmtServ: Listening on 4001");
    });
  })
  .catch((err) => {
    console.error(err);
  });