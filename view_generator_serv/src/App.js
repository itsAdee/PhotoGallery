import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/loginForm';
import Signup from './components/signUpForm';
import { useAuthContext } from "./hooks/useAuthContext";
import { useLogout } from "./hooks/useLogout";


function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);
  const { user } = useAuthContext();
  const { logout } = useLogout();

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
  }, [user]);

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

  const handleClick = async () => {
    await logout();
  };

  return (

    <div className="App">
      {!user && <Login />}
      {!user && <Signup />}
      {user && <h1>Welcome {user.username}</h1>}
      {user && (
        <div>
          <span>{user.email}</span>
          <button onClick={handleClick}>Logout</button>
        </div>
      )}
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

export default App;
