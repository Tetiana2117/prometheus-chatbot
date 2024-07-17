import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import booksData from "../books.json";
import defaultImage from "../images/default-book-image.png";
import searchIcon from "../images/icons8-magnifying-glass-16.png";
import { Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ChatBot from "./ChatBot";
import "../styles/BookList.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const [messages] = useState([]);

  useEffect(() => {
    try {
      setBooks(booksData.books);
    } catch (err) {
      console.error("Ошибка загрузки книг:", err);
    }
  }, []);

  const handleGoBack = () => {
    setSearchTerm("");
    setMaxPrice("");
    setSortOption("");
    setPriceRange("all");
    navigate("/chat", { state: { chatState: messages } });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const filteredBooks = books
    .filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((book) => {
      if (priceRange === "all") return true;
      const price = parseFloat(book.price);
      if (priceRange === "0-15") return price > 0 && price < 15;
      if (priceRange === "15-30") return price >= 15 && price < 30;
      if (priceRange === "30+") return price >= 30;
      return true;
    })
    .filter((book) =>
      maxPrice === "" ? true : book.price <= parseFloat(maxPrice)
    )
    .sort((a, b) => {
      if (sortOption === "price-asc") {
        return a.price - b.price;
      } else if (sortOption === "price-desc") {
        return b.price - a.price;
      } else if (sortOption === "title-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  const addToCart = (book) => {};

  return (
    <div className="book-list">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <img src={searchIcon} alt="Search" className="search-icon" />
        </div>
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={handlePriceChange}
          className="price-input"
        />
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="price-range-select"
        >
          <option value="all">Price</option>
          <option value="0-15">Price from 0 to 15</option>
          <option value="15-30">Price from 15 to 30</option>
          <option value="30+">Price more 30</option>
        </select>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
        </select>
        <button className="search-bar-go-back-button" onClick={handleGoBack}>
          Go to back
        </button>
      </div>
      <div className="books">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-item">
              <img
                src={book.image ? book.image : defaultImage}
                alt={book.title}
                className="book-image"
              />
              <h2>{book.title}</h2>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <div className="book-footer">
                <p className="price">
                  <strong>Price:</strong> ${formatPrice(book.price)}
                </p>
                <Link to={`/specific-book/${book.id}`} className="view-button">
                  View
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-books-message-container">
            <p className="no-books-message">No books available</p>
            <button className="message-go-back-button" onClick={handleGoBack}>
              Go back to books
            </button>
          </div>
        )}
      </div>
      {/* Кнопка чатбота */}
      <Fab
        className="chat-bot-icon"
        color="primary"
        aria-label="chatbot"
        onClick={() => setIsChatOpen(true)}
        style={{
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
      {/* Окно чата */}
      {isChatOpen && (
        <ChatBot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          addToCart={addToCart}
        />
      )}
    </div>
  );
};

export default BookList;
