import React, { useEffect, useRef, useState } from 'react';
import { Badge, Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text, useToast } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { ChatState } from '../Context/ChatProvider';

const AllChats = () => {
  const { selectedchat, setSelectedchat, user, chats, setChats, socket } = ChatState();
  const toast = useToast();
  const [unreadChats, setUnreadChats] = useState({});
  const selectedChatRef = useRef(selectedchat);

  useEffect(() => {
    selectedChatRef.current = selectedchat; // Update ref whenever selectedchat changes
  }, [selectedchat]);

  useEffect(() => {
    if (socket && user) {
      const handleMessageReceived = (newMessageReceived) => {

        if (!selectedchat || selectedchat._id !== newMessageReceived.chat._id) {
          setUnreadChats(prev => ({
            ...prev,
            [newMessageReceived.chat._id]: (prev[newMessageReceived.chat._id] || 0) + 1,
          }));
        }
      };
  
      // Listen for 'message received' events on the socket.
      socket.on('message received', handleMessageReceived);
  
      // Clean up the event listener when the component unmounts, or when socket or user changes.
      return () => {
        socket.off('message received', handleMessageReceived);
      };
    }
  }, [socket, user, selectedchat]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `${user.token}`,
          },
        };

        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, config);
        setChats(data);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user, setChats, toast]);

  const handleChatSelection = (chat) => {
    setSelectedchat(chat);
    setUnreadChats(prev => ({
      ...prev,
      [chat._id]: 0,
    }));
  };

  const deleteChat = async (chatId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.token}`,
        },
      };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/chat/${chatId}`, config);

      toast({
        title: "Chat Deleted!",
        description: "Chat deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // Refresh chat list after deletion
      setChats(prev => prev.filter(chat => chat._id !== chatId));
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to delete the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const getName = (chat) => {
    return chat.users.find((u) => u._id !== user._id).username;
  };

  return (
    <Stack>
      {chats.map((chat) => (
        <Box
          key={chat._id}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          onClick={() => handleChatSelection(chat)}
          cursor="pointer"
          bg={selectedchat?._id === chat._id ? "#63B3ED" : unreadChats[chat._id] ? "#90EE90" : "#E8E8E8"}
          color={selectedchat?._id === chat._id ? "white" : "black"}
          px={3}
          py={2}
          borderRadius="lg"
        >
          <Text>
            {!chat.isGroupChat ? getName(chat) : chat.chatName}
          </Text>
          {unreadChats[chat._id] > 0 && (
            <Badge ml="1" fontSize="0.8em" colorScheme="blackAlpha" color="white" bg="black" borderRadius="full">
              {unreadChats[chat._id]}
            </Badge>
          )}
          <Menu>
            <MenuButton as={IconButton} icon={<HamburgerIcon />} variant="outline" size="sm" />
            <MenuList>
              <MenuItem onClick={() => deleteChat(chat._id)} color={"black"}>Delete Chat</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      ))}
    </Stack>
  );
};

export default AllChats;
