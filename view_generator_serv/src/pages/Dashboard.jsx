import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

const Dashboard = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [images, setImages] = useState([]);
    const { user } = useAuthContext();

    useEffect(() => {
        // Fetch images from the server
        async function fetchImages() {
            await axios.get('http://localhost:4001/images'+user._id)
                .then((response) => {
                    setImages(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        fetchImages();
    }, [user]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = (event) => {
        event.preventDefault();
        if (selectedFile && user) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('userID', user._id);

            axios.post('http://localhost:4001/upload',
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
        <div>
            <h1>Dashboard</h1>
            <h1>Upload an image</h1>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <input type='submit' />
            </form>
            <div>
                {images && images.map((image) => (
                    <img key={image._id} src={image.imageUri} alt={image.imageName} />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;