require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const cron = require('node-cron');
const db = require("mongoose");
const { usageRouter } = require("./routes/usageRouter");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/usageMntr', usageRouter);

// Reset daily limit at midnight
cron.schedule('0 0 * * *', async () => {
  console.log("UsageMntrServ: Resetting daily limit...");
  await axios.post("http://localhost:4002/api/usageMntr/resetDailyLimit").catch((err) => {
    console.log(err.message);
  });
});

// Connect to the Database
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