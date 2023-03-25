import React from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import bgImage from "../assets/chat_background.jpg";

const HomePage = () => {
  return (
    <Container
      maxW="xl"
      centerContent
      backgroundImage={``}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Box
        display="flex"
        justifyContent="center"
        borderWidth="1px"
        p={4}
        m={5}
        width="100%"
        shadow="md"
      >
        <Text fontSize="4xl">Chat App</Text>
      </Box>
      <Box width="100%" p={5} shadow="md" borderWidth="1px">
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
