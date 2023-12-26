const UsageRequest = require('../models/UsageRequest');
const mongoose = require('mongoose');

const addUsageRequest = async (req, res) => {
    const { userID, bandwidth, requestType } = req.body;

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
      const userId = req.params.userId;
  
      // Get today's date at 00:00:00
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
  
      // Get today's date at 23:59:59
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
  
      // Find usage requests that were created between the start of today and the end of today
      const usageRequests = await UsageRequest.find({
        userId: userId,
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
    const userID = new mongoose.Types.ObjectId(req.params.userID);

    try {
        const usageRequests = await UsageRequest.aggregate([
            { $match: { userID } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
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