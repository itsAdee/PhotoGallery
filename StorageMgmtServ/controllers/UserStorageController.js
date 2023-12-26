const UserStorage = require('../models/UserStorage');

const createUserStorage = async (req, res) => {
    const { userID } = req.body;
    console.log("Creating user storage for user: " + userID);

    try {
        const userStorage = await UserStorage.findOne({ userID });

        if (userStorage) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUserStorage = new UserStorage({
            userID,
            totalStorage: 10000000,
            usedStorage: 0
        });

        await newUserStorage.save();

        res.status(201).json({ message: "User storage created." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
        console.log("Error")
    }
}

const getUserStorageById = async (req, res) => {
    const { userID } = req.params;

    try {
        const userStorage = await UserStorage.findOne({ userID });

        if (!userStorage) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(userStorage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

const updateUserStorageOnUpload = async (req, res) => {
    const { userID, bandwidth } = req.body;

    try {
        const userStorage = await UserStorage.findOne({ userID });

        if (!userStorage) {
            console.log("User not found")
            return res.status(404).json({ message: "User not found." });
        }

        userStorage.usedStorage += Number(bandwidth);
        await userStorage.save();

        res.status(200).json({ message: "User storage updated on Image Upload." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

const updateUserStorageOnDeletion = async (req, res) => {
    const { userID, imageSize } = req.body;

    try {
        const userStorage = await UserStorage.findOne({ userID });

        if (!userStorage) {
            return res.status(404).json({ message: "User not found." });
        }

        userStorage.usedStorage = Math.max(0, userStorage.usedStorage - Number(imageSize));
        await userStorage.save();

        res.status(200).json({ message: "User storage updated on Image Deletion." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    getUserStorageById, updateUserStorageOnUpload, createUserStorage, updateUserStorageOnDeletion
};