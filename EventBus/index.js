const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const fileUpload = require('express-fileupload');
const FormData = require('form-data');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;
  events.push(event);

  try {
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

    await Promise.all([
      axios.post("http://localhost:4001/events", formData, {
        headers: formData.getHeaders(),
      }),
      axios.post("http://localhost:4002/events", formData, {
        headers: formData.getHeaders(),
      }),
      axios.post("http://localhost:4003/events", formData, {
        headers: formData.getHeaders(),
      }),
    ]).then(() => {
      res.send({ status: "OK" });
    })

  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "Internal server error" });
  }

});

app.get("/events", (req, res) => {
  res.send(events);
});


app.listen(4000, () => {
  console.log("EventBus: Listening on 4000");
});