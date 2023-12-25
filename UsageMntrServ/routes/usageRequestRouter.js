const express = require('express');
const usageRequestRouter = express.Router();
const {
    getDailyUsageById
} = require("../controllers/DailyUsageController");
const {
    getUsageRequestsByDay,
    getUsageRequestsByMonth,
    getUsageRequestsByYear
} = require("../controllers/UsageRequestController");

usageRequestRouter.get("/", getDailyUsageById);
usageRequestRouter.get("/day", getUsageRequestsByDay);
usageRequestRouter.get("/month", getUsageRequestsByMonth);
usageRequestRouter.get("/year", getUsageRequestsByYear);

module.exports = { usageRequestRouter };