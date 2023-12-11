const UserStorage = require('../models/UserStorage');

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

const updateUserStorage = async (req, res, next) => {
    console.log(req.body)
    const { userID, usedStorage } = req.body;
    const file = req.files.file;
    console.log(file.size)


    try {
        const userStorage = await UserStorage.findOne({ userID });

        if (!userStorage) {
            console.log("User not found")
            return res.status(404).json({ message: "User not found." });
        }

        if (file && parseInt(file.size)+ parseInt(userStorage.usedStorage) > parseInt(userStorage.totalStorage)) {
            return res.status(400).json({ message: "Not enough storage." });
        }

        userStorage.usedStorage += Number(file.size);
        await userStorage.save();

        next()
        // res.status(200).json({ message: "User storage updated." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    getUserStorageById, updateUserStorage
};