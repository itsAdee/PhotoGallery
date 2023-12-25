const UserStorage = require('../models/UserStorage');
const axios = require("axios");

const createUserStorage = async (req, res) => {
    const { userID } = req.body;

    try {
        const userStorage = await UserStorage.findOne({ userID });

        if (userStorage) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUserStorage = new UserStorage({
            userID,
            totalStorage: 1000000,
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
    const { userID } = req;

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

const updateUserStorageOnUpload = async (req, res, next) => {
    console.log(req.body)
    const { userID } = req.body;
    const file = req.files.file;
    console.log(file.size)


    try {
        const userStorage = await UserStorage.findOne({ userID });

        if (!userStorage) {
            console.log("User not found")
            return res.status(404).json({ message: "User not found." });
        }

        if (file && parseInt(file.size) + parseInt(userStorage.usedStorage) > parseInt(userStorage.totalStorage)) {
            return res.status(400).json({ message: "Not enough storage." });
        }

        const usage = await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:4002/api/usageMntr/usage/' + userID,
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch((err) => {
            console.log(err.message);
        })

        if (usage && parseInt(usage.usedBandwidth) + parseInt(file.size) > parseInt(usage.totalBandwidth)) {
            return res.status(400).json({ message: "Not enough bandwidth." });
        }

        userStorage.usedStorage += Number(file.size);
        await userStorage.save();

        next();
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

        userStorage.usedStorage -= Number(imageSize);
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