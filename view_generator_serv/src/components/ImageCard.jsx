import React, { useState } from 'react';
import {
  Box, Button, Image, Input, Menu, MenuButton, MenuList, MenuItem, IconButton, Text, Center, Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

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

  const handleDownload = () => {
    props.onDownload(props.id);
  };

  const formatSize = (size) => {
    const sizeInMB = size / (1024 * 1024);
    if (sizeInMB > 1) {
      return `${sizeInMB.toFixed(2)} MB`;
    } else {
      return `${(sizeInMB * 1024).toFixed(2)} KB`;
    }
  };

  return (
    <Box p="5" maxW="320px" borderWidth="1px">
      <Image borderRadius="md" src={props.imageUri} alt={props.imageName} />

      <Center>
        <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
          {isEditing ? (
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              mr="2"
              mt="2"
              width="60%"
            />
          ) : (
            newName
          )}
        </Text>
      </Center>

      <Stat mt={2}>
        <StatLabel>Image Size</StatLabel>
        <StatNumber fontSize="md" fontWeight="semibold">
          {formatSize(props.imageSize)}
        </StatNumber>
      </Stat>

      {isEditing ? (
        <Box display="flex" justifyContent="center" mt="2">
          <Button onClick={handleSaveRename} ml="2" colorScheme="green">
            Save
          </Button>
          <Button onClick={handleCancelRename} ml="2" colorScheme="gray">
            Cancel
          </Button>
        </Box>
      ) : (
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<ChevronDownIcon />}
            variant="outline"
            mt="2"
          />
          <MenuList>
            <MenuItem onClick={() => props.onDelete(props.id)}>Delete</MenuItem>
            <MenuItem onClick={handleDownload}>Download</MenuItem>
            <MenuItem onClick={handleRenameClick}>Rename</MenuItem>
          </MenuList>
        </Menu>
      )}
    </Box>
  );
}

export default ImageCard;