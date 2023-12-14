const DailyUsage = require("../models/DailyUsage");

const getDailyUsageById = async (req, res) => {
    const { userID, date } = req.body;

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

    try {
        const dailyUsage = await DailyUsage.findOne({ userID });

        if (dailyUsage) {
            return res.status(400).json({ message: "Daily usage already exists." });
        }

        const newDailyUsage = new DailyUsage({
            userID,
            date,
            usage
        });

        await newDailyUsage.save();

        res.status(201).json({ message: "Daily usage created." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }

}
module.exports = {
    getDailyUsageById,
    addNewDailyUsageInstance
}