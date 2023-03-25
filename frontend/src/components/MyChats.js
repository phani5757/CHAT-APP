import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";

import { ChatState } from "../context/ChatProvider";
import { getSender } from "../helper/chat";
import GroupModal from "./GroupModal";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState({});
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    if (user.token) fetchChats();
  }, [user.token]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      setLoading(false);
    } catch (error) {}
  };

  const onChatItemClick = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        My Chats
        <GroupModal>
          <Button
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        <Stack overflowY="auto">
          {chats.map((c) => (
            <Box
              cursor="pointer"
              bg={selectedChat?._id === c._id ? "#38B2AC" : "#E8E8E8"}
              color={selectedChat?._id === c._id ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={c._id}
              onClick={() => onChatItemClick(c)}
            >
              <Text>
                {!c.groupChat ? getSender(loggedUser, c.users) : c.chatName}
              </Text>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default MyChats;
