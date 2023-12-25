const db = require("mongoose");

// Define the schema for the Images table
const imageSchema = new db.Schema({
    userID: db.Schema.Types.ObjectId,
    imageName: String,
    imageSize: Number,
    contentType: String,
    img: Buffer
}, { timestamps: true });

// Create a Mongoose model for the Images table
module.exports = db.model('Image', imageSchema);