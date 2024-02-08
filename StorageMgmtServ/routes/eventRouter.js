const express = require("express");
const eventRouter = express.Router();
const axios = require("axios");

eventRouter.post("/", async (req, res) => {
    const { type } = req.body;
    console.log("StorageMgmtServ: Received Event:", type);


    if (type === "NewUserCreated") {
        console.log("StorageMgmtServ: Creating user...")

        await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:4001/api/storageMgmt/storage/createUserStorage',
            headers: {
                'Content-Type': 'application/json'
            },
            data: req.body
        }).catch((err) => {
            console.log(err.message);
        });

    }
    if (type === "ImageDeleted") {
        console.log("StorageMgmtServ: Deleting image...")

        await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:4001/api/storageMgmt/storage/updateUserStorageOnDeletion',
            headers: {
                'Content-Type': 'application/json'
            },
            data: req.body
        }).catch((err) => {
            console.log(err.message);
        });
    }
    if (type === "ImageUploaded") {
        console.log("StorageMgmtServ: Uploading image...")

        await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:4001/api/storageMgmt/storage/updateUserStorageOnUpload',
            headers: {
                'Content-Type': 'application/json'
            },
            data: req.body
        }).catch((err) => {
            console.log(err.message);
        });
    }

    res.send({});
});

module.exports = { eventRouter };