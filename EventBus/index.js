const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = [];

app.post("api/eventbus/events", async (req, res) => {
  const event = req.body;
  events.push(event);

  try {
    await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4001/api/storageMgmt/events',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : req.body
    });

    await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4002/api/usageMntr/events',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : req.body
    });

    await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4003/api/userAcc/events',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : req.body
    });

    res.send({ status: "OK" });

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