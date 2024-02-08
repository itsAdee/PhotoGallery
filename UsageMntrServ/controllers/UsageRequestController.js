const UsageRequest = require('../models/UsageRequest');
const mongoose = require('mongoose');

const addUsageRequest = async (req, res) => {
    const { userID, bandwidth, requestType } = req.body;
    console.log("User ID: ", userID);

    try {
        const newUsageRequest = new UsageRequest({
            userID,
            usedBandwidth: bandwidth,
            requestType
        });

        await newUsageRequest.save();

        res.status(201).json({ message: "Usage request created." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

const getUsageRequestsToday = async (req, res) => {
    try {
        const userID = req.params.userID;
        console.log("User ID: ", userID);

        // Get today's date at 00:00:00
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Get today's date at 23:59:59
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Find usage requests that were created between the start of today and the end of today
        const usageRequests = await UsageRequest.find({
            userID,
            createdAt: {
                $gte: startOfToday,
                $lt: endOfToday
            }
        });

        res.json(usageRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUsageRequestsByDay = async (req, res) => {
    console.log("User ID: ", req.params.userID);
    const userID = new mongoose.Types.ObjectId(req.params.userID);

    try {
        const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
        const usageRequests = await UsageRequest.aggregate([
            { $match: { userID } },
            {
                $group: {
                    _id: {
                        year: { $year: { $toDate: { $subtract: [{ $toLong: "$createdAt" }, timezoneOffsetInMinutes * 60 * 1000] } } },
                        month: { $month: { $toDate: { $subtract: [{ $toLong: "$createdAt" }, timezoneOffsetInMinutes * 60 * 1000] } } },
                        day: { $dayOfMonth: { $toDate: { $subtract: [{ $toLong: "$createdAt" }, timezoneOffsetInMinutes * 60 * 1000] } } },
                    },
                    uploadBandwidth: {
                        $sum: {
                            $cond: [{ $eq: ["$requestType", "Upload"] }, "$usedBandwidth", 0]
                        }
                    },
                    downloadBandwidth: {
                        $sum: {
                            $cond: [{ $eq: ["$requestType", "Download"] }, "$usedBandwidth", 0]
                        }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        res.status(200).json(usageRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

const getUsageRequestsByMonth = async (req, res) => {
    console.log("User ID: ", req.params.userID);
    const userID = new mongoose.Types.ObjectId(req.params.userID);

    try {
        const usageRequests = await UsageRequest.aggregate([
            { $match: { userID } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    uploadBandwidth: {
                        $sum: {
                            $cond: [{ $eq: ["$requestType", "Upload"] }, "$usedBandwidth", 0]
                        }
                    },
                    downloadBandwidth: {
                        $sum: {
                            $cond: [{ $eq: ["$requestType", "Download"] }, "$usedBandwidth", 0]
                        }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.status(200).json(usageRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

const getUsageRequestsByYear = async (req, res) => {
    console.log("User ID: ", req.params.userID);
    const userID = new mongoose.Types.ObjectId(req.params.userID);

    try {
        const usageRequests = await UsageRequest.aggregate([
            { $match: { userID } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                    },
                    uploadBandwidth: {
                        $sum: {
                            $cond: [{ $eq: ["$requestType", "Upload"] }, "$usedBandwidth", 0]
                        }
                    },
                    downloadBandwidth: {
                        $sum: {
                            $cond: [{ $eq: ["$requestType", "Download"] }, "$usedBandwidth", 0]
                        }
                    }
                }
            },
            { $sort: { "_id.year": 1 } }
        ]);

        res.status(200).json(usageRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    addUsageRequest,
    getUsageRequestsToday,
    getUsageRequestsByDay,
    getUsageRequestsByMonth,
    getUsageRequestsByYear
}