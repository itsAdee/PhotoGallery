require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require('mongoose');
const { userRouter } = require('./routes/userRouter');


const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/userAcc', userRouter);

// Connect to Database
db.connect(process.env.MONGO_URI)
  .then((result) => {
    console.log("Connected to the Database...");
    // Listen for Requests
    app.listen(4003, () => {
      console.log("UserAccMgmtServ: Listening on 4003");
    });
  })
  .catch((err) => {
    console.error(err);
  });