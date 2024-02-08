const express = require("express");
const storageRouter = express.Router();
const {
    getUserStorageById,
    updateUserStorageOnUpload,
    createUserStorage,
    updateUserStorageOnDeletion
} = require("../controllers/UserStorageController");
const verifyToken = require("../controllers/JwtVerification");

storageRouter.post("/updateUserStorageOnUpload", updateUserStorageOnUpload);
storageRouter.post("/createUserStorage", createUserStorage);
storageRouter.post("/updateUserStorageOnDeletion", updateUserStorageOnDeletion);
storageRouter.get("/",verifyToken,getUserStorageById);

module.exports = { storageRouter };