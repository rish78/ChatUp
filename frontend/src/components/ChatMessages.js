import React, { useEffect, useState, useRef } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Avatar, Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon, ChatIcon } from "@chakra-ui/icons";
import axios from "axios";
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';


const ChatMessages = () => {
  const { selectedchat, setSelectedchat, user, socket } = ChatState();

  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([]);
  const [newmessage, setNewmessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const toast = useToast();
  const selectedChatRef = useRef(selectedchat);

  useEffect(() => {
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.off("connected");
    };
  }, [user]);

  useEffect(() => {
    selectedChatRef.current = selectedchat;
    if (selectedchat) {
      fetchMessages();
    }
  }, [selectedchat]);

  useEffect(() => {
    const messageListener = (newMessageReceived) => {
      if (selectedChatRef.current && newMessageReceived.chat._id.toString() === selectedChatRef.current._id.toString()) {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    socket.on("message received", messageListener);

    return () => {
      socket.off("message received", messageListener);
    };
  }, []);

  const fetchMessages = async () => {
    if (!selectedchat) return;

    setIsLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };

      const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/message/${selectedchat._id}`, config);
      setMessages(data);
      socket.emit("join chat", selectedchat._id);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to fetch messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `${user.token}`,
        },
      };
      setNewmessage("");
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/message`,
        {
          content: newmessage,
          chatid: selectedchat._id,
        },
        config
      );

      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to send the message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter" && newmessage) {
      sendMessage();
    }
  };

  const typingHandler = (e) => {
    setNewmessage(e.target.value);
  };

  return (
    <Box>
      {selectedchat ? (
        <>
          <Text fontSize={{ base: "28px", md: "30px" }}
            w="100%"
            display="flex" 
            direction="row"
            alignItems="center" 
            justifyContent="space-between">
            <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedchat(null)}/>
            {(!selectedchat.isGroupChat ? (
              <div>
                <Avatar
                  mr={2}
                  size="md"
                  cursor="pointer"
                  name={selectedchat.users.find((u) => u._id !== user._id).name}
                  src={`https://robohash.org/${selectedchat.users.find((u) => u._id !== user._id).username}.png?set=set4`}
                />
                {selectedchat.users.find((u) => u._id !== user._id).username}
              </div>
            ) : (
              <>{selectedchat.chatName.toUpperCase()}</>
            ))}
          </Text>
          {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="75vh">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
              </Box>
            ) : (
              <>
              <Box
                display="flex"
                flexDir="column"
                justifyContent="flex-end"
                mt={3}
                p={3}
                bg="#E8E8E8"
                w="65vw"
                h="75vh"
                borderRadius="lg"
                overflowY="hidden">
                <ScrollableChat messages={messages} />
                <FormControl onKeyDown={handleKeydown} isRequired mt={3} display="flex">
                  <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter a message.."
                    value={newmessage}
                    onChange={typingHandler}
                  />
                  <IconButton icon={<ChatIcon />} onClick={sendMessage} />
                </FormControl>
              </Box>
              </>
            )}
          
        </>
      ) : (
        <Box display="flex" align="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3}>
            Select a user and start chatting with them!
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ChatMessages;
