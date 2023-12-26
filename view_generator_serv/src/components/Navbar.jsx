import React from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import {  Flex, Text, Button} from '@chakra-ui/react';

function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="10px"
      marginBottom="30px"
      backgroundColor="#01d28e"  // Light green background
    >
      <Text fontSize="30px" color="white" fontFamily="'Handlee', cursive">
        Photo Gallery
      </Text>

      {user && (
        <Flex align="center">
          <Text fontSize="20px" marginRight="4" fontFamily="'Open Sans', sans-serif" color="white">
            {user.email}
          </Text>
          <Button colorScheme="teal" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      )}
    </Flex>
  );
}

export default Navbar;
