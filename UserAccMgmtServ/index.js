// index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require('mongoose');
const userRoutes = require('./controllers/userController');

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // replace with the origin of your client
  credentials: true
}));

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

app.use('/', userRoutes);