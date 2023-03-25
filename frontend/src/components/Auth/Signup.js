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
  Image,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

function Signup() {
  const toast = useToast();
  const navigate = useNavigate();

  const [passwordShow, setPasswordShow] = useState(false);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [picture, setPicture] = useState();
  const [loading, setLoading] = useState(false);

  const handlePasswordShow = () => setPasswordShow(!passwordShow);

  const handlePicture = (e) => {
    setLoading(true);
    const pic = e.target.files[0];
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const formData = new FormData();
      formData.append("file", pic);
      formData.append("upload_preset", "mern_chat");
      formData.append("cloud_name", "dfpqxfxnf");

      fetch("https://api.cloudinary.com/v1_1/dfpqxfxnf/upload", {
        method: "post",
        body: formData,
      })
        .then((response) => response.json())
        .then((picData) => {
          setPicture(picData.url);
          setLoading(false);
        })
        .catch((err) => {
          toast({
            title: "Image error",
            description: err.message,
            duration: 4000,
            status: "error",
            isClosable: true,
          });
          setLoading(false);
        });
    } else {
      toast({
        title: "Image type",
        description: "Image should be JPEG or PNG",
        duration: 4000,
        status: "warning",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmPassword || !picture) {
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

    if (password !== confirmPassword) {
      toast({
        title: "Password",
        description: "Password and confirm password miss match",
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
      "/api/user",
      {
        name,
        email,
        password,
        pic: picture,
      },
      config
    );

    toast({
      title: "Registration",
      description: "User registration is success",
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
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter Email"
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
        <FormControl isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={`${passwordShow ? "text" : "password"}`}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handlePasswordShow}>
                {passwordShow ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Profile Picture</FormLabel>
          <Input type="file" p="1" accept="image/*/" onChange={handlePicture} />
        </FormControl>
        {picture && (
          <Box display="flex" justifyContent="center">
            <Image src={picture} borderRadius="full" boxSize="150px" alt="DP" />
          </Box>
        )}
        <Button colorScheme="blue" isLoading={loading} onClick={handleRegister}>
          Sign Up
        </Button>
      </VStack>
    </Box>
  );
}

export default Signup;
