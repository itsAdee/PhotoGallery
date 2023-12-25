const express = require('express');
const imageRouter = express.Router();
const {
    getImages,
    deleteImage,
    renameImage
} = require("../controllers/ImageController");

imageRouter.get("/user/:userID", getImages);
imageRouter.delete("/:id/user/:userID", deleteImage);
imageRouter.put("/:id/user/:userID", renameImage);

module.exports = { imageRouter };