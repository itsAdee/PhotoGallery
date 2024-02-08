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

imageRouter.get("/download/:id/user/:userID",verifyToken,downloadImage)
imageRouter.post("/upload",verifyToken ,uploadImage);
imageRouter.get("/user/:userID", verifyToken,getImages);
imageRouter.put("/rename/:id/user/:userID",verifyToken, renameImage);
imageRouter.delete("/:id/user/:userID", verifyToken,deleteImage);

module.exports = { imageRouter };