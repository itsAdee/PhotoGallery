import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import ImageCard from '../components/ImageCard';
// import "./css/styles.css";

const Dashboard = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [images, setImages] = useState([]);
    const { user } = useAuthContext();

    useEffect(() => {
        // Fetch images from the server
        async function fetchImages() {
            try {
                const response = await axios.get('http://localhost:4001/images/' + user._id);
                setImages(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchImages();
    }, [user]);


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (selectedFile && user) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('userID', user._id);

            await axios.post('http://localhost:4001/upload',
                formData
            ).then(async (response) => {
                console.log(response.data);

                if (response.status === 200) {
                    setImages(prevImages => [...prevImages, response.data]);
                }

            }).catch((error) => {
                console.error(error);
            });
        }
    };

    const handleDelete = async (imageId) => {
        await axios.request({
            method: 'DELETE',
            url: `http://localhost:4001/images/${imageId}`

        }).then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                setImages(prevImages => prevImages.filter((image) => image._id !== imageId));
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <>
            <h1>Dashboard</h1>
            <div>
                <h1>Upload a new picture</h1>
                <form onSubmit={handleUpload} className="upload-form">
                    <input type="file" onChange={handleFileChange} />
                    <input type='submit' />
                </form>

                <div className="images">
                    {images.map((image) => (
                        <ImageCard key={image._id}  id={image._id} imageUri={image.imageUri} imageName={image.imageName} onDelete={handleDelete} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Dashboard;