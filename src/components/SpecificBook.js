import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import booksData from "../books.json";
import defaultImage from "../images/default-book-image.png";
import "../styles/SpecificBook.css";

const SpecificBook = ({ addToCart }) => {
  const { id } = useParams();
  const book = booksData.books.find((b) => b.id === parseInt(id, 10));
  const location = useLocation();
  const chatState = location.state?.chatState || [];
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showCartMessage, setShowCartMessage] = useState(false);
  const navigate = useNavigate();

  if (!book) {
    return <div>No books available</div>;
  }

  const handleQuantityChange = (event) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > book.amount) {
      value = book.amount;
    }
    setQuantity(value);
  };

  const handleKeyDown = (event) => {
    const currentValue = parseInt(event.target.value, 10);
    const minValue = parseInt(event.target.min, 10) || 1;
    const maxValue = parseInt(event.target.max, 10) || book.amount;
    const key = event.key;

    if (
      (key === "ArrowUp" || key === "ArrowDown") &&
      currentValue !== undefined
    ) {
      if (key === "ArrowUp" && currentValue < maxValue) {
        setQuantity(currentValue + 1);
      } else if (key === "ArrowDown" && currentValue > minValue) {
        setQuantity(currentValue - 1);
      }
      event.preventDefault();
    }
  };

  const totalPrice = (quantity * book.price).toFixed(2);

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleAddToCart = () => {
    addToCart({ ...book, quantity });
    setShowCartMessage(true);
  };

  const incrementQuantity = () => {
    if (quantity < book.amount) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const goToCart = () => {
    setShowCartMessage(false);
    navigate("/cart");
  };

  const goBackToBooks = () => {
    setShowCartMessage(false);
    navigate("/book-list");
  };

  const goBackToChat = () => {
    setShowCartMessage(false);
    navigate("/chat", { state: { chatState } });
  };

  return (
    <div className="book-container">
      {showCartMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <img
              src={book.image ? book.image : defaultImage}
              alt={book.title}
              className="modal-book-image"
            />
            <p>
              Product "{book.title}" <br /> added to cart
            </p>
            <div className="cart-options">
              <button className="btn-cart" onClick={goToCart}>
                Go to cart
              </button>
              <button className="btn-back" onClick={goBackToBooks}>
                Go back to books
              </button>
              <button className="btn-back" onClick={goBackToChat}>
                Go back to chat
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="book-details">
        <div className="book-description">
          <img
            src={book.image ? book.image : defaultImage}
            alt={book.title}
            className="book-image"
          />
        </div>
        <div className="book-info">
          <h2>{book.title}</h2>
          <p>
            <strong>Book author:</strong> {book.author}
          </p>
          <p>
            <strong>Book level:</strong> {book.level}
          </p>
          <p>
            <strong>Book tags:</strong> {book.tags.join(", ")}
          </p>
          <p>
            <strong>Book description:</strong>{" "}
            {isDescriptionExpanded
              ? book.description
              : `${book.description.slice(0, 100)}...`}
          </p>
          <button className="button-info" onClick={toggleDescription}>
            {isDescriptionExpanded ? "Hide description" : "Full description"}
          </button>
        </div>
        <div className="price-info">
          <p>
            <strong>Price:</strong> ${book.price}
          </p>
          {book.amount > 0 ? (
            <>
              <label htmlFor="quantity">Count: </label>
              <div className="quantity-control">
                <button onClick={decrementQuantity} disabled={quantity <= 1}>
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={book.amount}
                  value={quantity}
                  onChange={handleQuantityChange}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= book.amount}
                >
                  +
                </button>
              </div>

              <p>
                <strong>Total price:</strong> ${totalPrice}
              </p>
              <button className="add-to-cart-button" onClick={handleAddToCart}>
                Add to cart
              </button>
              <button className="back-button" onClick={goBackToBooks}>
                Go back to books
              </button>
              <button className="back-button" onClick={goBackToChat}>
                Go back to chat
              </button>
            </>
          ) : (
            <div className="out-of-stock">
              <button className="btn-out-of-stock">
                This book is out of stock
              </button>
              <button className="btn-out-back" onClick={goBackToBooks}>
                Go back to books
              </button>
              <button className="btn-out-back" onClick={goBackToChat}>
                Go back to chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificBook;
