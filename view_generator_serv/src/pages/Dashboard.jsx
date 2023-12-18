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
        <div>
            <h1>Dashboard</h1>
            <h1>Upload an image</h1>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <input type='submit' />
            </form>
            <div>
                {images && images.map((image) => (
                    <div key={image._id}>
                        <img key={image._id} src={image.imageUri} alt={image.imageName} />
                        <button onClick={() => handleDelete(image._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;