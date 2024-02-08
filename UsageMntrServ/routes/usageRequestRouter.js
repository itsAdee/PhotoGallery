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
const verifyToken = require('../controllers/JwtVerification');

usageRequestRouter.get("/user/:userID/",verifyToken,getDailyUsageById);
usageRequestRouter.get("/user/:userID/today",verifyToken ,getUsageRequestsToday);
usageRequestRouter.get("/user/:userID/day",verifyToken ,getUsageRequestsByDay);
usageRequestRouter.get("/user/:userID/month",verifyToken ,getUsageRequestsByMonth);
usageRequestRouter.get("/user/:userID/year",verifyToken,getUsageRequestsByYear);

module.exports = { usageRequestRouter };