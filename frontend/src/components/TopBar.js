import { Box, Button, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../Context/ChatProvider';

const TopBar = () => {
    const { user } = ChatState();

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    }

  return (
    <Box 
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    bg="white"
    w="100%"
    h="10vh"
    p="0 25px"
    
    >
        <Image src='https://i.ibb.co/gjdQxw2/5ca56f760bbd496d803fbf7a16101ef0-removebg-preview-removebg-preview.png'  objectFit='cover' />
        <Text fontSize="2xl">
          {user.username}
        </Text>
        <Button fontSize="1xl" onClick={handleLogout}>
            Logout
        </Button>
    </Box>
  )
}

export default TopBar