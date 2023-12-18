const UsageRequest = require('../models/UsageRequest');

const addUsageRequest = async(req, res) => {
    const { userID, bandwidth } = req.body;

    try {
        const newUsageRequest = new UsageRequest({
            userID,
            usedBandwidth: bandwidth
        });

        await newUsageRequest.save();

        res.status(201).json({ message: "Usage request created." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    addUsageRequest
}