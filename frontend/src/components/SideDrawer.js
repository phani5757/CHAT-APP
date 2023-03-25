import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";

import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import UserListItem from "./UserListItem";
import { getSender } from "../helper/chat";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();

  const onLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter search keyword",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {}
  };

  const accessCreateChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      setSelectedChat(data);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      onClose();
      setLoading(false);
    } catch (error) {}
  };

  return (
    <div>
      <Box
        w="100%"
        borderWidth="5px"
        p="5px 10px"
        bg="white"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Tooltip hasArrow label="Search users" color="black">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search Users
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl">Chat App</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon />
            </MenuButton>
            <MenuList>
              {notifications?.length > 0 ? (
                notifications.map((notifi) => (
                  <MenuItem
                    key={notifi._id}
                    onClick={() => {
                      setSelectedChat(notifi.chat);
                      setNotifications(
                        (notifications || []).filter(
                          (f) => f._id !== notifi._id
                        )
                      );
                    }}
                  >{`new message from ${
                    notifi.groupChat
                      ? notifi.chatName
                      : getSender(user, notifi.chat?.users)
                  }`}</MenuItem>
                ))
              ) : (
                <MenuItem>No Notifications</MenuItem>
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                name={user.name}
                src={user.pic}
                cursor="pointer"
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>
          <DrawerBody>
            <Box pb={2} display="flex">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((searchUser) => (
                <UserListItem
                  key={searchUser._id}
                  user={searchUser}
                  handleFunction={() => {
                    accessCreateChat(searchUser._id);
                  }}
                />
              ))
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
