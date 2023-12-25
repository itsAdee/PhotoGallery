const express = require('express');
const usageRouter = express.Router();
const axios = require("axios");
const {
    addNewDailyUsageInstance,
    resetDailyLimit,
    updateDailyUsage
} = require("../controllers/DailyUsageController");

const { addUsageRequest } = require("../controllers/UsageRequestController");

usageRouter.post("/createUser", addNewDailyUsageInstance);
usageRouter.post("/resetDailyLimit", resetDailyLimit);
usageRouter.post("/updateUsage", updateDailyUsage, addUsageRequest);

module.exports = { usageRouter };