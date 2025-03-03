import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrdersPage = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(() => JSON.parse(localStorage.getItem("ratings")) || {});
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const parsedData = JSON.parse(localStorage.getItem("user"));
    if (parsedData?.id) {
      fetchUserOrders(parsedData.id);
    }
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
      const response = await axios.get(`https://api.atoutfashion.com/api/orders/user/${userId}`);
      setUserOrders(response.data);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(`https://api.atoutfashion.com/api/reviews/${productId}`);
      setReviews((prev) => ({ ...prev, [productId]: response.data.reviews }));
    } catch (error) {
      console.error("Error fetching reviews:", error.response?.data || error.message);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await axios.post(`https://api.atoutfashion.com/api/reviews`, {
        productId: selectedProduct._id,
        customerName,
        rating: rating[selectedProduct._id],
        comment,
      });

      setReviews((prev) => ({ ...prev, [selectedProduct._id]: [...(prev[selectedProduct._id] || []), { customerName, rating: rating[selectedProduct._id], comment }] }));
      localStorage.setItem("ratings", JSON.stringify({ ...rating, [selectedProduct._id]: rating[selectedProduct._id] }));
      setCustomerName("");
      setComment("");
      alert("Review submitted successfully");
      fetchReviews(selectedProduct._id);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Orders</h2>
      {userOrders.length > 0 ? (
        <div className="row">
         {userOrders.map((order) => (
  <div key={order._id} className="col-md-3 col-sm-6">
    <div className="card shadow-sm mb-3" style={{ width: "100%", maxWidth: "250px", minHeight: "320px" }}>
      {order.cartItems[0]?.images[0] ? (
        <img
          src={order.cartItems[0].images[0]}
          className="card-img-top"
          alt={order.cartItems[0].name}
          style={{ height: "120px", objectFit: "cover" }}
        />
      ) : (
        <div className="text-center p-2" style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
          No Image Available
        </div>
      )}
      <div className="card-body p-2">
        <h6 className="card-title text-truncate">{order.cartItems[0]?.name || "Unknown Product"}</h6>
        <p className="card-text mb-1" style={{ fontSize: "14px" }}>Qty: {order.cartItems[0]?.quantity || "N/A"}</p>
        <p className="card-text mb-1" style={{ fontSize: "14px" }}>₹{order.cartItems[0]?.price || "N/A"}</p>
        <p className="text-muted mb-1" style={{ fontSize: "12px" }}>Status: {order.cartItems[0]?.status || "N/A"}</p>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{ cursor: "pointer", color: star <= (rating[order.cartItems[0]._id] || 0) ? "gold" : "gray", fontSize: "14px" }}
              onClick={() => {
                setSelectedProduct(order.cartItems[0]);
                setRating((prev) => {
                  const updatedRating = { ...prev, [order.cartItems[0]._id]: star };
                  localStorage.setItem("ratings", JSON.stringify(updatedRating));
                  return updatedRating;
                });
                fetchReviews(order.cartItems[0]._id);
              }}
            >
              ★
            </span>
          ))}
        </div>
        <p className="mt-1" style={{ fontSize: "12px" }}>Your Rating: {rating[order.cartItems[0]._id] || "Not rated yet"}</p>
      </div>
    </div>
  </div>
))}

        </div>
      ) : (
        <p className="text-center">No orders found.</p>
      )}

      {selectedProduct && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Write a Review</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedProduct(null)}></button>
              </div>
              <div className="modal-body">
                <input type="text" className="form-control mb-2" placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <textarea className="form-control mb-2" placeholder="Your Comment" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                <button className="btn btn-success w-100" onClick={handleReviewSubmit}>Submit Review</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
