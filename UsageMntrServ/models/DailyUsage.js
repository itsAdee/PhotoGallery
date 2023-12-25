const db = require("mongoose");

// Define the schema for the Images table
const dailyUsageSchema = new db.Schema({
    userID: db.Schema.Types.ObjectId,
    usedBandwidth: Number,
    totalBandwidth: Number
}, { timestamps: true });

// Create a Mongoose model for the Images table
module.exports = db.model('DailyUsage', dailyUsageSchema);