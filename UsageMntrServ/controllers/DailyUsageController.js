const DailyUsage = require("../models/DailyUsage");

const getDailyUsageByIdAndDate = async (req, res) => {
    const { userID, date } = req.body;

    try {
        const dailyUsage = await DailyUsage.findOne({ userID, date });

        if (!dailyUsage) {
            return res.status(404).json({ message: "Daily usage not found." });
        }

        res.status(200).json({ dailyUsage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}