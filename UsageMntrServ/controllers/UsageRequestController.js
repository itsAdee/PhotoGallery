const UsageRequest = require('../models/UsageRequest');

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

const getUsageRequestsByDay = async (req, res) => {
    const { userID } = req.params;

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
    const { userID } = req.params;

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
    const { userID } = req.params;

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
    getUsageRequestsByDay,
    getUsageRequestsByMonth,
    getUsageRequestsByYear
}