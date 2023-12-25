require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("mongoose");
const { storageRouter } = require("./routes/storageRouter");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/storageMgmt', storageRouter);

// Connect to the Database
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