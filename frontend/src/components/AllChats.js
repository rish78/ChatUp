import { Box, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';

const AllChats = () => {

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

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      console.log(error);
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
  
  const getName = (chat, loggeduser) => {
    
    console.log(chat.users)
    return chat.users[0]._id === loggeduser._id ? chat.users[1].username : chat.users[0].username
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [])

  return (
    <Stack>
            {chats.map((chat) => (
              <Box
                onClick={() =>{console.log("hi"); setSelectedchat(chat)}}
                cursor="pointer"
                bg={selectedchat === chat ? "#63B3ED" : "#E8E8E8"}
                color={selectedchat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getName(chat, loggedUser )
                    : chat.chatName}
                </Text>
                
              </Box>
            ))}
          </Stack>
  )
}

export default AllChats