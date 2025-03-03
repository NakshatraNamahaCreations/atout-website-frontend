import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import vector from "../Images/Vector1222.png";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel';
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addToCart ,removeFromCart } from '../redux/cartSlice';
import { faHeart, faShoppingCart, faShippingFast, faStar } from "@fortawesome/free-solid-svg-icons";
import sareeimage1 from '../Images/sareeimage1.png';
import sareeimage2 from '../Images/sareeimage2.png';
import sareeimage3 from '../Images/sareeimage3.png';
import sareeimage4 from '../Images/sareeimage4.png';
import Slider from "react-slick";
import image1 from "../Images/cutimages/image1.png";
import image2 from "../Images/cutimages/image2.png";
import image3 from "../Images/cutimages/image3.png";
import image4 from "../Images/cutimages/image4.png";
import { useNavigate } from "react-router-dom"; 
import { useSelector } from "react-redux";

import { setSelectedProduct, selectSelectedProduct } from "../redux/selectedProductSlice";


const DescriptionPage = ({product}) => {
  const dispatch = useDispatch();
  const selectedProductFromRedux = useSelector(selectSelectedProduct); 
  const location = useLocation();
  const navigate = useNavigate();
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isShipping, setIsShipping]= useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeSlide, setActiveSlide] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [voucherData, setVoucherData] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const useData = localStorage.getItem("user");
  const parsedData = useData ? JSON.parse(useData) : null;
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  const [selectedProduct, setSelectedProductState] = useState(
    location.state?.product || selectedProductFromRedux || JSON.parse(localStorage.getItem("selectedProduct"))
  );

const [userOrders, setUserOrders] = useState([]);

useEffect(() => {
  if (parsedData?.id) {
    fetchUserOrders(parsedData.id);
  }
}, [parsedData?.id]);

const fetchUserOrders = async (userId) => {
  try {
    const response = await axios.get(`https://api.atoutfashion.com/api/orders/user/${userId}`);
    setUserOrders(response.data);
  } catch (error) {
    console.error("Error fetching user orders:", error);
  }
};

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://api.atoutfashion.com/api/orders");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched Orders:", data); // Log fetched data
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();
  }, []);

  
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`https://api.atoutfashion.com/api/reviews/${selectedProduct._id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    if (location.state?.product) {
      setSelectedProductState(location.state.product);
    } else if (selectedProductFromRedux) {
      setSelectedProductState(selectedProductFromRedux);
    } else {
      const savedProduct = localStorage.getItem("selectedProduct");
      if (savedProduct) {
        setSelectedProductState(JSON.parse(savedProduct));
      }
    }
  }, [location.state?.product, selectedProductFromRedux]);
  
 
  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post(`https://api.atoutfashion.com/api/reviews`, {
        productId: selectedProduct._id,
        customerName,
        rating,
        comment,
      });
  
      setReviews([...reviews, response.data.review]);
      setCustomerName("");
      setRating(0);
      setComment("");
      alert("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };
  
  const getVoucher = async () => {
    try {
      const res = await axios.get("https://api.atoutfashion.com/api/getvoucher");
      if (res.status === 200) {
        setVoucherData(res.data?.voucher || []);
      }
    } catch (error) {
      console.error("Error fetching voucher data:", error);
    }
  };
  useEffect(() => {
    getVoucher();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  
    let savedVouchers = JSON.parse(localStorage.getItem("voucher")) || [];
  
    // Ensure savedVouchers is always an array
    if (!Array.isArray(savedVouchers)) {
      savedVouchers = [savedVouchers];
    }
  
    // Find the selected voucher
    const selectedVoucher = voucherData.find((v) => v.voucherCode === code);
  
    if (selectedVoucher) {
      // Avoid duplicate entries
      if (!savedVouchers.some((v) => v.voucherCode === code)) {
        savedVouchers.push(selectedVoucher);
        localStorage.setItem("voucher", JSON.stringify(savedVouchers));
      }
    }
  };
  
  const handleProductClick = (item) => {
    console.log("Clicked product:", item);
    dispatch(setSelectedProduct(item));
    console.log("Dispatched setSelectedProduct");
  };
  
  

  useEffect(() => {
    const savedVoucher = localStorage.getItem("voucher");
    if (savedVoucher) {
      setVoucherData([JSON.parse(savedVoucher)]); // Load only the saved voucher
    } else {
      getVoucher(); // Fetch from API if no voucher is saved
    }
  }, []);
  
  useEffect(() => {
    if (selectedProduct && selectedProduct._id) {
      const savedRating = localStorage.getItem(`rating_${selectedProduct._id}`);
      if (savedRating) {
        setSelectedRating(Number(savedRating)); // Set the saved rating
      }
    }
  }, [selectedProduct]);  // Depend on the selectedProduct to re-run when it changes
  

    
  

    

  
    const handleDotClick = (index) => {
      setActiveSlide(index);
    };

  const saveRating = (rating) => {
    localStorage.setItem(`rating_${selectedProduct._id}`, rating);
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    saveRating(rating);
  };

  const handleWishlistToggle = async (product) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser ? storedUser.id : null;

      if (!userId) {
        alert("User not logged in");
        return;
      }

      const response = await fetch("https://api.atoutfashion.com/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product._id }),
      });

      const data = await response.json();

      if (response.ok) {
        setWishlist((prevWishlist) => {
          const exists = prevWishlist.some((item) => item._id === product._id);

          let updatedWishlist;
          if (exists) {
            updatedWishlist = prevWishlist.filter((item) => item._id !== product._id);
          } else {
            updatedWishlist = [...prevWishlist, product];
          }

          localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
          return updatedWishlist;
        });
      } else {
        alert(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Failed to update wishlist, please try again.");
    }
  };

  const handleImageSelect = (image) => {
    console.log("Selected image:", image);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...selectedProduct, quantity: 1 }));
    setCartVisible(true); // Show the cart after adding item
  };

  const handleBuyNow = () => {
    navigate('/checkout', { state: { cartItems: [{ ...selectedProduct, quantity: 1 }] } });
  };




  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);  
  }


  return (
    <>
    <div className="d-none d-lg-block"
      style={{
        padding: "20px",
        maxWidth: "1200px",
        marginTop: "8%",
        overflow: "hidden",

      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Left Section: Image */}
        <div style={{ flex: "1", textAlign: "center" }}>
  {/* Main Image */}
  <div
    style={{
      position: "relative",
      height: "400px",
      marginBottom: "20px",
      overflow: "hidden", 
      cursor: "zoom-in",
    }}
    onClick={handleModalOpen} // Open modal on click
  >
    <img
     src={selectedProduct.images[0]}
      alt={selectedProduct.category}
      style={{
        width: "100%",
        height: "auto",
        objectFit: "cover",
        borderRadius: "10px",
      }}
    />
  </div>

  {/* Thumbnails */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(5, 60px)",
      gap: "10px",
      justifyContent: "center",
    }}
  >
   {selectedProduct.images?.slice(0, 4).map((image, index) => (
        <div
          key={index}
          style={{
            border: selectedProduct === image ? "2px solid #FF5722" : "1px solid #ddd",
            borderRadius: "5px",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => handleImageSelect(image)} // Uncomment if needed
        >
          <img
            src={image}
            alt={`Thumbnail ${index}`}
            style={{
              width: "100%",
              height: "60px",
              objectFit: "cover",
            }}
          />
        </div>
      ))}
  </div>

  {/* Modal for Zoomed Image */}
  {isModalOpen && (
    <div
      style={{
        position: "fixed",
        top: "8%",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "1000",
      }}
      onClick={handleModalClose} // Close modal on background click
    >
      <img
      src={selectedProduct.images[0]}
        alt={selectedProduct.category}
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          borderRadius: "10px",
          cursor: "zoom-out",
        }}
      />
    </div>
  )}
</div>


        {/* Right Section: Details */}
        <div style={{ flex: "2" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>{selectedProduct.category}</h1>
    <FontAwesomeIcon
      icon={faHeart} // Wishlist Icon
      style={{
        color: wishlist.some((item) => item._id === selectedProduct._id) ? "#FF5722" : "#D3D3D3",
        fontSize: "24px",
        marginLeft: "10px", // Space between the title and icon
        cursor: "pointer", // Makes the icon clickable
      }}
      onClick={() => handleWishlistToggle(selectedProduct)}
    />
  </div>
  <h2
    style={{
      fontSize: "22px",
      fontWeight: "bold",
      marginTop: "10px",
      color: "#795441",
    }}
  >
    ₹{selectedProduct.price}
  </h2>
  <p>(Inclusive of all taxes)</p>

  {/* Ratings Section */}
  <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', marginLeft: '10px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            style={{
              color: star <= selectedRating ? '#FFD700' : '#D3D3D3',
              marginRight: '3px',
              fontSize: '20px',
              cursor: 'pointer', // Makes the stars look clickable
            }}
            onClick={() => handleRatingClick(star)} // Handle click to set rating
          />
        ))}
      </div>
      <span style={{ fontSize: '14px', marginLeft: '8px' }}>
        {/* You can display the rating here */}
        ({selectedRating} / 5)
      </span>
    </div>

  <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
    <button
     onClick={() => handleAddToCart(product)}
      style={{
        padding: "15px 25px",
        width: "300px",
        height: "50px",
        backgroundColor: "#8B5635",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Add to Cart
    </button>
    <button
      onClick={handleBuyNow}
      style={{
        padding: "15px 25px",
        width: "300px",
        height: "50px",
        backgroundColor: "#ECA600",
        color: "black",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Buy Now
    </button>
  </div>

  {/* Add Vector Image */}
  <div
    style={{
      marginTop: "20px",
      textAlign: "center",
      marginLeft: "-18%",
    }}
  >
    <img
      src={vector}
      alt="Vector illustration"
      style={{
        maxWidth: "100%",
        height: "auto",
        borderRadius: "10px",
        marginTop: "20px",
      }}
    />
  </div>

  {/* Best Offers Section */}
  <div
      style={{
        padding: "20px",
        textAlign: "center",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        width: "100%",
        margin: "auto",
      }}
    >
      <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
        {voucherData[activeSlide - 1]?.title || "Best Offers"}
      </h3>
      <div
        style={{
          margin: "15px 0",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: "16px", color: "#000", margin: 0 }}>
          {voucherData[activeSlide - 1]?.desc || "Loading offers..."} - 
          {voucherData[activeSlide - 1]?.discountPercentage || "N/A"} Off
        </p>
        <span
          onClick={() => copyToClipboard(voucherData[activeSlide - 1]?.voucherCode || "N/A")}
          style={{
            border: "1px dashed #333",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
            cursor: "pointer",
          }}
        >
          {voucherData[activeSlide - 1]?.voucherCode || "N/A"} 
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        {voucherData.map((_, index) => (
          <span
            key={index}
            onClick={() => handleDotClick(index + 1)}
            style={{
              height: "10px",
              width: "10px",
              margin: "0 5px",
              backgroundColor: activeSlide === index + 1 ? "#000" : "#ccc",
              borderRadius: "50%",
              display: "inline-block",
              cursor: "pointer",
            }}
          ></span>
        ))}
      </div>
    </div>


  {/* Collapsible Details Section */}
  <div style={{ marginTop: "30px", fontSize: "16px" }}>
    <h5
      style={{
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
      onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
    >
      Details
      <span style={{ fontSize: "24px" }}>{isDetailsExpanded ? "▲" : ">"}</span>
    </h5>
    {isDetailsExpanded && (
      <div style={{ marginTop: "10px" }}>
        <p>
          {selectedProduct.details || "A beautifully handcrafted saree made from premium fabric, featuring intricate designs and vibrant colors that add a touch of elegance to any occasion."}
        </p>
        <p><strong>Length:</strong> {selectedProduct.length || "6.5 meters"}</p>
        <p><strong>Color:</strong> {selectedProduct.color || "Red and Gold"}</p>
        <p><strong>Material:</strong> {selectedProduct.material || "Silk"}</p>
        <p><strong>Delivery Date:</strong>
          <span style={{ marginLeft: "8px", fontSize: "16px", color: "#FF5722" }}>
            <FontAwesomeIcon icon={faShippingFast} />
            {selectedProduct.deliveryDate || "Expected delivery within 7-10 business days after purchase."}
          </span>
        </p>
      </div>
    )}
  </div>
  <hr />

  {/* Collapsible Description Section */}
  <div style={{ marginTop: "20px", fontSize: "16px" }}>
    <h5
      style={{
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
    >
      Description
      <span style={{ fontSize: "24px" }}>{isDescriptionExpanded ? "▲" : ">"}</span>
    </h5>
    {isDescriptionExpanded && (
      
      <p style={{ marginTop: "10px" }}>
        A tribute to the erstwhile art of handweaving and handspinning, this handwoven cotton zari saree from our collection 'Atout by Supriya' will take you through your celebrations effortlessly with a subtle touch of glamour.

- An ethically crafted handwoven cotton zari saree in charming shades handdyed with festive hues.

- Suitable for day-long comfort, this saree is the perfect choice for celebrations with flawless elegance.

Being handwoven, the textile may have slight irregularities in the weaving work. These irregularities are the hallmark of all handmade products and make each artistic piece one-of-its-kind.
{/* {selectedProduct.description || "Silk"} */}
      </p>
    )}
  </div>
  <hr />
  <div style={{ marginTop: "20px", fontSize: "16px" }}>
    <h5
      style={{
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
      onClick={() => setIsShipping(!isShipping)}
    >
      Shipping and Returns
      <span style={{ fontSize: "24px" }}>{isShipping ? "▲" : ">"}</span>
    </h5>
    {isShipping && (
      <div style={{ marginTop: "10px" }}>
        <p>- Free Shipping.</p>
        <p>- Your order will be shipped within 7 to 10 business days.</p>
        <p>- Once your order is shipped, we will email you the tracking details.</p>
        <p>- For exchange/return, kindly email us at <a href="mailto:hello@atoutbysupriya.com">hello@atoutbysupriya.com</a>, within 48 hours of receiving the order.</p>
        <p>- Shipping charges of Rs. 300 will be applicable for exchange/return.</p>
      </div>
    )}
  </div>
</div>


      </div>

      <div className="review-section" style={{ marginTop: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
        <h2 onClick={() => setIsReviewOpen(!isReviewOpen)} style={{ cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
          Customer Reviews {isReviewOpen ? "▲" : "▼"}
        </h2>
        {isReviewOpen && (
          <div>
            {reviews.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {reviews.map((review, index) => (
                  <div key={index} className="review-item" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                    <h4>{review.customerName}</h4>
                    <div className="review-stars" style={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          style={{ color: i < review.rating ? '#FFD700' : '#D3D3D3', marginRight: '5px' }}
                        />
                      ))}
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}

            {/* <div className="add-review" style={{ marginTop: '20px' }}>
              <input
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
              />
              <div className="star-rating" style={{ marginBottom: '10px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    style={{ color: star <= rating ? '#FFD700' : '#D3D3D3', cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea
                placeholder="Write a review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ padding: '8px', width: '100%', height: '60px' }}
              />
              <button onClick={handleReviewSubmit} style={{ padding: '10px 20px', backgroundColor: '#795441', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>Submit Review</button>
            </div> */}
          </div>
        )}
      </div>

      <div className="row mt-4 text-center">
  <div className="col-12">
    <p className="fw-bold" style={{ fontSize: "20px" }}>You may also like</p>

    <div className="d-flex justify-content-center align-items-center mt-3">
  {userOrders.length > 0 ? (
    userOrders.map((order) =>
      order.cartItems.map((item, index) => (
        <div
          key={index}
          className="position-relative mx-2"
          style={{ width: "300px", height: "444px", cursor: "pointer" }}
          onClick={() => handleProductClick(item)} // Click handler here
        >
          <img
            src={item.images}
            alt={item.name}
            className="img-fluid"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            className="position-absolute start-0 top-0 w-100 h-100"
            style={{
              background: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%)",
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
      ))
    )
  ) : (
    <p>No orders found</p>
  )}
</div>


  </div>
</div>


    </div>
    <div style={{ padding: "20px", maxWidth: "1200px", marginTop:'21%' }} className="d-block d-lg-none">
      <div style={{ display: "flex", gap: "20px", flexDirection: "column", alignItems: "center" }}>
        {/* Left Section: Image */}
        <div style={{ width: "100%", textAlign: "center" }}>
        <div
  style={{
    position: "relative",
    height: "300px",
    marginBottom: "20px",
    cursor: "zoom-in",
  }}
  onClick={handleModalOpen}
>
  {/* Top-left corner content */}
  <div
    style={{
      position: "absolute",
      top: "10px",
      left: "10px",
      display: "flex",
      alignItems: "center",
      // background: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for better visibility
      padding: "5px 10px",
      borderRadius: "5px",
    }}
  >
   
    <FontAwesomeIcon
      icon={faHeart} // Wishlist Icon
      style={{
        color: wishlist.some((item) => item._id === selectedProduct._id)
          ? "#FF5722"
          : "#D3D3D3",
        fontSize: "20px",
        marginLeft: "10px", // Space between title and icon
        cursor: "pointer", // Makes the icon clickable
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevents triggering modal when clicking the wishlist icon
        handleWishlistToggle(selectedProduct);
      }}
    />
  </div>

  <img
    src={selectedProduct.images[0]}
    alt={selectedProduct.category}
    style={{
      width: "100%",
      height: "auto",
      objectFit: "cover",
      borderRadius: "10px",
    }}
  />
</div>


          {/* Thumbnails */}
          <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(5, 60px)",
      gap: "7px",
      marginTop:'45%',
      marginLeft:'18%',
      justifyContent: "center",
    }}
  >
   {selectedProduct.images?.slice(0, 4).map((image, index) => (
        <div
          key={index}
          style={{
            border: selectedProduct === image ? "2px solid #FF5722" : "1px solid #ddd",
            borderRadius: "5px",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => handleImageSelect(image)} // Uncomment if needed
        >
          <img
            src={image}
            alt={`Thumbnail ${index}`}
            style={{
              width: "100%",
              height: "60px",
              objectFit: "cover",
            }}
          />
        </div>
      ))}
  </div>

          {/* Modal */}
          {isModalOpen && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={handleModalClose}>
              <img src={selectedProduct.images[0]} alt={selectedProduct.category} style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "10px" }} />
            </div>
          )}
        </div>

        {/* Right Section: Details */}
        <div style={{ width: "100%", textAlign: "left" ,}}>
          <h1 style={{ fontSize: "18px", fontWeight: "bold" }}>{selectedProduct.category}</h1>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#795441" }}>₹{selectedProduct.price}</h2>
          <p>(Inclusive of all taxes)</p>

          {/* Ratings */}
          <div style={{ display: "flex", margin: "10px 0" }}>
  {[1, 2, 3, 4, 5].map((star) => (
    <FontAwesomeIcon
      key={star}
      icon={faStar}
      style={{
        color: star <= selectedRating ? "#FFD700" : "#D3D3D3",
        marginRight: "5px",
        fontSize: "20px",
        cursor: "pointer", // Makes stars look clickable
      }}
      onClick={() => handleRatingClick(star)} // Handles click to set rating
    />
  ))}
  <span style={{ marginLeft: "8px" }}>({selectedRating} / 5)</span>
</div>


          {/* Collapsible Sections */}
          <div style={{ textAlign: "left" }}>
          <p><strong>Length:</strong> {selectedProduct.length || "6.5 meters"}</p>
        <p><strong>Color:</strong> {selectedProduct.color || "Red and Gold"}</p>
        <p><strong>Material:</strong> {selectedProduct.material || "Silk"}</p>
        <p><strong>Delivery Date:</strong>
          <span style={{ marginLeft: "8px", fontSize: "16px", color: "#FF5722" }}>
            <FontAwesomeIcon icon={faShippingFast} />
            {selectedProduct.deliveryDate || "Expected delivery within 7-10 business days after purchase."}
          </span>
        </p>
            <h5   style={{
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
      }} onClick={() => setIsDetailsExpanded(!isDetailsExpanded)} >Details  <span style={{ fontSize: "24px" }}>{isDetailsExpanded ? "▲" : ">"}</span></h5>
            {isDetailsExpanded && <p>{selectedProduct.details || "A beautiful handcrafted saree."}</p>}
            <h5   style={{
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
      }} onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} >Description  <span style={{ fontSize: "24px" }}>{isDescriptionExpanded ? "▲" : ">"}</span></h5>
            {isDescriptionExpanded && <p>{selectedProduct.description}</p>}
            <h5 onClick={() => setIsShipping(!isShipping)}  style={{
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
      }}>Shipping & Returns <span style={{ fontSize: "24px" }}>{isShipping ? "▲" : ">"}</span></h5>
            {isShipping && (
              <div style={{ marginTop: "10px" }}>
              <p>- Free Shipping.</p>
              <p>- Your order will be shipped within 7 to 10 business days.</p>
              <p>- Once your order is shipped, we will email you the tracking details.</p>
              <p>- For exchange/return, kindly email us at <a href="mailto:hello@atoutbysupriya.com">hello@atoutbysupriya.com</a>, within 48 hours of receiving the order.</p>
              <p>- Shipping charges of Rs. 300 will be applicable for exchange/return.</p>
            </div>
            )}
          </div>
        </div>
      </div>

      <div className="review-section" style={{ marginTop: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
        <h2 onClick={() => setIsReviewOpen(!isReviewOpen)} style={{ cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
          Customer Reviews {isReviewOpen ? "▲" : "▼"}
        </h2>
        {isReviewOpen && (
          <div>
            {reviews.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                {reviews.map((review, index) => (
                  <div key={index} className="review-item" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                    <h4>{review.customerName}</h4>
                    <div className="review-stars" style={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          style={{ color: i < review.rating ? '#FFD700' : '#D3D3D3', marginRight: '5px' }}
                        />
                      ))}
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}

            <div className="add-review" style={{ marginTop: '20px' }}>
              <input
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
              />
              <div className="star-rating" style={{ marginBottom: '10px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    style={{ color: star <= rating ? '#FFD700' : '#D3D3D3', cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea
                placeholder="Write a review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ padding: '8px', width: '100%', height: '60px' }}
              />
              <button onClick={handleReviewSubmit} style={{ padding: '10px 20px', backgroundColor: '#795441', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>Submit Review</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Buy Now & Add to Cart Buttons (Mobile only) */}
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", backgroundColor: "white", padding: "10px 0", textAlign: "center", display: "flex", justifyContent: "center", gap: "10px", borderTop: "1px solid #ccc" }}>
        <button onClick={() => handleAddToCart(selectedProduct)} style={{ padding: "15px", backgroundColor: "#8B5635", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", flex: 1 }}>Add to Cart</button>
        <button onClick={handleBuyNow} style={{ padding: "15px", backgroundColor: "#ECA600", color: "black", border: "none", borderRadius: "5px", cursor: "pointer", flex: 1 }}>Buy Now</button>
      </div>

      {/* Responsive Design */}
      <style>{`
        @media (min-width: 768px) {
          div[style*="flex-direction: column"] {
            flex-direction: row !important;
            align-items: flex-start !important;
          }
          div[style*="width: 100%"] {
            // width: 50% !important;
          }
          div[style*="position: fixed"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
    </>
  );
};

export default DescriptionPage;

