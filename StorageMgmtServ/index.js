require("dotenv").config();

const multer = require("multer");
const { GridFsStorage } = require('multer-gridfs-storage');
const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const db = require("mongoose");
const fileUpload = require("express-fileupload");
const FormData = require('form-data');
const fs = require('fs');
const { Console } = require("console");

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
  contentType: String,
  img: Buffer,
});

// Create a Mongoose model for the Images table
const Image = db.model('Image', imageSchema);

// Create storage engine
const upload = multer({ limits: { fileSize: 1000000 }, dest: '/uploads/' }).single('file');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());


// Endpoint to handle user uploads
app.post("/upload", async (req, res) => {
  console.log("Uploading in Progress...")
  const file = req.files.file

  const { userID } = req.body

  try {
    const userStorage = await UserStorage.findOne({ userID });

    if (!userStorage) {
      console.log("User not found.");
      return res.status(404).json({ message: "User not found." });
    }

    const { usedStorage, totalStorage } = userStorage;

    if (parseInt(usedStorage) + parseInt(file.size) > parseInt(totalStorage)) {
      console.log("Storage limit exceeded.");
      return res.status(400).json({ message: "Storage limit exceeded." });
    }

    console.log("Storage limit not exceeded.")

    upload(req, res, function (err) {
      if (err) {
        console.log("Error uploading file in the upload endpoint.")
        console.log(err);
        res.status(500).json({ error: 'Error uploading file in the upload endpoint.' });
      }

      if (file == null) {
        res.send('File not found');
      } else {
        var encImg = file.data.toString('base64');

        var newItem = {
          userID: userID,
          imageName: file.name,
          imageSize: file.size,
          contentType: file.mimetype,
          img: Buffer.from(encImg, 'base64')
        };

        Image.create(newItem)
          .then(function () {
            console.log('Image inserted!');

          })
          .catch(function (error) {
            console.error('Error inserting image:', error);
            res.status(500).json({ error: 'Failed to insert image' });
          });


      }
    });

    // Update used storage for the user
    userStorage.usedStorage += Number(file.size);
    await userStorage.save();

    res.status(200).json({ message: "Upload successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/images", async (req, res) => {

  try {
    const images = await Image.find();

    const modifiedImages = images.map((image) => {
      const base64Data = image.img.toString('base64');
      const imageUri = `data:${image.contentType};base64,${base64Data}`;
      
      return {
        _id: image._id,
        userID: image.userID,
        imageName: image.imageName,
        imageSize: image.imageSize,
        contentType: image.contentType,
        imageUri: imageUri,
      };
    });

    res.status(200).json(modifiedImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// Endpoint to handle storage usage alert
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


app.post("/events", async (req, res) => {
  const { type } = req.body;

  console.log("StorageMgmtServ: Received Event:", type);

  const formData = new FormData();
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });
    formData.append('file', req.files.file.data, {
      filename: req.files.file.name,
      contentType: req.files.file.mimetype,
    });

  if (type === "ImageUploaded") {
    await axios.post("http://localhost:4001/upload",
      formData,
      {
        headers: formData.getHeaders()
      }).catch((err) => {
        console.log(err.message);
      });
  }
  if (type === "NewUserCreated") {
    res.send({ status: "OK" });
  }

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