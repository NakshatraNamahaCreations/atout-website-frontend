import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/cartSlice'; // Ensure correct import
import { Offcanvas } from 'react-bootstrap'; // Assuming you're using react-bootstrap
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CartOffcanvas = ({ cartVisible, handleCartToggle }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item._id));
  };

  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: item._id, quantity: newQuantity }));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <Offcanvas show={cartVisible} onHide={handleCartToggle} placement="end">
      <Offcanvas.Body>
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="d-flex align-items-center mb-3 border-bottom pb-3"
              >
                {/* Ensure that item.images is defined before accessing item.images[0] */}
                <img
                  src={item.images && item.images.length > 0 ? item.images[0] : '/path/to/default-image.jpg'} // Use a default image if no image is present
                  alt={item.title}
                  style={{
                    width: "80px",
                    objectFit: "cover",
                    marginRight: "15px",
                  }}
                />
                <div className="flex-grow-1">
                  <h5>{item.name}</h5>
                  <h5>{item.category}</h5>
                  <p>{item.price}</p>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(item, -1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(item, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveItem(item)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
            <div className="mt-4">
              <h5 className="d-flex justify-content-between">
                <span>You Pay:</span>
                <span>Rs. {calculateTotal()}</span>
              </h5>
              <button
                className="btn btn-dark w-100 mt-3"
                onClick={() =>
                  navigate("/checkout", { state: { cartItems } })
                }
              >
                CHECKOUT
              </button>
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartOffcanvas;
