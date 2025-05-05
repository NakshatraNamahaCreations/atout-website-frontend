import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/cartSlice';
import { Button, Card, Row, Col, Container } from 'react-bootstrap';
import emptyCartImage from '../Images/empty.webp';
import { useNavigate } from 'react-router-dom';
import { setSelectedProduct, selectSelectedProduct } from "../redux/selectedProductSlice";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
const [allOrders, setAllOrders] = useState([]);
  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item._id));
  };

    // const handleProductClick = (item) => {
    //   console.log("Clicked product:", item);
    //   dispatch(setSelectedProduct(item));
    //   console.log("Dispatched setSelectedProduct");
    // };

  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: item._id, quantity: newQuantity }));
    }
  };


  const handleProductClick = (item) => {
    // Dispatch selected product to Redux store
    dispatch(setSelectedProduct(item));
  
    // Navigate to product description page
    navigate(`/description`, { state: { product: item } });
  };

  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  

  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://api.atoutfashion.com/api/orders"); // Fetch all orders
      setAllOrders(response.data); // Store all orders in state
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div>
  <Container style={{ paddingTop: '20px', paddingBottom: '20px', backgroundColor: '#f8f9fa', marginTop: '8%' }}>
  <h2 style={{ fontSize: '18px' }}>My Cart ({cartItems.length} Items)</h2>
  <hr />
  <Row>
    <Col xs={12} md={8} style={{ paddingRight: '20px' }}>
      {cartItems.length > 0 ? (
        <div>
          {cartItems.map((item, index) => (
            <Card key={index} className="mb-3" style={{ display: 'flex', flexDirection: 'row', padding: '15px', backgroundColor: 'white', borderRadius: '5px' }}>
              <Row style={{ width: '100%' }}>
                <Col xs={4} md={3}>
                  <img
                    src={item.images && item.images.length > 0 ? item.images[0] : '/path/to/default-image.jpg'}
                    alt={item.title}
                    style={{ width: '80px', height: 'auto', objectFit: 'cover' }}
                  />
                </Col>
                <Col xs={8} md={7}>
                  <h5>{item.name}</h5>
                  <p>Colour: {item.color}</p>
                  <p>Size: {item.size}</p>
                  <h6>₹ {item.price}</h6>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="outline-secondary" onClick={() => handleQuantityChange(item, -1)} style={{ marginRight: '5px' }}>-</Button>
                    <span>{item.quantity}</span>
                    <Button variant="outline-secondary" onClick={() => handleQuantityChange(item, 1)} style={{ marginLeft: '5px' }}>+</Button>
                  </div>
                </Col>
                <Col xs={12} md={2} className="d-flex justify-content-center align-items-center">
                  <Button variant="danger" onClick={() => handleRemoveItem(item)}>X</Button>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', marginLeft:'50%' }}>
          <img src={emptyCartImage} alt="Empty Cart" style={{ maxWidth: '500px', marginBottom: '20px', justifyContent:'center' }} />
          <p>Your cart is empty.</p>
        </div>
      )}
    </Col>
    {cartItems.length > 0 && (
      <Col xs={12} md={4} style={{ paddingLeft: '20px', paddingTop: '10px' }}>
        <Card style={{ padding: '15px', backgroundColor: 'white', borderRadius: '5px' }}>
          <h5>Order Summary</h5>
          <div className="d-flex justify-content-between">
            <p>Subtotal</p>
            <p>₹ {calculateTotal()}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>Shipping</p>
            <p style={{ color: 'green' }}>FREE</p>
          </div>
          <div className="d-flex justify-content-between">
            <h6>Order Total</h6>
            <h6>₹ {calculateTotal()}</h6>
          </div>
          <div className="d-flex justify-content-center">
            <Button
              variant="danger"
              style={{ width: '100%', padding: '10px' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const storedUser = JSON.parse(localStorage.getItem("user")); // Check if user exists

                if (!storedUser) {
                  navigate("/profile");
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                } else {
                  navigate("/checkout", { state: { cartItems } }); // Proceed to checkout if logged in
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                }
              }}
            >
              CHECKOUT
            </Button>
          </div>
        </Card>
      </Col>
    )}
  </Row>
</Container>

    <Container>
              <h2 style={{ fontSize: "24px" }}> Most Trendings</h2>
              <div className="row mt-4 text-center">
  <div className="col-12">
    {/* <p className="fw-bold" style={{ fontSize: "20px" }}>You may also like</p> */}

    <div className="container mt-3">
  <div className="row justify-content-center">
    {allOrders.length > 0 ? (
      allOrders
        .flatMap((order) => order.cartItems) // Flatten cartItems from all orders
        .slice(0, 12) // Show only 12 products
        .map((item, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-4">
            <div
              className="position-relative"
              style={{ width: "100%", height: "300px", cursor: "pointer" }}
              onClick={() => handleProductClick(item)}
            >
              <img
                src={item.images}
                alt={item.name}
                className="img-fluid"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
              />
              <div
                className="position-absolute start-0 top-0 w-100 h-100"
                style={{
                  background: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%)",
                  borderRadius: "10px",
                }}
              ></div>
              <div
                className="position-absolute bottom-0 start-0 p-2"
                style={{
                  color: "white",
                  textAlign: "left",
                  fontSize: "14px",
                  lineHeight: "1.4",
                }}
              >
                <div style={{ fontSize: "16px", marginBottom: "2px" }}>{item.name}</div>
                <div style={{ fontSize: "16px", marginBottom: "2px", color: "#FFC8B0" }}>
                  Rs. {item.price} + shipping
                </div>
              </div>
            </div>
          </div>
        ))
    ) : (
      <p className="text-center">No orders found</p>
    )}
  </div>
</div>



  </div>
</div>
    </Container>
    </div>
  );
};

export default CartPage;
