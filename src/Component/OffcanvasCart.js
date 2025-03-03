// src/Component/OffcanvasCart.js
import React from 'react';
import { Offcanvas } from 'react-bootstrap';

const OffcanvasCart = ({ cartVisible, handleCartToggle, cartItems, handleQuantityChange, handleRemoveItem, calculateTotal }) => {
  return (
    <Offcanvas show={cartVisible} onHide={handleCartToggle} placement="end">
      <Offcanvas.Body>
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item, index) => (
              <div key={index} className="d-flex align-items-center mb-3 border-bottom pb-3">
                <img
                  src={item.src}
                  alt={item.title}
                  style={{ width: '80px', objectFit: 'cover', marginRight: '15px' }}
                />
                <div className="flex-grow-1">
                  <h5>{item.title}</h5>
                  <p>{item.price}</p>
                  <div className="d-flex align-items-center">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(item, -1)}>-</button>
                    <span className="mx-2">{item.quantity || 1}</span>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(item, 1)}>+</button>
                  </div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
            <div className="mt-4">
              <h5 className="d-flex justify-content-between">
                <span>You Pay:</span>
                <span>Rs. {calculateTotal()}</span>
              </h5>
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffcanvasCart;
