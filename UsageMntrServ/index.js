require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const cron = require('node-cron');
const db = require("mongoose");
const {
  getDailyUsageById,
  addNewDailyUsageInstance,
  resetDailyLimit,
  updateDailyUsage
} = require("./controllers/DailyUsageController");


const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get("/usage", getDailyUsageById);
app.post("/createUser", addNewDailyUsageInstance);
app.post("/resetDailyLimit", resetDailyLimit);
app.post("/updateUsage", updateDailyUsage);


cron.schedule('0 0 * * *', async () => {
  console.log("UsageMntrServ: Resetting daily limit...");
  await axios.post("http://localhost:4002/resetDailyLimit").catch((err) => {
    console.log(err.message);
  });
});


app.post("/events", async (req, res) => {
  const { type, userID } = req.body;

  console.log("UsageMntrServ: Received Event:", type);

  if (type === "NewUserCreated") {
    console.log("UsageMntrServ: Creating user...")

    axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4002/createUser',
      headers: {
        'Content-Type': 'application/json'
      },
      data: req.body
    }).catch((err) => {
      console.log(err.message);
    });
  }
  if (type === "ImageUploaded") {
    console.log("UsageMntrServ: Updating usage...")

    await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4002/updateUsage',
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
    app.listen(4002, () => {
      console.log("UsageMntrServ: Listening on 4002");
    });
  })
  .catch((err) => {
    console.error(err);
  });