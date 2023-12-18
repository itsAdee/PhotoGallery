import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Box, Button, Flex, FormControl, FormLabel, Input, Text, Center, Stack, Link } from "@chakra-ui/react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    }

    return (
        <Center>
            <Flex bg="gray.50">

                <Box as="form" className="login" onSubmit={handleSubmit} p={5} shadow="md" borderWidth={1}>
                    <Center>
                        <Text fontSize="xl" mb={5}>Log In</Text>
                    </Center>

                    <FormControl id="username" isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
                    </FormControl>
                    <FormControl id="password" isRequired mt={4}>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    </FormControl>
                    <Button colorScheme="blue" isLoading={isLoading} type="submit" mt={4} w='100%'>Log In</Button>
                    {error && <Text color="red.500" mt={3}>{error}</Text>}

                    <Flex mt={4}>
                        <Stack direction='row' spacing={3}>
                            <Text mr={1} fontSize='md'>Do not have an account?</Text>
                            <Link href="/signup">
                                <Button colorScheme="teal" variant='outline'>Sign Up</Button>
                            </Link>

                        </Stack>

                    </Flex>


                </Box>
            </Flex>
        </Center>

    );
};

export default Login;