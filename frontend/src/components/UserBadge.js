import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <Box
      p={1}
      borderWidth={1}
      px={2}
      py={1}
      m={1}
      mb={2}
      variant="solid"
      fontSize="12px"
      backgroundColor="purple"
      color="white"
      cursor="pointer"
      borderRadius="lg"
      onClick={handleFunction}
    >
      {user.name} <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadge;
