import React, { useState } from 'react';
import { Box, Button, Image, Input } from '@chakra-ui/react';

function ImageCard(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(props.imageName);

  const handleRenameClick = () => {
    setIsEditing(true);
  };

  const handleSaveRename = () => {
    props.onRename(props.id, newName);
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setNewName(props.imageName);
    setIsEditing(false);
  };

  const handleOpenImage = () => {
    props.onOpenImage(props.id);
  };

  const handleDownload = () => {
    props.onDownload(props.id);
  };

  return (
    <Box
      className="image-container"
      flex="0 0 calc(20% - 10px)"
      padding="10px"
      border="2px solid #01d28e"
      marginLeft="10px"
      marginTop="10px"
      marginRight="10px"
    >
      <Image src={props.imageUri} alt={props.imageName} width="300px" />

      <Button onClick={() => props.onDelete(props.id)} mt="2" colorScheme="red">
        Delete
      </Button>

      <Button onClick={handleOpenImage} mt="2" ml="2" colorScheme="teal">
        Open
      </Button>

      {!isEditing ? (
        <>
          <Button onClick={handleRenameClick} mt="2" ml="2" colorScheme="blue">
            Rename
          </Button>
        </>
      ) : (
        <>
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            mr="2"
            mt="2"
            width="60%"
          />
          <Button onClick={handleSaveRename} mt="2" ml="2" colorScheme="green">
            Save
          </Button>
          <Button onClick={handleCancelRename} mt="2" ml="2" colorScheme="gray">
            Cancel
          </Button>
        </>
      )}

      <Button onClick={handleDownload}>
        Download
      </Button>
    </Box>
  );
}

export default ImageCard;
