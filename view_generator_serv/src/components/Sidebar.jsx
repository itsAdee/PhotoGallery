import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, VStack, HStack, Flex, Divider, Avatar, Text, Progress, Button, Heading, Icon, Tooltip } from '@chakra-ui/react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { FaImages, FaChartBar } from "react-icons/fa";
import { MdStorage } from "react-icons/md";
import { VscSignOut } from "react-icons/vsc";
import axios from 'axios';

function Sidebar(props) {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [storageUsed, setStorageUsed] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);

  useEffect(() => {
    const getStorageUsed = async () => {
      try {
        const response = await axios.get(`http://photogallery.com/api/storageMgmt/storage/${user._id}`);
        const data = await response.data;
        setStorageUsed(data.usedStorage);
        setTotalStorage(data.totalStorage);
      } catch (error) {
        console.error(error);
      }
    }

    getStorageUsed();
  }, [props.usedStorage]); 

  const handleLogout = () => {
    logout();
  };

  const progressBarColor = storageUsed / totalStorage * 100 >= 80 ? 'red' : storageUsed / totalStorage * 100 >= 65 ? 'yellow' : 'green';

  return (
    <Flex direction="column" w="320px" h="100vh" p="3" borderRight="1px" borderColor="gray.600" justifyContent="space-between" bg="gray.800" color="white">
      <VStack align="start" spacing="5">
        <Flex align="center">
          {/* <Image src="logo.png" alt="Logo" boxSize="8" borderRadius="full" /> */}
          <Heading size="lg" ml="2">PhotoGallery</Heading>
        </Flex>
        <Divider />
        <HStack>
          <Avatar size="lg" name={user.username} src="/path/to/user/avatar.png" />
          <VStack align="start">
            <Text fontSize="lg">{user.username}</Text>
            <Text fontSize="sm">{user.email}</Text>
          </VStack>
        </HStack>
        <VStack align="start" spacing="3" w="100%">
          <Link to="/" style={{ display: 'block', width: '100%' }}>
            <Box as={Flex} width="100%" alignItems="center" _hover={{ bg: 'gray.700' }}>
              <Icon as={FaImages} aria-label="Usage Monitoring" variant="ghost" color="white" m="3" />
              <Text>Dashboard</Text>
            </Box>
          </Link>
          <Link to="/usage" style={{ display: 'block', width: '100%' }}>
            <Box as={Flex} width="100%" alignItems="center" _hover={{ bg: 'gray.700' }}>
              <Icon as={FaChartBar} aria-label="Usage Monitoring" variant="ghost" color="white" m="3" />
              <Text>Usage</Text>
            </Box>
          </Link>
        </VStack>
      </VStack>
      <VStack align="start" spacing="5" w="100%">
        <HStack w="100%">
          <Icon as={MdStorage} aria-label="Usage Monitoring" variant="ghost" color="white" m="3" />
          <Tooltip label={`${storageUsed / 1000000} MB used`} aria-label="A tooltip" placement="top">
            <Progress colorScheme={progressBarColor} size='lg' value={storageUsed / totalStorage * 100} w="full" mr="3" borderRadius="10" />
          </Tooltip>
        </HStack>
        <Button leftIcon={<VscSignOut />} bg="white" color="gray.900" onClick={handleLogout} w="full">
          Sign Out
        </Button>
      </VStack>
    </Flex>
  );
}

export default Sidebar;