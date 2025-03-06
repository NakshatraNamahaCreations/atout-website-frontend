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
    <div className="py-3" style={{ display: "flex", flexDirection: "column", minHeight: "50vh", fontFamily: "'Poppins', sans-serif", marginTop: "7%", marginLeft: "5%" }}>
      <h2 className="mb-4">My Orders</h2>

      {userOrders.length > 0 ? (
        <div className="row">
          {userOrders.flatMap((order) =>
            order.cartItems.map((item) => (
              <div key={item._id} className="col-md-3 col-sm-6">
                <div className="card shadow-sm mb-3" style={{ width: "100%", maxWidth: "250px", minHeight: "350px" }}>
                  {/* Product Image */}
                  {item.images[0] ? (
                    <img
                      src={item.images[0]}
                      className="card-img-top"
                      alt={item.name}
                      style={{ height: "120px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="text-center p-2" style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
                      No Image Available
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="card-body p-2">
                    <h6 className="card-title text-truncate">{item.name || "Unknown Product"}</h6>
                    <p className="card-text mb-1" style={{ fontSize: "14px" }}>Category: {item.category}</p>
                    <p className="card-text mb-1" style={{ fontSize: "14px" }}>Qty: {item.quantity || "N/A"}</p>
                    <p className="card-text mb-1" style={{ fontSize: "14px" }}>₹{item.price || "N/A"}</p>
                    <p className="text-muted mb-1" style={{ fontSize: "12px",  fontWeight: "bold" }}>Status: {item.status || "N/A"}</p>

                    {/* Rating Stars */}
                    <div className="mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{ cursor: "pointer", color: star <= (rating[item._id] || 0) ? "gold" : "gray", fontSize: "14px" }}
                          onClick={() => {
                            setRating((prev) => {
                              const updatedRating = { ...prev, [item._id]: star };
                              localStorage.setItem("ratings", JSON.stringify(updatedRating));
                              return updatedRating;
                            });
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="mt-1" style={{ fontSize: "12px" }}>Your Rating: {rating[item._id] || "Not rated yet"}</p>

                    {/* Write a Review Button */}
                    <button className="btn  btn-sm w-100 mt-2" onClick={() => setSelectedProduct(item)} style={{backgroundColor:'white', color:'black', borderColor:'black'}}>
                      Write a Review
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <p className="text-center">No orders found.</p>
      )}

      {/* Review Modal (Only appears when 'Write a Review' is clicked) */}
      {selectedProduct && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Write a Review</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedProduct(null)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Your Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <button className="btn btn-success w-100" onClick={handleReviewSubmit}>
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
   
  );
};

export default MyOrdersPage;
