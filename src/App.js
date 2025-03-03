import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom"; 
import Header from "./Component/Header";  
import HomePage from "./Component/HomePage";  
import Footer from "./Component/Footer";  
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AboutUs from "./Component/Aboutus";
import ContactUs from "./Component/Contact-us";
import ShopByCategory from "./Component/Shop"; 
import CartPage from "./Component/Cart";
import Checkout from './Component/Checkout';
import WishlistPage from './Component/WishlistPage';
import DescriptionPage from './Component/DescriptionPage';
import ProfilePage from './Component/ProfilePage';
import CartOffcanvas from './Component/CartOffcanvas';
import DashboardPage from './Component/DashboardPage';
import MyOrdersPage from './Component/MyOrdersPage';
import { Modal, Button } from 'react-bootstrap';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setIsAuthenticated(true);
    } else {
      if (location.pathname !== "/profile") {
        setShowPopup(true);  // Show popup only if not on Profile page
      }
    }
  }, [location.pathname]);

  const handleGoToLogin = () => {
    setShowPopup(false); // Close popup
    navigate("/profile"); // Navigate to full login/register page
  };

  return (
    <>
      <Header setCartVisible={setCartVisible} />
      <CartOffcanvas visible={cartVisible} onClose={() => setCartVisible(false)} />

      <Routes> 
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/shop" element={<ShopByCategory setCartVisible={setCartVisible} />} />
        <Route path="/description" element={<DescriptionPage setCartItems={setCartItems} setCartVisible={setCartVisible} />} />
        <Route path="/product/:id" element={<DescriptionPage setCartItems={setCartItems} setCartVisible={setCartVisible} />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path='/orders' element={<MyOrdersPage/>}/>
      </Routes>

      <Footer />

      {/* Show Login Popup on all pages if not authenticated and NOT on Profile page */}
      <Modal show={showPopup} backdrop="static" keyboard={false} centered>
        <Modal.Body className="text-center">
          <h4>Welcome to Our Website</h4>
          <p>Please login or register to continue.</p>
          <Button variant="primary" onClick={handleGoToLogin}>
            Go to Login / Register
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default App;
