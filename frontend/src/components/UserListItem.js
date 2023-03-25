import React from "react";
import { Box, Avatar, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      cursor="pointer"
      bg="#eaeaea"
      _hover={{ background: "#38B2AC", color: "white" }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      onClick={handleFunction}
    >
      <Avatar size="sm" name={user.name} src={user.pic} />
      <div style={{ marginLeft: "10px" }}>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </div>
    </Box>
  );
};

export default UserListItem;
