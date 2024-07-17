import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
  HashRouter,
} from "react-router-dom";
import SignIn from "./components/SignIn";
import SpecificBook from "./components/SpecificBook";
import userAvatar from "./images/user.png";
import BookList from "./components/BookList";
import CartPage from "./components/CartPage";
import HeaderLogin from "./components/HeaderLogin";
import HeaderDefault from "./components/HeaderDefault";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import ChatBot from "./components/ChatBot";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [chatState, setChatState] = useState([]); // Добавляем состояние чата

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUsername("");
    setCartItems([]);
    setChatState([]); // Очищаем состояние чата при выходе
  };

  const addToCart = (book) => {
    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCartItems.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + book.quantity }
            : item
        );
      } else {
        return [...prevCartItems, { ...book, quantity: book.quantity }];
      }
    });
  };

  return (
    <HashRouter>
      <HeaderSelector
        isLoggedIn={isLoggedIn}
        username={username}
        onSignOut={handleSignOut}
        cartItems={cartItems}
      />
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <SignIn
                setIsLoggedIn={setIsLoggedIn}
                setUsernameGlobal={setUsername}
              />
            }
          />
          <Route
            path="/book-list"
            element={
              isLoggedIn ? (
                <>
                  <BookList addToCart={addToCart} />
                  <Link
                    to="/chat"
                    className="back-to-chat-button"
                    state={{ chatState }}
                  >
                    Вернуться в чат
                  </Link>
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/specific-book/:id"
            element={
              isLoggedIn ? (
                <SpecificBook addToCart={addToCart} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/cart"
            element={
              isLoggedIn ? (
                <CartPage
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  userName={username}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/chat" component={ChatBot} />
          <Route
            path="/chat"
            element={
              isLoggedIn ? (
                <ChatBot chatState={chatState} setChatState={setChatState} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </HashRouter>
  );
};

const HeaderSelector = ({ isLoggedIn, username, onSignOut, cartItems }) => {
  const location = useLocation();

  return location.pathname === "/" ? (
    <HeaderLogin />
  ) : (
    <HeaderDefault
      username={username}
      avatarUrl={userAvatar}
      onSignOut={onSignOut}
      cartItems={cartItems}
    />
  );
};

export default App;
