const db = require("mongoose");

// Define the schema for the Images table
const imageSchema = new db.Schema({
    userID: String,
    imageName: String,
    imageSize: Number,
    contentType: String,
    img: Buffer,
});

// Create a Mongoose model for the Images table
module.exports = db.model('Image', imageSchema);