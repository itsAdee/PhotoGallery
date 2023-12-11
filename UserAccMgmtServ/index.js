require("dotenv").config();


const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const db = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const multer = require('multer');
const upload = multer()


const userSchema = new db.Schema({
  username: String,
  password: String,
  email: String
});


const User = db.model('User', userSchema);

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




  app.post('/register', upload.none(), async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body)
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();
    console.log(`User ${username} created.`);
    res.status(201).send();
  });
  
  app.post('/login', upload.none(), async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      console.log(`User ${username} logged in.`);
      res.status(200).send();
    } else {
      console.log(`User ${username} failed to log in.`);
      res.status(403).send();
    }
  });

