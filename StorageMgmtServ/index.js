require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const db = require("mongoose");
const fileUpload = require("express-fileupload");
const FormData = require('form-data');

const { updateUserStorage, createUser } = require("./controllers/UserStorageController");
const { uploadImage, getImages } = require("./controllers/ImageController");


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());


app.post("/upload", updateUserStorage, uploadImage);
app.post("/createUser", createUser);
app.get("/images/:id", getImages)


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
  const { type, userID } = req.body;

  console.log("StorageMgmtServ: Received Event:", type);

  if (type === "NewUserCreated") {
    console.log("StorageMgmtServ: Creating user...")

    await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4001/createUser',
      headers: {
        'Content-Type': 'application/json'
      },
      data: req.body
    }).catch((err) => {
      console.log(err.message);
    });

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