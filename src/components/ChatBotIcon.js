import React from "react";
import { Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

const ChatBotIcon = ({ onClick }) => {
  return (
    <Fab
      className="chat-bot-icon"
      color="primary"
      aria-label="chatbot"
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#df5f5f",
        "& .MuiSvgIconRoot": {
          color: "#ffffff",
        },
      }}
    >
      <ChatIcon />
    </Fab>
  );
};

export default ChatBotIcon;
