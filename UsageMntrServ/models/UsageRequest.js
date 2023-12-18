const db = require("mongoose");

// Define the schema for the Images table
const usageRequestSchema = new db.Schema({
    userID: db.Schema.Types.ObjectId,
    usedBandwidth: Number
});

// Create a Mongoose model for the Images table
module.exports = db.model('UsageRequest', usageRequestSchema);