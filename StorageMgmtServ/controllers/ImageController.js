const multer = require("multer");
const Image = require("../models/Image");
const axios = require('axios');

const upload = multer({ limits: { fileSize: 1000000 }, dest: '/uploads/' }).single('file');

const uploadImage = async (req, res) => {
    console.log("Upload Image Successfully Called")
    const { userID } = req.body;
    const file = req.files.file;
    console.log(file);
    console.log(userID);

    const storage = await axios.request({
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:4001/api/storageMgmt/storage/' + userID,
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch((err) => {
        console.log(err.message);
    })

    console.log(storage);
    if (!storage || parseInt(storage.usedStorage) + parseInt(file.size) > parseInt(storage.totalStorage)) {
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

    try {
        upload(req, res, function (err) {
            if (err) {
                console.log("Error uploading file in the upload endpoint.")
                console.log(err);
                res.status(500).json({ error: 'Error uploading file in the upload endpoint.' });
            }

            if (file == null) {
                res.send('File not found');
            } else {
                var encImg = file.data.toString('base64');

                var newItem = {
                    userID: userID,
                    imageName: file.name,
                    imageSize: file.size,
                    contentType: file.mimetype,
                    img: Buffer.from(encImg, 'base64')
                };

                Image.create(newItem)
                    .then(async (result) => {
                        console.log('Image inserted!');

                        const base64Data = result.img.toString('base64');
                        const imageUri = `data:${result.contentType};base64,${base64Data}`;

                        const modifiedImage = {
                            _id: result._id,
                            userID: result.userID,
                            imageName: result.imageName,
                            imageSize: result.imageSize,
                            contentType: result.contentType,
                            imageUri: imageUri,
                        };

                        await axios.request({
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'http://localhost:4000/api/eventbus/events',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                type: "ImageUploaded",
                                userID: userID,
                                imageName: file.name,
                                bandwidth: file.size,
                                requestType: "Upload"
                            }
                        }).catch((err) => {
                            console.log(err.message);
                        });

                        res.status(200).json(modifiedImage);
                    })
                    .catch(function (error) {
                        console.error('Error inserting image:', error);
                        res.status(500).json({ error: 'Failed to insert image' });
                    });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

const getImages = async (req, res) => {
    const { userID } = req.params;
    try {
        const images = await Image.find({ userID });

        if (!images) {
            return res.status(404).json({ message: `Images not found.` });
        }

        const modifiedImages = images.map((image) => {
            const base64Data = image.img.toString('base64');
            const imageUri = `data:${image.contentType};base64,${base64Data}`;

            return {
                _id: image._id,
                userID: image.userID,
                imageName: image.imageName,
                imageSize: image.imageSize,
                contentType: image.contentType,
                createdAt: image.createdAt,
                updatedAt: image.updatedAt,
                imageUri: imageUri,
            };
        });

        res.status(200).json(modifiedImages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

const deleteImage = async (req, res) => {
    const { id, userID } = req.params;
    try {
        const image = await Image.find({ _id: id, userID });
        const file = { name: image.imageName, size: image.imageSize };

        if (!image) {
            return res.status(404).json({ message: "Image not found." });
        }

        await image.deleteOne({ _id: req.params.id });

        await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:4000/api/eventbus/events',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                type: "ImageDeleted",
                userID: userID,
                imageName: file.name,
                imageSize: file.size,
            }
        }).catch((err) => {
            console.log(err.message);
        });

        res.status(200).json({ message: "Image deleted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

const renameImage = async (req, res) => {
    const { id, userID } = req.params;
    const { imageName } = req.body;
    try {
        const image = await Image.find({ _id: id, userID });

        if (!image) {
            return res.status(404).json({ message: "Image not found." });
        }

        await image.updateOne({ imageName });

        res.status(200).json({ message: "Image renamed." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    uploadImage,
    getImages,
    deleteImage,
    renameImage
};