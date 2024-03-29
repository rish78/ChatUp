import { Tab, TabList, TabPanel, TabPanels, Tabs, Toast, useToast } from '@chakra-ui/react';
import {Box } from '@chakra-ui/layout'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import NewChat from './NewChat';
import AllChats from './AllChats';

const LeftBar = () => {

  const { selectedchat, setSelectedchat, user, chats, setChats } = ChatState();

  const [loggedUser, setLoggedUser] = useState();

  const toast = useToast();
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };

      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, config);
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [])
  return (
    <Box
      display={{ base: selectedchat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      
      p={3}
      bg="white"
      w={{ base: "100%", md: "25%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Tabs isFitted variant='enclosed' colorScheme="blue">
      <TabList>
        <Tab width="100%">All Chats</Tab>
        <Tab width="100%">New Chat</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <AllChats  />
        </TabPanel>
        <TabPanel>
          <NewChat />
        </TabPanel>
      </TabPanels>
      </Tabs>
    </Box>
  )
}

export default LeftBar