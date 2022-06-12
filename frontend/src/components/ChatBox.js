import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/layout';
import ChatMessages from './ChatMessages';

const ChatBox = () => {

  const {selectedchat} = ChatState();

  return (
    <Box display={{ base: selectedchat ? "flex" : "none", md: "flex" }}
    alignItems="center"
    flexDir="column"
    p={3}
    bg="white"
    w={{ base: "100%", md: "72%" }}
    borderRadius="lg"
    borderWidth="1px">
      <ChatMessages />
    </Box>
  )
}

export default ChatBox