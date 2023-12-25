const DailyUsage = require("../models/DailyUsage");

const getDailyUsageById = async (req, res) => {
    const { userID } = req.params;

    try {
        const dailyUsage = await DailyUsage.findOne({ userID });

        if (!dailyUsage) {
            return res.status(404).json({ message: "Daily usage not found." });
        }

        res.status(200).json({ dailyUsage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

const addNewDailyUsageInstance = async (req, res) => {
    const { userID } = req.body;
    console.log(userID);

    try {
        const dailyUsage = await DailyUsage.findOne({ userID });

        if (dailyUsage) {
            return res.status(400).json({ message: "Daily usage already exists." });
        }

        const newDailyUsage = new DailyUsage({
            userID,
            usedBandwidth: 0,
            totalBandwidth: 2500000
        });

        await newDailyUsage.save();

        res.status(201).json({ message: "Daily usage created." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }

}

const resetDailyLimit = async (req, res) => {
    try {
        await DailyUsage.updateMany({}, { usedBandwidth: 0 })
            .then(() => {
                console.log("Daily usage reset.");
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

const updateDailyUsage = async (req, res, next) => {
    const { userID, bandwidth } = req.body;

    try {
        const dailyUsage = await DailyUsage.findOne({ userID });

        if (!dailyUsage) {
            return res.status(404).json({ message: "Daily usage not found." });
        }

        dailyUsage.usedBandwidth += bandwidth;
        await dailyUsage.save();

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}
module.exports = {
    getDailyUsageById,
    addNewDailyUsageInstance,
    resetDailyLimit,
    updateDailyUsage
}