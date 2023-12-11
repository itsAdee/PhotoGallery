import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './components/loginForm';
import RegisterForm from './components/registerForm';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);

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
    <div className="App">
      <LoginForm />
      <RegisterForm />  
      <h1>Upload an image</h1>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <input type='submit' />
      </form>

      <div>
        {images.map((image) => (
          <img key={image._id} src={image.imageUri} alt={image.imageName} />
        ))}
      </div>
    </div>
  );
}

export default App;
