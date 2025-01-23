import React from "react";
import "../css/ChatBubble.css";

const ChatBubble = ({ message, isSender }) => {
  return (
    <div className={`message-bubble-container ${isSender ? "right" : "left"}`}>
      <div
        className={`message-bubble ${isSender ? "message-sender" : "message-receiver"}`}
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  );
};

export default ChatBubble;