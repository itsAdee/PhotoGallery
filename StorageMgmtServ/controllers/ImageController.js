const multer = require("multer");
const Image = require("../models/Image");

const upload = multer({ limits: { fileSize: 1000000 }, dest: '/uploads/' }).single('file');

const uploadImage = async (req, res) => {
    console.log("Upload Image Successfully Called")
    const { userID, usedStorage } = req.body;
    const file = req.files.file;
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
                    .then(function () {
                        console.log('Image inserted!');

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
    try {
        const images = await Image.find();
    
        const modifiedImages = images.map((image) => {
          const base64Data = image.img.toString('base64');
          const imageUri = `data:${image.contentType};base64,${base64Data}`;
          
          return {
            _id: image._id,
            userID: image.userID,
            imageName: image.imageName,
            imageSize: image.imageSize,
            contentType: image.contentType,
            imageUri: imageUri,
          };
        });
    
        res.status(200).json(modifiedImages);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
      }
}

module.exports = {
    uploadImage,
    getImages
};