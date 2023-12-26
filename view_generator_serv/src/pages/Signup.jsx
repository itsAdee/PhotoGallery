import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { Box, Button, Flex, FormControl, FormLabel, Input, Text, Center, Stack, Link } from "@chakra-ui/react";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(userName, email, password, confirmPassword);
  };

  return (
    <Center minHeight="100vh">
      <Flex bg="gray.50">
        <Box as="form" className="signup" onSubmit={handleSubmit} p={5} shadow="md" borderWidth={1} width="400px">
          <Center>
            <Text fontSize="xl" mb={5}>Sign Up</Text>
          </Center>
          <FormControl id="username" isRequired>
            <FormLabel>User Name</FormLabel>
            <Input type="text" onChange={(e) => setUserName(e.target.value)} value={userName} />
          </FormControl>
          <FormControl id="email" isRequired mt={4}>
            <FormLabel>Email</FormLabel>
            <Input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
          </FormControl>
          <FormControl id="password" isRequired mt={4}>
            <FormLabel>Password</FormLabel>
            <Input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
          </FormControl>
          <FormControl id="confirmPassword" isRequired mt={4}>
            <FormLabel>Confirm Password</FormLabel>
            <Input type="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
          </FormControl>
          <Button colorScheme="blue" isLoading={isLoading} type="submit" mt={4} w='100%'>Sign Up</Button>
          {error && <Text color="red.500" mt={3} wordBreak="break-word">{error}</Text>}
          <Flex mt={4}>
            <Stack direction='row' w="full" spacing={3} justifyContent='space-between' alignItems="center">
              <Text mr={1} fontSize='md'>Already have an account?</Text>
              <Link href="/login">
                <Button colorScheme="teal" variant='outline'>Log In</Button>
              </Link>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </Center>
  );
};

export default Signup;