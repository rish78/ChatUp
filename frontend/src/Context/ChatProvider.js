import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const ChatContext = createContext();
const ENDPOINT = "https://chatup-vv7c.onrender.com"; // Your Socket.IO server URL

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [selectedchat, setSelectedchat] = useState();
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate('/');
    } else {
      // Initialize socket connection here
      const newSocket = io(ENDPOINT, { query: { id: userInfo._id } });
      setSocket(newSocket);
      
      return () => newSocket.close(); // Clean up on unmount
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser, chats, setChats, selectedchat, setSelectedchat, socket }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
