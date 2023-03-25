import React from "react";
import { Box } from "@chakra-ui/react";

import { ChatState } from "../context/ChatProvider";
import SingleChat from "../components/SingleChat";

const ChatBox = () => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
