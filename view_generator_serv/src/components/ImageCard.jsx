import React from 'react';
import { Box, Button, Image } from '@chakra-ui/react';

function ImageCard(props) {
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
        <Image src={require('./images/delete.png')} alt="delete icon" width="20px" cursor="pointer" />
      </Button>
    </Box>
  );
}

export default ImageCard;
