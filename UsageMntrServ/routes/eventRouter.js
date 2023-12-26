const express = require('express');
const eventRouter = express.Router();
const axios = require("axios");

eventRouter.post("/", async (req, res) => {
    const { type } = req.body;

    console.log("UsageMntrServ: Received Event:", type);

    if (type === "NewUserCreated") {
        console.log("UsageMntrServ: Creating user...")

        axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://usage-mntr-serv-srv:4002/api/usageMntr/createUser',
            headers: {
                'Content-Type': 'application/json'
            },
            data: req.body
        }).catch((err) => {
            console.log(err.message);
        });
    }
    if (type === "ImageUploaded") {
        console.log("UsageMntrServ: Updating usage...")

        await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://usage-mntr-serv-srv:4002/api/usageMntr/updateUsage',
            headers: {
                'Content-Type': 'application/json'
            },
            data: req.body
        }).catch((err) => {
            console.log(err.message);
        });
    }
    if (type === "ImageDownloaded") {
        console.log("UsageMntrServ: Updating usage...")

        await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://usage-mntr-serv-srv:4002/api/usageMntr/updateUsage',
            headers: {
                'Content-Type': 'application/json'
            },
            data: req.body
        }).catch((err) => {
            console.log(err.message);
        });
    }
    res.send({});
});

module.exports = { eventRouter };