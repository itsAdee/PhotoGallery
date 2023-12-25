const express = require("express");
const storageRouter = express.Router();
const axios = require("axios");
const fileUpload = require("express-fileupload");

const {
    getUserStorageById,
    updateUserStorageOnUpload,
    createUserStorage,
    updateUserStorageOnDeletion
} = require("../controllers/UserStorageController");
const { uploadImage } = require("../controllers/ImageController");

storageRouter.use(fileUpload());
storageRouter.use("/:userID", getUserStorageById);
storageRouter.post("/upload", updateUserStorageOnUpload, uploadImage);
storageRouter.post("/createUserStorage", createUserStorage);
storageRouter.post("/updateUserStorageOnDeletion", updateUserStorageOnDeletion);

// Endpoint to handle storage usage alert
storageRouter.post("/usageAlert", async (req, res) => {
    const { userID } = req.body;

    try {
        const userStorage = await UserStorage.findOne({ userID });

        if (!userStorage) {
            return res.status(404).json({ message: "User not found." });
        }

        const { usedStorage, totalStorage } = userStorage;

        if ((usedStorage / totalStorage) * 100 >= 80) {
            // Generate storage alert for the user (via EventBus or other means)
            axios.post("http://localhost:4000/events", {
                type: "StorageAlert",
                data: {
                    userID,
                    message: "Storage usage is nearing the limit.",
                },
            });
        }

        res.status(200).json({ message: "Usage check completed." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = { storageRouter };