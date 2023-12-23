import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { Heading, Box, Input, Button, FormControl, FormLabel, FormHelperText, SimpleGrid } from '@chakra-ui/react';
import ImageCard from '../components/ImageCard';

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    // Fetch images from the server
    async function fetchImages() {
      try {
        const response = await axios.get(`http://localhost:4001/images/${user._id}`);
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

      try {
        const response = await axios.post('http://localhost:4001/upload', formData);
        console.log(response.data);

        if (response.status === 200) {
          setImages((prevImages) => [...prevImages, response.data]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = async (imageId) => {
    try {
      const response = await axios.delete(`http://localhost:4001/images/${imageId}`);

      if (response.status === 200) {
        console.log(response.data);
        setImages((prevImages) => prevImages.filter((image) => image._id !== imageId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Heading as="h1" mb={4}>
        Dashboard
      </Heading>
      <Box>
        <Heading as="h2" mb={2}>
          Upload a new picture
        </Heading>
        <form onSubmit={handleUpload} className="upload-form">
          <FormControl>
            <FormLabel>Select a file</FormLabel>
            <Input type="file" onChange={handleFileChange} />
            <FormHelperText>Only image files are allowed.</FormHelperText>
          </FormControl>
          <Button type="submit" mt={2} colorScheme="teal">
            Upload
          </Button>
        </form>

        <SimpleGrid columns={3} spacing={4} mt={4}>
          {images.map((image) => (
            <ImageCard
              key={image._id}
              id={image._id}
              imageUri={image.imageUri}
              imageName={image.imageName}
              onDelete={handleDelete}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Dashboard;
