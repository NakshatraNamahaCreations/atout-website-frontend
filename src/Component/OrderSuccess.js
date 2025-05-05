import React from 'react';
import { useLocation } from 'react-router-dom';
import animation from '../Images/Animation.gif'; 

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || 'N/A'; 

  return (
    <div className="container text-center" style={{ marginTop: '8%', fontFamily: "'Poppins', sans-serif" }}>
      <img src={animation} alt="Success" style={{ width: '200px', height: 'auto' }} />
      <h3 className="mt-3 text-success">Order Placed Successfully!</h3>
      <p>Your order ID: {orderId}</p>
      <p>Thank you for shopping with us.</p>
      <a href="/shop" className="btn btn-primary mt-3" style={{ backgroundColor: '#5a352d', borderColor: '#5a352d' }}>
        Continue Shopping
      </a>
    </div>
  );
};

export default OrderSuccess;