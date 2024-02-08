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
const verifyToken = require("../controllers/JwtVerification");

imageRouter.use(fileUpload());

imageRouter.get("/download/:id",verifyToken,downloadImage)
imageRouter.post("/upload",verifyToken ,uploadImage);

imageRouter.put("/rename/:id",verifyToken, renameImage);
imageRouter.delete("/:id", verifyToken,deleteImage);
imageRouter.get("/", verifyToken,getImages);

module.exports = { imageRouter };