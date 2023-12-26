const express = require('express');
const usageRequestRouter = express.Router();
const {
    getDailyUsageById
} = require("../controllers/DailyUsageController");
const {
    getUsageRequestsToday,
    getUsageRequestsByDay,
    getUsageRequestsByMonth,
    getUsageRequestsByYear
} = require("../controllers/UsageRequestController");

usageRequestRouter.get("/user/:userID/", getDailyUsageById);
usageRequestRouter.get("/user/:userID/today", getUsageRequestsToday);
usageRequestRouter.get("/user/:userID/day", getUsageRequestsByDay);
usageRequestRouter.get("/user/:userID/month", getUsageRequestsByMonth);
usageRequestRouter.get("/user/:userID/year", getUsageRequestsByYear);

module.exports = { usageRequestRouter };