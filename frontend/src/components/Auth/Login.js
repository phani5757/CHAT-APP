import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputRightElement,
  InputGroup,
  Button,
  Box,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

function Login() {
  const toast = useToast();
  const navigate = useNavigate();

  const [passwordShow, setPasswordShow] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordShow = () => setPasswordShow(!passwordShow);

  const onLoginClick = async () => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Fields",
        description: "Please fill all the fields",
        duration: 4000,
        status: "warning",
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/user/login",
      {
        email,
        password,
      },
      config
    );

    toast({
      title: "Login",
      description: "User login is success",
      duration: 4000,
      status: "success",
      isClosable: true,
    });
    setLoading(false);

    localStorage.setItem("userInfo", JSON.stringify(data));
    navigate("/chats");
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={`${passwordShow ? "text" : "password"}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handlePasswordShow}>
                {passwordShow ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button colorScheme="blue" onClick={onLoginClick} isLoading={loading}>
          Login
        </Button>
      </VStack>
    </Box>
  );
}

export default Login;
