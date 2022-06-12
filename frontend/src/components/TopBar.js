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
    bg="#63B3ED"
    w="100%"
    h="10vh"
    p="0 25px"
    
    >
        <Image src='https://i.ibb.co/5x6XLQc/a95528c06d634e13987e224ac010d3af-removebg-preview.png'  objectFit='cover' />
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