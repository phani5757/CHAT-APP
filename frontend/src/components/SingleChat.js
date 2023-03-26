import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  IconButton,
  Spinner,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";
import { io } from "socket.io-client";
import Lottie from "lottie-react";

import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../helper/chat";
import ProfileModal from "../components/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import animation from "../assets/load_animation.json";
const URL = "https://chat-app-production-2f9e.up.railway.app/";
let socket;
let timeOutId;

const SingleChat = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  const toast = useToast();

  useEffect(() => {
    socket = io(URL);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
  }, []);

  useEffect(() => {
    socket.on("received message", (newMsg) => {
      console.log("newMsg");
      if (!selectedChat?._id || selectedChat._id !== newMsg.chat._id) {
        setNotifications([newMsg, ...notifications]);
      } else {
        console.log(newMsg);
        setMessages([...messages, newMsg]);
      }
    });

    socket.on("start typing", () => {
      console.log("typing");
      setIsTyping(true);
    });

    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      setNewMessage("");

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        setMessages([...messages, data]);

        socket.emit("new message", data);
        socket.emit("stop typing", selectedChat._id);
      } catch (error) {
        toast({
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat?._id) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {}
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat?._id]);

  const handleMessage = (e) => {
    setNewMessage(e.target.value);
    socket.emit("start typing", selectedChat._id);

    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
    }, 3000);
  };

  return (
    <>
      {selectedChat?._id ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            display="flex"
            justifyContent="space-between"
            w="full"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Arrow Back"
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat?.groupChat ? (
              <>
                <Text display="flex">
                  {getSender(user, selectedChat.users)}
                </Text>
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <Text>{selectedChat.chatName.toUpperCase()}</Text>
            )}
          </Box>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {messages?.length > 0 && (
              <Box
                display="flex"
                flexDirection="column"
                alignContent="flex-end"
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}
            {loading ? (
              <Spinner
                size="xl"
                alignSelf="center"
                margin="auto"
                w={20}
                h={20}
              />
            ) : (
              <>
                {isTyping ? (
                  <Box width="50px">
                    <Lottie
                      animationData={animation}
                      height={40}
                      width={40}
                      loop={true}
                    />
                  </Box>
                ) : (
                  <></>
                )}
                <FormControl onKeyDown={sendMessage}>
                  <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Message"
                    value={newMessage}
                    onChange={handleMessage}
                  />
                </FormControl>
              </>
            )}
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="full"
          fontSize="3xl"
        >
          <Text>Click on the user to start chatting.</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
