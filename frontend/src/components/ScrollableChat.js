import React from "react";
import { Box, Tooltip, Avatar, Text } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";

import { ChatState } from "../context/ChatProvider";
import { isLastMessage, isSameSender, msgMargin } from "../helper/chat";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages.map((msg, i) => (
        <Box display="flex" key={i} p={2}>
          {(isSameSender(messages, msg, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Tooltip label={msg.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mr={1}
                size="sm"
                cursor="pointer"
                name={msg.sender.name}
                src={msg.sender.pic}
              />
            </Tooltip>
          )}
          <Text
            backgroundColor={
              msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
            }
            borderRadius="10px"
            px="15px"
            py="5px"
            maxWidth="75%"
            ml={msgMargin(messages, msg, i, user._id)}
          >
            {msg.content}
          </Text>
        </Box>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
