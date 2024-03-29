import { Box, Button, Input, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../Context/ChatProvider';
import IndividualUser from './IndividualUser';

const NewChat = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const toast = useToast();
  const navigate = useNavigate();

  const {
    selectedchat, setSelectedchat,
    user,
    setUser,
    chats,
    setChats,
  } = ChatState();

  const handleSearch = async () => {
    

    try {
     

      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };

      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user?search=${search}`, config);

      // console.log(data);
      
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userid) => {
      try{

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${user.token}`,
          },
        };

        const {data} = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {userid}, config);

        setSelectedchat(data);
        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
       window.location.reload();
      }
      catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to access chat",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
  }
  
  

  return (
    <Box>
      <Box display="flex" p="20px 0px">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
              
            </Box>
          
            {searchResult?.map((user) => (
                  <IndividualUser
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))}
    </Box>

      
  )
}

export default NewChat