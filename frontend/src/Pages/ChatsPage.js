import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatsPage = () => {
  const { user, setUser } = ChatState();

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="full"
        h="91vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatsPage;
