const express = require('express');
const usageRouter = express.Router();
const axios = require("axios");
const {
    getDailyUsageById,
    addNewDailyUsageInstance,
    resetDailyLimit,
    updateDailyUsage
} = require("../controllers/DailyUsageController");

const { addUsageRequest } = require("../controllers/UsageRequestController");

usageRouter.get("/usage/:id", getDailyUsageById);
usageRouter.post("/createUser", addNewDailyUsageInstance);
usageRouter.post("/resetDailyLimit", resetDailyLimit);
usageRouter.post("/updateUsage", updateDailyUsage, addUsageRequest);

usageRouter.post("/events", async (req, res) => {
    const { type } = req.body;

    console.log("UsageMntrServ: Received Event:", type);

    if (type === "NewUserCreated") {
        console.log("UsageMntrServ: Creating user...")

        axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:4002/api/usageMntr/createUser',
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
            url: 'http://localhost:4002/api/usageMntr/updateUsage',
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

module.exports = { usageRouter };