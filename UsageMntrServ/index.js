const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { getDailyUsageById, addNewDailyUsageInstance } = require("./controllers/DailyUsageController");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/usage", getDailyUsageById);
app.post("/createUser", addNewDailyUsageInstance);

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


app.listen(4002, () => {
  console.log("UsageMntrServ: Listening on 4002");
});