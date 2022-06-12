import { Box } from '@chakra-ui/layout';
import React from 'react'
import ChatBox from '../components/ChatBox';
import LeftBar from '../components/LeftBar';
import TopBar from '../components/TopBar';
import { ChatState } from '../Context/ChatProvider';

function ChatPage() {
  const {user} = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <TopBar />}
      <Box w="100%" h="90vh" p="10px" display="flex" justifyContent="space-between" >
        {user && <LeftBar/>}
        {user && (
          <ChatBox/>
        )}
      </Box>
    </div>
  )
}

export default ChatPage