const db = require("mongoose");

const userStorageSchema = new db.Schema({
    userID: String,
    usedStorage: { type: Number, default: 0 }, // in Bytes
    totalStorage: { type: Number, default: 1000000 }, // 10 MB in Bytes
});

module.exports = db.model("UserStorage", userStorageSchema);