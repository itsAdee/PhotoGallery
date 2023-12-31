import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import {
  Heading,
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  SimpleGrid,
  Text,
  Select,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import ImageCard from '../components/ImageCard';

const Dashboard = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);
  const [viewType, setViewType] = useState('large');
  const [error, setError] = useState(null);

  const { user } = useAuthContext();

  useEffect(() => {
    // Fetch images from the server
    async function fetchImages() {
      try {
        const response = await axios.get(`http://photogallery.com/api/storageMgmt/images/user/${user._id}`);
        setImages(response.data);
      } catch (error) {
        console.error(error);
        setError(error.response.data.message);
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
<<<<<<< Updated upstream
        const response = await axios.post('http://photogalleryd.com/api/storageMgmt/images/upload', formData);
=======
        const response = await axios.post('http://photogallery.com/api/storageMgmt/images/upload', formData);
>>>>>>> Stashed changes
        console.log(response.data);

        if (response.status === 200) {
          setImages((prevImages) => [...prevImages, response.data]);
          props.setUsedStorage(props.usedStorage + response.data.imageSize);
        }
      } catch (error) {
        console.error(error);
        setError(error.response.data.message);
      }
    }
  };

  const handleDelete = async (imageId) => {
    try {
      const response = await axios.delete(`http://photogallery.com/api/storageMgmt/images/${imageId}/user/${user._id}`);

      if (response.status === 200) {
        console.log(response.data);
        setImages((prevImages) => prevImages.filter((image) => image._id !== imageId));
        props.setUsedStorage(props.usedStorage - response.data.imageSize);
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    }
  };

  const handleRename = (imageId, newName) => {
    try {
      const response = axios.request({
        method: 'put',
        url: `http://photogallery.com/api/storageMgmt/images/rename/${imageId}/user/${user._id}`,
        data: {
          imageName: newName,
        }
      });

      if (response.status === 200) {
        console.log(response.data);
        setImages((prevImages) =>
          prevImages.map((image) => {
            if (image._id === imageId) {
              return { ...image, imageName: newName };
            }
            return image;
          })
        );
      }
    } catch (error) {
      console.error(error);
      setError(error.response ? error.response.data.message : 'Rename failed');
    }
  };

  const handleDownload = async (imageId) => {
    try {
      const response = await axios.get(`http://photogallery.com/api/storageMgmt/images/download/${imageId}/user/${user._id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'downloaded_image';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename=(.*)/);
        if (fileNameMatch && fileNameMatch.length === 2)
          fileName = fileNameMatch[1];
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);

      try {
        await axios.request({
          method: 'post',
          url: `http://photogallery.com/api/eventbus/events`,
          data: {
            type: 'ImageDownloaded',
            bandwidth: response.headers['content-length'],
            userID: user._id,
            requestType: 'Download',

          },
        })
      }
      catch (error) {
        console.error(error);
        setError(error.response ? error.response.data.message : 'Download failed');
      }


      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      setError(error.response ? error.response.data.message : 'Download failed');
    }
  };

  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
  };

  const renderImageCards = () => {
    return images.map((image) => (
      <ImageCard
        key={image._id}
        id={image._id}
        imageUri={image.imageUri}
        imageName={image.imageName}
        imageType={image.imageType}
        imageSize={image.imageSize}
        onDelete={handleDelete}
        onRename={handleRename}
        onDownload={handleDownload}
      />
    ));
  };

  return (
    <Box>
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

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

        <Box mt={4}>
          <Text fontSize="lg" mb={2}>
            View Type:
          </Text>
          <Select value={viewType} onChange={handleViewTypeChange} w="120px">
            <option value="list">List</option>
            <option value="detailedList">Detailed List</option>
            <option value="small">Small</option>
            <option value="large">Large</option>
          </Select>
        </Box>

        <SimpleGrid columns={viewType === 'list' ? 1 : viewType === 'detailedList' ? 1 : 3} spacing={4} mt={4}>
          {viewType === 'detailedList'
            ? images.map((image) => (
              <ImageCard
                key={image._id}
                id={image._id}
                imageUri={image.imageUri}
                imageName={image.imageName}
                imageType={image.imageType}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))
            : renderImageCards()}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Dashboard;