import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import OffcanvasCart from "../Component/OffcanvasCart"; // Import OffcanvasCart
import { Button } from "react-bootstrap";

const CartPage = () => {
  const location = useLocation();
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []); // Get cart items passed from the previous page
  
  const handleCartToggle = () => setCartVisible(!cartVisible);

  // Handle quantity changes (increase or decrease)
  const handleQuantityChange = (item, delta) => {
    setCartItems((prevItems) => 
      prevItems.map((cartItem) => 
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + delta }
          : cartItem
      )
    );
  };

  // Remove item from cart
  const handleRemoveItem = (item) => {
    setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem.id !== item.id));
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {/* Button to toggle offcanvas */}
      <Button onClick={handleCartToggle}>View Cart</Button>

      {/* OffcanvasCart component */}
      <OffcanvasCart
        cartVisible={cartVisible}
        handleCartToggle={handleCartToggle}
        cartItems={cartItems}
        handleQuantityChange={handleQuantityChange}
        handleRemoveItem={handleRemoveItem}
        calculateTotal={calculateTotal}
      />
    </div>
  );
};

export default CartPage;
