import React from 'react'
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from '../Context/ChatProvider';

const ScrollableChat = ({messages}) => {
    const { user } = ChatState();

    const isSameUser = (messages, m, i) => {
        return i > 0 && messages[i - 1].sender._id === m.sender._id;
      };

      const isSameSenderMargin = (messages, m, i, userId) => {
        // console.log(i === messages.length - 1);
      
        if (
          i < messages.length - 1 &&
          messages[i + 1].sender._id === m.sender._id &&
          messages[i].sender._id !== userId
        )
          return 0;
        else if (
          (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
          (i === messages.length - 1 && messages[i].sender._id !== userId)
        )
          return 0;
        else return "auto";
      };
  return (
    <ScrollableFeed>
        {messages && messages.map((m,i)=> (
            <div style={{ display: "flex" }} key={m._id}>
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
            
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat