const db = require("mongoose");

const userStorageSchema = new db.Schema({
    userID: db.Schema.Types.ObjectId,
    usedStorage: { type: Number, default: 0 }, // in Bytes
    totalStorage: { type: Number, default: 10000000 }, // 10 MB in Bytes
}, { timestamps: true });

module.exports = db.model("UserStorage", userStorageSchema);