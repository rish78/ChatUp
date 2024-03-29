import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Avatar, Box, FormControl, IconButton, Input, Text, useToast } from "@chakra-ui/react"
import { ArrowBackIcon, ChatIcon } from "@chakra-ui/icons"
import axios from "axios";
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'

const ENDPOINT = "https://chatup-vv7c.onrender.com/";
var socket, selectedChatCompare;

const ChatMessages = () => {

    const { selectedchat, setSelectedchat, user } = ChatState();

    const [messages, setMessages] = useState([]);
    const [newmessage, setNewmessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);

    const toast = useToast();

   
    const sendMessage = async(e) => {
        
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
                    chatid: selectedchat,
                  },
                  config
                );
                // console.log(data);

                socket.emit("new message", data);

                setMessages([...messages, data]);
            }
            catch(error){
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
            }
        
    };


    const fetchMessages = async () => {
        if(!selectedchat){
          // console.log("here")
            return;
        }

        try{
            const config = {
                headers: {
                 
                  Authorization: `${user.token}`,
                },
              };

              const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/message/${selectedchat._id}`, config);
              // console.log(data);

              setMessages(data);

              socket.emit("join chat", selectedchat._id);
        }
        catch(error) {
            toast({
                title: "Error Occured!",
                description: "Failed to fetch Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
        }


    useEffect(() => {
          socket = io(ENDPOINT);
    
          socket.emit("setup", user);
    
          socket.on("connected", () => setSocketConnected(true));
    
    }, []);

    useEffect(() => {
      fetchMessages();

      selectedChatCompare = selectedchat;
  }, [selectedchat]);
    
        useEffect(() => {
          socket.on("message received", (newMessageReceived) => {
            
              setMessages([...messages, newMessageReceived]);
            
          })
        })

    

    

    const handleKeydown = (e) => {
      if((e.key==="Enter") && newmessage){
          sendMessage()
      }
    }

    const typingHandler = (e) => {
        setNewmessage(e.target.value)
    }



    

  return (
    <Box>
        {selectedchat? (
            <>
            <Text fontSize={{ base: "28px", md: "30px" }}
            
            w="100%"
            
            display="flex" 
            direction="row"
            alignItems="center" 
            justifyContent="space-between" >
                <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedchat("")}/>
                {(!selectedchat.isGroupChat ? (
                <div><Avatar
                    mr={2}
                    size="md"
                    cursor="pointer"
                    name={user.name}
                    src={`https://robohash.org/${user.username}.png?set=set4`}
                />
                  {
                    selectedchat.users[0]._id === user._id ? selectedchat.users[1].username : selectedchat.users[0].username}
                  
                </div>
              ) : (
                <>
                  {selectedchat.chatName.toUpperCase()}
                  
                </>
              ))}
            </Text>
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
            overflowY="hidden"
          > <ScrollableChat messages={messages} />
            <FormControl
              onKeyDown={handleKeydown}
              id="first-name"
              isRequired
              mt={3}
              display="flex"
            >
                <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newmessage}
                onChange={typingHandler}
              />
              <ChatIcon cursor="pointer" boxSize={8} display="flex" justifyContent="flex-end" alignItems="center" onClick={sendMessage}/>
            </FormControl>
          </Box>
          </>
        ):(
            <Box display="flex" align="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} >
            select a user and start chatting with them!
          </Text>

        </Box>
        )}
    
    </Box>
  )
}

export default ChatMessages