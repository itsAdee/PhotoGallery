require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const cron = require('node-cron');
const db = require("mongoose");
const { getDailyUsageById, addNewDailyUsageInstance, resetDailyLimit } = require("./controllers/DailyUsageController");


const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get("/usage", getDailyUsageById);
app.post("/createUser", addNewDailyUsageInstance);
app.post("/resetDailyLimit", resetDailyLimit);


cron.schedule('0 0 * * *', async () => {
  console.log("UsageMntrServ: Resetting daily limit...");
  await axios.post("http://localhost:4001/resetDailyLimit").catch((err) => {
    console.log(err.message);
  });
});


app.post("/events", async (req, res) => {
  const { type } = req.body;

  console.log("UsageMntrServ: Received Event:", type);

  const formData = new FormData();
  Object.keys(req.body).forEach(key => {
    formData.append(key, req.body[key]);
  });
  if (req.files != null && req.files.file != null) {
    formData.append('file', req.files?.file?.data, {
      filename: req.files.file.name,
      contentType: req.files.file.mimetype,
    });
  }

  if (type === "NewUserCreated") {
    console.log("UsageMntrServ: Creating user...")
    await axios.post("http://localhost:4002/createUser",
      formData,
      {
        headers: formData.getHeaders()
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