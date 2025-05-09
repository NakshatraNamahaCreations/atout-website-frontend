import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from "../redux/cartSlice";
import './checkout.css';
import axios from 'axios';
import animation from '../Images/Animation.gif';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createOrder } from '../redux/actions/orderActions';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Retrieve cart items from local storage or location state
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    return location.state?.cartItems || savedCart;
  });

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [voucherCode, setVoucherCode] = useState(""); 
  const [appliedVoucher, setAppliedVoucher] = useState(null); 
  const [discount, setDiscount] = useState(0);
  const [voucherData, setVoucherData] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { loading, order, error } = useSelector((state) => state.order);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const useData = localStorage.getItem("user");
  const parsedData = useData ? JSON.parse(useData) : null;

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1);

  // Load vouchers from local storage
  useEffect(() => {
    const savedVouchers = JSON.parse(localStorage.getItem("voucher")) || [];
    setVoucherData(Array.isArray(savedVouchers) ? savedVouchers : [savedVouchers]);
  }, []);

  // Load saved addresses from session storage
  useEffect(() => {
    const savedData = JSON.parse(sessionStorage.getItem('savedAddresses')) || [];
    setSavedAddresses(savedData);
    if (savedData.length > 0) {
      setSelectedAddressIndex(0);
      setSelectedAddress(savedData[0]);
      setCurrentStep(cartItems.length > 0 ? 2 : 1); // Adjust step based on cart items
      setShowForm(false); // Hide form if addresses exist
    } else {
      setShowForm(true); // Show form by default if no saved addresses
    }
  }, [cartItems]);

  // Update cart items in local storage and stepper state
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    if (cartItems.length > 0) {
      setCurrentStep(2); // If cart has items, mark Cart step as completed and move to Address & Shipping
    } else if (savedAddresses.length > 0) {
      setCurrentStep(1); // If no cart items but address exists, start at step 1 (Address & Shipping)
    } else {
      setCurrentStep(1); // Default to step 1 (Address & Shipping) if no cart items or addresses
    }
  }, [cartItems, savedAddresses]);

  // Apply voucher logic
  const applyVoucher = () => {
    const selectedVoucher = voucherData.find(
      (v) => v.voucherCode.toLowerCase().trim() === voucherCode.toLowerCase().trim()
    );
    if (selectedVoucher) {
      const discountPercentage = parseFloat(selectedVoucher.discountPercentage) / 100;
      const subtotal = cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
      setAppliedVoucher(selectedVoucher);
      setDiscount(subtotal * discountPercentage);
    } else {
      alert("Invalid Voucher Code");
    }
  };

  // Scroll to top on mount
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
  const shippingCharges = 0; // Set to 0 as per image (FREE shipping)
  const grandTotal = subtotal - discount;

  // Handle payment
  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error('Please select an address before proceeding to payment.');
      return;
    }

    setCurrentStep(cartItems.length > 0 ? 3 : 2); // Move to Payment step

    const orderData = {
      email: selectedAddress.email,
      firstName: selectedAddress.firstName,
      lastName: selectedAddress.lastName,
      address: {
        address: selectedAddress.address,
        number: selectedAddress.phoneNumber,
        city: selectedAddress.city,
      },
      phoneNumber: selectedAddress.phoneNumber,
      cartItems: cartItems.map(item => ({
        images: item.images[0],
        category: item.category,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        sku: item.sku,
        _id: item._id,
      })),
      paymentMethod,
      coupon: appliedVoucher ? appliedVoucher.voucherCode : "No Coupon Applied",
      discount: discount,
      totalAmount: grandTotal,
      date: new Date().toLocaleDateString(),
      userId: parsedData.id,
    };

    dispatch(createOrder(orderData));

    if (paymentMethod === 'UPI') {
      try {
        const response = await axios.post('https://api.atoutfashion.com/api/payments/initiate', {
          merchantOrderId: `ORDER_${Date.now()}`,
          amount: grandTotal * 100,
        });

        const redirectUrl = response.data?.redirectUrl;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          alert("Payment initiation failed or missing redirect URL!");
        }
      } catch (error) {
        console.error('Payment initiation error:', error.response?.data || error);
        alert("An error occurred! Check console for details.");
      }
    }
  };

  // Handle order creation response
  useEffect(() => {
    if (order) {
      setOrderPlaced(true);
      dispatch(clearCart());
      setTimeout(() => {
        navigate('/order-success', { state: { orderId: order.id } });
      }, 2000);
    }
    if (error) {
      console.error('Error creating order:', error);
    }
  }, [order, error, dispatch, navigate]);

  // Save address
  const handleSaveInformation = () => {
    const newAddress = {
      email,
      firstName,
      lastName,
      address,
      landmark,
      city,
      state,
      pincode,
      phoneNumber,
    };

    let updatedAddresses = [...savedAddresses];
    if (selectedAddressIndex !== null) {
      updatedAddresses[selectedAddressIndex] = newAddress;
    } else {
      updatedAddresses.push(newAddress);
    }

    setSavedAddresses(updatedAddresses);
    sessionStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    toast.success('Address saved successfully!');
    setShowForm(false);
    setSelectedAddressIndex(updatedAddresses.length - 1);
    setSelectedAddress(newAddress);
    setCurrentStep(cartItems.length > 0 ? 2 : 1); // Stay on Address & Shipping step

    // Reset form fields
    setEmail('');
    setFirstName('');
    setLastName('');
    setAddress('');
    setLandmark('');
    setCity('');
    setState('');
    setPincode('');
    setPhoneNumber('');
  };

  // Edit address
  const handleEditAddress = (index) => {
    const addressToEdit = savedAddresses[index];
    setEmail(addressToEdit.email);
    setFirstName(addressToEdit.firstName);
    setLastName(addressToEdit.lastName);
    setAddress(addressToEdit.address);
    setLandmark(addressToEdit.landmark);
    setCity(addressToEdit.city);
    setState(addressToEdit.state);
    setPincode(addressToEdit.pincode);
    setPhoneNumber(addressToEdit.phoneNumber);
    setSelectedAddressIndex(index);
    setShowForm(true);
  };

  // Select address
  const handleSelectAddress = (index) => {
    setSelectedAddressIndex(index);
    setSelectedAddress(savedAddresses[index]);
    setCurrentStep(cartItems.length > 0 ? 2 : 1); // Stay on Address & Shipping step
  };

  return (
    <div className="container" style={{ marginTop: '8%', fontFamily: "'Poppins', sans-serif" }}>
      {/* Stepper */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', position: 'relative' }}>
        {/* Only show Cart step if cartItems exist */}
        {cartItems.length > 0 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '20px' }}>
              <div
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  backgroundColor: '#28a745', // Green since cart has items
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  zIndex: 1,
                }}
              >
                ✓
              </div>
              <span style={{ marginTop: '5px', color: '#28a745' }}>Cart</span>
            </div>
            {/* Solid line between Cart and Address & Shipping */}
            <div
              style={{
                width: '70px',
                height: '2px',
                backgroundColor: '#000',
                position: 'absolute',
                left: 'calc(50% - 90px)',
                top: '17px',
                zIndex: 0,
              }}
            />
          </>
        )}
        
        {/* Address & Shipping Step */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '20px' }}>
          <div
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              backgroundColor: currentStep === (cartItems.length > 0 ? 2 : 1) ? '#ff4500' : currentStep > (cartItems.length > 0 ? 2 : 1) ? '#28a745' : '#ccc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontWeight: 'bold',
              zIndex: 1,
            }}
          >
            {currentStep > (cartItems.length > 0 ? 2 : 1) ? '✓' : cartItems.length > 0 ? '2' : '1'}
          </div>
          <span
            style={{
              marginTop: '5px',
              color: currentStep === (cartItems.length > 0 ? 2 : 1) ? '#ff4500' : currentStep > (cartItems.length > 0 ? 2 : 1) ? '#28a745' : '#000',
            }}
          >
            Address & Shipping
          </span>
        </div>

        {/* Solid line between Address & Shipping and Payment */}
        <div
          style={{
            width: '70px',
            height: '2px',
            backgroundColor: '#000',
            position: 'absolute',
            left: cartItems.length > 0 ? 'calc(50% + 0px)' : 'calc(50% - 50px)',
            top: '17px',
            zIndex: 0,
          }}
        />

        {/* Payment Step */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              backgroundColor: currentStep === (cartItems.length > 0 ? 3 : 2) ? '#ff4500' : '#ccc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontWeight: 'bold',
              zIndex: 1,
            }}
          >
            {cartItems.length > 0 ? '3' : '2'}
          </div>
          <span style={{ marginTop: '5px', color: currentStep === (cartItems.length > 0 ? 3 : 2) ? '#ff4500' : '#000' }}>
            Payment
          </span>
        </div>
      </div>

      <div className="row checkout-row">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="col-md-7">
          <ToastContainer />
          
          {/* Show Form if showForm is true */}
          {showForm && (
            <div className="mt-4">
              <h4>
                Customer Information <span style={{ color: 'red' }}>*</span>
              </h4>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <h5>
                Shipping Address <span style={{ color: 'red' }}>*</span>
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
              <div className="row">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <button
                className="btn me-2"
                onClick={handleSaveInformation}
                style={{ backgroundColor: '#5a352d', color: 'white' }}
              >
                Save Address
              </button>
            </div>
          )}

          {/* Add New Address Button - Only show if there are saved addresses */}
          {savedAddresses.length > 0 && (
            <button
              className="btn btn-secondary mt-2"
              onClick={() => setShowForm(true)}
              style={{ backgroundColor: '#5a352d', color: 'white', border: 'none' }}
            >
              <FaPlus /> Add New Address
            </button>
          )}

          {/* Display Saved Addresses Below the Button */}
          {savedAddresses.length > 0 && (
            <div className="mt-3">
              {savedAddresses.map((addr, index) => (
                <div
                  key={index}
                  className={`border p-2 rounded d-flex justify-content-between align-items-center mb-3 ${
                    selectedAddressIndex === index ? 'bg-light' : ''
                  }`}
                  onClick={() => handleSelectAddress(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <p className="mb-0">
                      <strong>
                        {addr.firstName} {addr.lastName}
                      </strong>
                    </p>
                    <p className="mb-0" style={{ fontSize: '14px' }}>
                      {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="mb-0" style={{ fontSize: '14px' }}>
                      Phone: {addr.phoneNumber}
                    </p>
                  </div>
                  <FaEdit
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(index);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div
            className="mt-4"
            style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' }}
          >
            <h5 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Payment</h5>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="upi"
                value="UPI"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="upi" style={{ marginLeft: '10px' }}>
                UPI
              </label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="cod"
                value="Cash on Delivery"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="cod" style={{ marginLeft: '10px' }}>
                Cash on Delivery
              </label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="netBanking"
                value="Net Banking"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label
                className="form-check-label"
                htmlFor="netBanking"
                style={{ marginLeft: '10px' }}
              >
                Net Banking
              </label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="cardPayment"
                value="Card Payment"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label
                className="form-check-label"
                htmlFor="cardPayment"
                style={{ marginLeft: '10px' }}
              >
                Card Payment
              </label>
            </div>

            {order && <p>Order created successfully. Order ID: {order.id}</p>}
          </div>
        </div>

        <div
          className="col-md-5"
          style={{
            backgroundColor: '#FFF2ED',
            padding: '20px',
            borderRadius: '8px',
            height: '50%',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h4 style={{ fontSize: '24px', marginBottom: '20px' }}>
            Checkout | {cartItems.length} items
          </h4>
          <h5 style={{ fontSize: '18px', marginBottom: '15px' }}>Order Summary</h5>
          {cartItems.map((item, index) => (
            <div key={index} className="d-flex align-items-center mb-3 border-bottom pb-3">
              <img
                src={item.images[0]}
                alt={item.name}
                style={{
                  width: '80px',
                  height: 'auto',
                  objectFit: 'cover',
                  marginRight: '15px',
                  borderRadius: '5px',
                }}
              />
              <div>
                <h5 style={{ fontSize: '14px', margin: '0' }}>{item.name}</h5>
                <p style={{ margin: '0', color: '#555', fontSize: '14px' }}>
                  Price: Rs. {item.price} x {item.quantity || 1}
                </p>
                <p style={{ margin: '0', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
                  Total: Rs. {item.price * (item.quantity || 1)}
                </p>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <div className="d-flex mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Voucher Code"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                style={{ fontSize: '12px' }}
              />
              <button
                className="btn btn-gray ml-2"
                onClick={applyVoucher}
                style={{
                  backgroundColor: 'gray',
                  color: 'white',
                  borderColor: 'black',
                  fontSize: '14px',
                }}
              >
                Apply
              </button>
            </div>

            {appliedVoucher ? (
              <h5 className="text-success" style={{ fontSize: '12px' }}>
                Coupon Applied: {appliedVoucher.voucherCode} ({appliedVoucher.discountPercentage}% Off)
              </h5>
            ) : (
              <h5 className="text-danger" style={{ fontSize: '12px' }}>
                No Coupon Applied
              </h5>
            )}

            <h5 className="d-flex justify-content-between" style={{ fontSize: '15px' }}>
              <span>Subtotal:</span>
              <span>Rs. {subtotal}</span>
            </h5>
            <h5 className="d-flex justify-content-between" style={{ fontSize: '15px' }}>
              <span>Shipping:</span>
              <span style={{ color: '#28a745' }}>FREE</span>
            </h5>

            <h4
              className="d-flex justify-content-between mt-3 text-dark"
              style={{ fontSize: '15px' }}
            >
              <p>Order Total:</p>
              <span style={{ fontSize: '15px', fontWeight: 'bold' }}>
                Rs. {grandTotal.toFixed(2)}
              </span>
            </h4>
            <p style={{ fontSize: '12px', color: '#555', textAlign: 'right' }}>
              Inclusive of all taxes
            </p>

            <button
              className="btn btn-primary w-100"
              onClick={handlePayment}
              style={{
                backgroundColor: '#5a352d',
                borderColor: '#5a352d',
                fontWeight: 'bold',
                padding: '10px 0',
                borderRadius: '5px',
                fontSize: '16px',
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;