import { React, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import ImageCard from './ImageCard';
import "./css/styles.css";

function Dashboard() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [images, setImages] = useState([{ "_id": 1234, "imageUri": require("./placeholder.png") }, { "_id": 1235, "imageUri": require("./placeholder.png") }, { "_id": 1236, "imageUri": require("./placeholder.png") }, { "_id": 1237, "imageUri": require("./placeholder.png") }, { "_id": 1238, "imageUri": require("./placeholder.png") }, { "_id": 1239, "imageUri": require("./placeholder.png") }, { "_id": 1240, "imageUri": require("./placeholder.png") }, { "_id": 1241, "imageUri": require("./placeholder.png") }]);
    const [upload, setUpload] = useState();

    useEffect(() => {
        // Fetch images from the server
        async function fetchImages() {
            await axios.get('http://localhost:4001/images')
                .then((response) => {
                    setImages(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        fetchImages();
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = (event) => {
        event.preventDefault();
        if (selectedFile) {
            const formData = new FormData();
            formData.append('type', 'ImageUploaded')
            formData.append('file', selectedFile);
            formData.append('userID', '123');

            axios.post('http://localhost:4000/events',
                formData
            ).then(async (response) => {
                console.log(response.data);
                // Refresh the images after successful upload
                await axios.get('http://localhost:4001/images')
                    .then((response) => {
                        setImages(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
                .catch((error) => {
                    console.error(error);
                });
        }
    };
    return (
        <>
            <Navbar />
            <div>
                <h1>Upload a new picture</h1>
                <form onSubmit={handleUpload} className="upload-form">
                    <input type="file" onChange={handleFileChange} />
                    <input type='submit' />
                </form>

                <div className="images">
                    {images.map((image) => (
                        <ImageCard key={image._id} imageUri={image.imageUri} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Dashboard