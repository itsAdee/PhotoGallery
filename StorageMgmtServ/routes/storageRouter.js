const express = require("express");
const storageRouter = express.Router();
const {
    getUserStorageById,
    updateUserStorageOnUpload,
    createUserStorage,
    updateUserStorageOnDeletion
} = require("../controllers/UserStorageController");

storageRouter.post("/updateUserStorageOnUpload", updateUserStorageOnUpload);
storageRouter.post("/createUserStorage", createUserStorage);
storageRouter.post("/updateUserStorageOnDeletion", updateUserStorageOnDeletion);
storageRouter.get("/:userID", getUserStorageById);

module.exports = { storageRouter };