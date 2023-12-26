const express = require('express');
const imageRouter = express.Router();
const {
    getImages,
    deleteImage,
    renameImage,
    uploadImage,
    downloadImage
} = require("../controllers/ImageController");
const fileUpload = require("express-fileupload");

imageRouter.use(fileUpload());

imageRouter.get("/download/:id/user/:userID", downloadImage)
imageRouter.post("/upload", uploadImage);
imageRouter.get("/user/:userID", getImages);
imageRouter.put("rename/:id/user/:userID", renameImage);
imageRouter.delete("/:id/user/:userID", deleteImage);

module.exports = { imageRouter };