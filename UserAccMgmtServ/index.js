require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require('mongoose');
const multer = require('multer');
const upload = multer();
const { LoginUser, CreateUser } = require('./controllers/userController');


const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.post('/register', upload.none(), CreateUser);
app.post('/login', upload.none(), LoginUser);

app.post("/events", async (req, res) => {
  const { type } = req.body;

  console.log("UserAccMgmtServ: Received Event:", type);

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

  if (type === "Blah Blah") {
    await axios.post("http://localhost:4001",
      formData,
      {
        headers: formData.getHeaders()
      }).catch((err) => {
        console.log(err.message);
      });
  }

  res.send({});
});


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