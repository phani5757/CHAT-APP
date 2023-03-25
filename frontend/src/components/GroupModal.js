import React, { useState } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/react";
import axios from "axios";

import { ChatState } from "../context/ChatProvider";
import UserListItem from "./UserListItem";
import UserBadge from "./UserBadge";

const GroupModal = ({ children }) => {
  const toast = useToast();
  const { user, chats, setChats, setSelectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userList, setUserList] = useState([]);

  const onGroupModalClose = () => {
    setSelectedUsers([]);
    setUserList([]);
    onClose();
  };
  const handleUserSearch = async (e) => {
    const userInput = e.target.value;

    if (!userInput) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${userInput}`, config);
      setUserList(data);
    } catch (error) {}
  };

  const selectUser = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        description: "User already added.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== user));
  };

  const createGroup = async () => {
    if (selectedUsers.length < 2) {
      toast({
        description: "Please select at least two users",
        duration: 3000,
        status: "warning",
        isClosable: true,
      });
      return;
    }

    if (!groupName) {
      toast({
        description: "Please enter group name",
        duration: 3000,
        status: "warning",
        isClosable: true,
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onGroupModalClose();
      setSelectedChat(data);
    } catch (error) {}
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal size="lg" isOpen={isOpen} onClose={onGroupModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" fontSize="24px" justifyContent="center">
            Create Group
          </ModalHeader>
          <ModalCloseButton onClick={onGroupModalClose} />
          <ModalBody
            display="flex"
            alignItems="center"
            flexDirection="column"
            justifyContent="space-between"
          >
            <FormControl mb={1}>
              <Input
                type="text"
                placeholder="Enter group name"
                mb={2}
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
              />
              <Input
                type="text"
                placeholder="search users"
                onChange={handleUserSearch}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadge
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    removeUser(user);
                  }}
                />
              ))}
            </Box>
            <Box overflowY="auto" w="100%" h="170px">
              {userList.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    selectUser(user);
                  }}
                />
              ))}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onGroupModalClose}>
              close
            </Button>
            <Button colorScheme="blue" onClick={createGroup}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModal;
