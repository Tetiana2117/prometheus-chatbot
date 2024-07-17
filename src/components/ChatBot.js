import React, { useState, useEffect } from "react";
import { Container, Typography, Button, TextField, Fab } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";
import booksData from "../books.json";
import "../styles/ChatBot.css";

const ChatBot = ({ isOpen, onClose, chatState }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [stage, setStage] = useState("initial");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const chatStateFromRoute = location.state?.chatState || [];
    if (chatStateFromRoute.length > 0) {
      setMessages(chatStateFromRoute);
    } else {
      setMessages([
        {
          text: "Hello! I can help you choose a book. Select search category:\n1.Tag\n2. Author\n3. Price\n4. Level",
          fromUser: false,
        },
      ]);
    }
  }, [location.state]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const addBotMessage = (text) => {
    const lines = text.split("\n");
    const formattedMessages = lines.map((line) => ({
      text: line,
      fromUser: false,
    }));
    setMessages([...messages, ...formattedMessages]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputText.trim() === "") return;
    const newMessage = { text: inputText, fromUser: true };
    setMessages([...messages, newMessage]);
    processUserInput(inputText);
    setInputText("");
  };

  const processUserInput = (userInput) => {
    if (stage === "initial") {
      if (userInput.toLowerCase().includes("tag")) {
        showTags();
        setStage("tag");
      } else if (userInput.toLowerCase().includes("autho")) {
        showAuthors();
        setStage("author");
      } else if (userInput.toLowerCase().includes("price")) {
        showOptions("price");
        setStage("price");
      } else if (userInput.toLowerCase().includes("level")) {
        showOptions("level");
        setStage("level");
      } else {
        setMessages([
          ...messages,
          {
            text: "Sorry, I didn't understand your question. Try again.",
            fromUser: false,
          },
        ]);
      }
    } else {
      handleSpecificOption(userInput);
    }
  };

  const showTags = () => {
    const uniqueTags = new Set();
    booksData.books.forEach((book) => {
      book.tags.forEach((tag) => uniqueTags.add(tag));
    });
    addBotMessage("Available tags:\n" + Array.from(uniqueTags).join(", "));
  };

  const showAuthors = () => {
    const uniqueAuthors = new Set(booksData.books.map((book) => book.author));
    addBotMessage(
      "Available Authors:\n" + Array.from(uniqueAuthors).join(", ")
    );
  };

  const showOptions = (option) => {
    let optionsText = "";
    switch (option) {
      case "price":
        optionsText = "Select price range:\n1. 0-15\n2. 15-30\n3. 30+";
        break;
      case "level":
        optionsText = "Select level:\n1. Beginner\n2. Middle\n3. Pro";
        break;
      default:
        optionsText = "Option not recognized.";
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: optionsText,
        fromUser: false,
      },
    ]);
  };

  const handleSpecificOption = (userInput) => {
    switch (stage) {
      case "tag":
        filterBooksByTag(userInput);
        break;
      case "author":
        filterBooksByAuthor(userInput);
        break;
      case "price":
        handlePriceOption(userInput);
        break;
      case "level":
        handleLevelOption(userInput);
        break;
      default:
        setMessages([
          ...messages,
          {
            text: "Sorry, I didn't understand your question. Try again.",
            fromUser: false,
          },
        ]);
    }
  };

  const handleViewWebsite = (book) => {
    navigate(`/specific-book/${book.id}`);
  };

  const handleEndDialog = () => {
    setMessages([
      {
        text: "Thank you for your choice, please contact us if necessary.",
        fromUser: false,
      },
    ]);
  };

  const handleNewSearch = () => {
    setMessages([
      {
        text: "Hello! I can help you choose a book. Select search category:\n1.Tag\n2. Author\n3. Price\n4. Level",
        fromUser: false,
      },
    ]);
    setStage("initial");
    setInputText("");
  };

  const filterBooksByTag = (tag) => {
    const filteredBooks = booksData.books
      .filter((book) =>
        book.tags.some((bookTag) => bookTag.toLowerCase() === tag.toLowerCase())
      )
      .sort((a, b) => a.price - b.price);
    if (filteredBooks.length > 0) {
      displayBooks(filteredBooks);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "No books were found for the selected tag.",
          fromUser: false,
        },
        {
          text: (
            <Button className="chat-btn" onClick={handleNewSearch}>
              New search
            </Button>
          ),
          fromUser: false,
        },
      ]);
    }
  };

  const filterBooksByAuthor = (author) => {
    const filteredBooks = booksData.books.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
    if (filteredBooks.length > 0) {
      displayBooks(filteredBooks);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "No books were found by the selected author.",
          fromUser: false,
        },
        {
          text: (
            <Button className="chat-btn" onClick={handleNewSearch}>
              New search
            </Button>
          ),
          fromUser: false,
        },
      ]);
    }
  };

  const handlePriceOption = (userInput) => {
    let filteredBooks = [];
    switch (userInput) {
      case "0-15":
        filteredBooks = booksData.books.filter(
          (book) => book.price >= 0 && book.price <= 15
        );
        break;
      case "15-30":
        filteredBooks = booksData.books.filter(
          (book) => book.price > 15 && book.price <= 30
        );
        break;
      case "30+":
        filteredBooks = booksData.books.filter((book) => book.price > 30);
        break;
      default:
        setMessages([
          ...messages,
          {
            text: "Incorrect price range. Try again.",
            fromUser: false,
          },
        ]);
    }

    if (filteredBooks.length > 0) {
      displayBooks(filteredBooks);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "No books were found within the selected price range.",
          fromUser: false,
        },
        {
          text: (
            <Button className="chat-btn" onClick={handleNewSearch}>
              New search
            </Button>
          ),
          fromUser: false,
        },
      ]);
    }
  };

  const handleLevelOption = (userInput) => {
    const filteredBooks = booksData.books
      .filter((book) => book.level.toLowerCase() === userInput.toLowerCase())
      .sort((a, b) => a.price - b.price);
    if (filteredBooks.length > 0) {
      displayBooks(filteredBooks);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "No books were found for the selected level.",
          fromUser: false,
        },
        {
          text: (
            <Button className="chat-btn" onClick={handleNewSearch}>
              New search
            </Button>
          ),
          fromUser: false,
        },
      ]);
    }
  };

  const displayBooks = (books) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      ...books.map((book) => ({
        text: (
          <div key={book.title}>
            <Typography variant="body1">Author: {book.author}</Typography>
            <Typography variant="body1">Title: {book.title}</Typography>
            <Typography variant="body1">Price: ${book.price}</Typography>
            <div className="button-container">
              <Button
                className="chat-btn"
                onClick={() => handleViewWebsite(book)}
              >
                View on the website
              </Button>
              <Button className="chat-btn" onClick={handleEndDialog}>
                End dialogue
              </Button>
              <Button className="chat-btn" onClick={handleNewSearch}>
                New search
              </Button>
              <br />
            </div>
          </div>
        ),
        fromUser: false,
      })),
    ]);
  };

  return (
    <div className="center-container">
      <Container
        className={`chatbot-container ${isOpen ? "open" : ""}`}
        style={{
          width: "70%",
          height: "100%",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isOpen && (
          <>
            <div className="chat-header" style={{ backgroundColor: "#62a2be" }}>
              <Typography variant="h6" className="header-title">
                Chat with a bot
              </Typography>
              <Button
                className="close-btn"
                onClick={onClose}
                style={{ display: "flex", alignItems: "center" }}
              >
                <CloseIcon />
              </Button>
            </div>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={message.fromUser ? "user-message" : "bot-message"}
                >
                  {typeof message.text === "string"
                    ? message.text
                        .split("\n")
                        .map((line, idx) => (
                          <Typography key={idx}>{line}</Typography>
                        ))
                    : message.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
              <TextField
                id="message-input"
                label="Enter your message"
                placeholder="Enter your message"
                variant="outlined"
                fullWidth
                value={inputText}
                onChange={handleInputChange}
                className="input-field"
                style={{
                  fontSize: "12px",
                }}
              />
              <Fab
                type="submit"
                color="primary"
                aria-label="send"
                className="send-button"
                style={{ backgroundColor: "#62a2be" }}
              >
                <SendIcon />
              </Fab>
            </form>
          </>
        )}
      </Container>
    </div>
  );
};

export default ChatBot;
