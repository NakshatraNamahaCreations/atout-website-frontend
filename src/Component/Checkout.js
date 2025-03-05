import React, { useState , useEffect, useLayoutEffect} from 'react';
import { useLocation, useRevalidator } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from "../redux/cartSlice";
import './checkout.css';
import animation from '../Images/Animation.gif'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createOrder } from '../redux/actions/orderActions';


const Checkout = () => {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

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
  const [voucherCode, setVoucherCode] = useState(""); // User input
  const [appliedVoucher, setAppliedVoucher] = useState(null); // Selected Voucher
  const [discount, setDiscount] = useState(0);
  const [voucherData, setVoucherData] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const dispatch = useDispatch();
  const { loading, order, error } = useSelector((state) => state.order);
  
  
  const useData = localStorage.getItem("user");
  const parsedData = useData ? JSON.parse(useData) : null;

  useEffect(() => {
    const savedVouchers = JSON.parse(localStorage.getItem("voucher")) || [];
    console.log("Saved Vouchers in Local Storage:", savedVouchers);
    
  
    setVoucherData(Array.isArray(savedVouchers) ? savedVouchers : [savedVouchers]);
  }, []);
  
  
  

  console.log(parsedData, "parsedData");
  const applyVoucher = () => {
    console.log("Available Vouchers in State:", voucherData);
    console.log("Entered Voucher Code:", voucherCode);
  
    const selectedVoucher = voucherData.find(
      (v) => v.voucherCode.toLowerCase().trim() === voucherCode.toLowerCase().trim()
    );
  
    if (selectedVoucher) {
      console.log("Voucher Found:", selectedVoucher);
      const discountPercentage = parseFloat(selectedVoucher.discountPercentage) / 100;
      const subtotal = cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  
      setAppliedVoucher(selectedVoucher);
      setDiscount(subtotal * discountPercentage);
    } else {
      console.log("Invalid Voucher Code Entered");
      alert("Invalid Voucher Code");
    }
  };
  
  

    useLayoutEffect(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, []);
  
  
  
  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
  const shippingCharges = 130;
  const grandTotal = subtotal + shippingCharges - discount;
  // const discount = 0;
  const handlePayment = () => {
    const orderData = {
      email,
      firstName,
      lastName,
      address: { address, number: phoneNumber, city },
      phoneNumber,
      cartItems: cartItems.map((item) => ({
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
      discount,
      totalAmount: grandTotal,
      date: new Date().toLocaleDateString(),
      userId: parsedData.id,
    };
  
    console.log("Order Data:", orderData);
    dispatch(createOrder(orderData));
  };
  
  
  
  useEffect(() => {
    if (order) {
      console.log('Order created successfully:', order); 
      setOrderPlaced(true);
      dispatch(clearCart());
  
     
      setTimeout(() => {
        window.location.href = "/shop"; 
      }, 2000); 
    }
  
    if (error) {
      console.error('Error creating order:', error);
    }
  }, [order, error, dispatch]);
  
  
  const handleSaveInformation = (e) => {
    if (e.target.checked) {
      toast.success("Information saved successfully!", {
        position: "top-right",
        autoClose: 2000, // Closes in 2 seconds
        closeOnClick: true,
        draggable: true,
      });
    }
  };
  

  return (
    <div className="container" style={{marginTop:'8%', fontFamily:"'Poppins', sans-serif"}} >
         {orderPlaced ? (
        // Success Message UI
        <div className="text-center">
          <img src={animation} alt="Success" style={{ width: "200px", height: "auto" }} />
          <h3 className="mt-3 text-success">Order Placed Successfully!</h3>
          {/* <p>Your order ID: {order.id}</p> */}
          <p>Thank you for shopping with us.</p>
        </div>
      ) : (
      <div className="row checkout-row">
          {error && <p style={{ color: 'red' }}>{error}</p>}
<div className="col-md-7">
  <h4>Contact<span style={{color:'red',}}>*</span></h4>
  <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
  <label>
    <input type="checkbox" /> Email me with news and offers
  </label>

  <h5 className="mt-4">Delivery<span style={{color:'red'}}>*</span></h5>
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
<label>
  <input type="checkbox" onChange={handleSaveInformation} /> Save this information
</label>
<ToastContainer />


  <div className="mt-4" style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
  <h5 style={{ marginBottom: "20px", fontWeight: "bold" }}>Payment</h5>
  
  {/* Payment Options */}
  <div className="form-check mb-3">
  <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="upi"
                value="UPI"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
    <label className="form-check-label" htmlFor="upi" style={{ marginLeft: "10px" }}>
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
    <label className="form-check-label" htmlFor="cod" style={{ marginLeft: "10px" }}>
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
    <label className="form-check-label" htmlFor="netBanking" style={{ marginLeft: "10px" }}>
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
    <label className="form-check-label" htmlFor="cardPayment" style={{ marginLeft: "10px" }}>
      Card Payment
    </label>
  </div>



          
            {order && <p>Order created successfully. Order ID: {order.id}</p>}
</div>

</div>


     {/* Cart Summary */}
     <div className="col-md-5" style={{ backgroundColor: "#FFF2ED", padding: "20px", borderRadius: "8px", height: "50%", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
    {cartItems.map((item, index) => (
      <div key={index} className="d-flex align-items-center mb-3 border-bottom pb-3">
        <img src={item.images[0]} alt={item.name} style={{ width: "80px", height: "auto", objectFit: "cover", marginRight: "15px", borderRadius: "5px" }} />
        <div>
          <h5 style={{ fontSize: "14px", margin: "0" }}>{item.name}</h5>
          <p style={{ margin: "0", color: "#555", fontSize: "14px" }}>Price: Rs. {item.price} x {item.quantity || 1}</p>
          <p style={{ margin: "0", fontWeight: "bold", color: "#333" , fontSize: "14px"}}>Total: Rs. {item.price * (item.quantity || 1)}</p>
        </div>
      </div>
    ))}

    {/* Subtotal, Shipping, and Grand Total */}
    <div className="mt-4">
         {/* Voucher Code Input */}
         <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Voucher Code"
          value={voucherCode}
          
          onChange={(e) => setVoucherCode(e.target.value)}
          style={{fontSize:'12px'}}
        />
        <button className="btn btn-gray ml-2" onClick={applyVoucher} style={{backgroundColor:'gray', color:'white', borderColor:'black', fontSize:'14px'}}>Apply</button>
      </div>
          {/* Show Discount if Applied */}
          {/* {appliedVoucher && (
        <h5 className="d-flex justify-content-between text-success">
          <span>Discount ({appliedVoucher.discountPercentage} off):</span>
          <span>- Rs. {discount.toFixed(2)}</span>
        </h5>
      )} */}
      {appliedVoucher ? (
  <h5 className="text-success"  style={{fontSize:'12px'}}>Coupon Applied: {appliedVoucher.voucherCode} ({appliedVoucher.discountPercentage}% Off)</h5>
) : (
  <h5 className="text-danger"  style={{fontSize:'12px'}}>No Coupon Applied</h5>
)}


      <h5 className="d-flex justify-content-between"  style={{fontSize:'15px'}}><span>Subtotal:</span><span>Rs. {subtotal}</span></h5>
      <h5 className="d-flex justify-content-between" style={{fontSize:'15px'}}><span>Shipping Charges:</span><span>Rs. {shippingCharges}</span></h5>

   

  
      {/* Grand Total */}
      <h4 className="d-flex justify-content-between mt-3 text-dark" style={{fontSize:'15px'}}>
        <p>Grand Total:</p>
        <span style={{fontSize:'15px', fontWeight:'bold'}}>Rs. {grandTotal.toFixed(2)}</span>
      </h4>

      {/* Payment Button */}
      {/* Proceed to Payment Button */}
 <button
              className="btn btn-primary w-100"
              onClick={handlePayment}
              style={{
                backgroundColor: '#5a352d',
                borderColor: '#5a352d',
                fontWeight: 'bold',
                padding: '10px 0',
                borderRadius: '5px',
                fontSize:'16px'
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
    </div>
  </div>


      </div>
       )}
    </div>
  );
};

export default Checkout;
