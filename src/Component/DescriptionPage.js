import React, { useState, useEffect , useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import vector from "../Images/Vector1222.png";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addToCart ,removeFromCart } from '../redux/cartSlice';
import { faHeart, faShoppingCart, faShippingFast, faStar, faBolt, faShareAlt  } from "@fortawesome/free-solid-svg-icons";
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
  // const [activeSlide, setActiveSlide] = useState(1);
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
  // const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedProduct, setSelectedProductState] = useState(
    location.state?.product || selectedProductFromRedux || JSON.parse(localStorage.getItem("selectedProduct"))
  );
  const cartItems = useSelector((state) => state.cart.items); 
  const [allOrders, setAllOrders] = useState([]);
  const [selectedImage, setSelectedImage] = useState(selectedProduct.images[0]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, show: false });

  const imageRef = useRef(null);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setZoomPosition({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPosition({ ...zoomPosition, show: false });
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

// const [userOrders, setUserOrders] = useState([]);

// useEffect(() => {
//   if (parsedData?.id) {
//     fetchUserOrders(parsedData.id);
//   }
// }, [parsedData?.id]);

// const fetchUserOrders = async (userId) => {
//   try {
//     const response = await axios.get(`https://api.atoutfashion.com/api/orders/user/${userId}`);
//     setUserOrders(response.data);
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//   }
// };



  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);


  const handleBuyNowClick = () => {
    handleBuyNow();
    toast.success("Redirecting to Checkout...", {
      position: "top-right",
      autoClose: 2000,
    });
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

  const handleDotClick = (index) => {
    setActiveSlide(index);
  };


  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: selectedProduct.category,
          text: `Check out this product: ${selectedProduct.category} for ₹${selectedProduct.price}!`,
          url: window.location.href,
        })
        .then(() => console.log("Product shared successfully!"))
        .catch((error) => console.error("Error sharing product:", error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied!", { autoClose: 2000 });
    }
  };
  
  const copyToClipboard = (code, voucherData) => {
    if (!code) {
      toast.error("No voucher code found!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
  
    // Check if voucherData is undefined or empty
    if (!voucherData || !Array.isArray(voucherData) || voucherData.length === 0) {
      toast.error("Voucher data is missing!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
  
    // Copy the voucher code to the clipboard
    navigator.clipboard.writeText(code);
  
    // Retrieve saved vouchers from localStorage
    let savedVouchers = JSON.parse(localStorage.getItem("voucher")) || [];
  
    // Ensure savedVouchers is always an array
    if (!Array.isArray(savedVouchers)) {
      savedVouchers = [];
    }
  
    // Find the selected voucher
    const selectedVoucher = voucherData.find((v) => v.voucherCode === code);
  
    if (selectedVoucher) {
      // Avoid duplicate entries
      if (!savedVouchers.some((v) => v.voucherCode === code)) {
        savedVouchers.push(selectedVoucher);
        localStorage.setItem("voucher", JSON.stringify(savedVouchers));
  
        // Show success toast notification
        toast.success("Voucher code copied", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        // Show info toast if already saved
        toast.info("Voucher already saved!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } else {
      toast.error("Voucher not found!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  

  // Auto-slide effect every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev % voucherData.length) + 1);
    }, 3000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [voucherData.length]);
  

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

  const isAddedToCart = selectedProduct && selectedProduct._id 
  ? cartItems.some((item) => item?._id === selectedProduct?._id)
  : false;


  const handleCartClick = () => {
    if (!selectedProduct || !selectedProduct._id) {
      console.error("Invalid product data", selectedProduct);
      return;
    }
  
    if (!isAddedToCart) {
      dispatch(addToCart({ ...selectedProduct, quantity: 1 }));
  
      // Show success toast notification
      toast.success("Added to Cart!", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      // Show info toast if already added
      toast.info("Already in Cart", {
        position: "top-right",
        autoClose: 2000,
      });
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

  // const copyToClipboard = (code) => {
  //   navigator.clipboard.writeText(code);
  
  //   let savedVouchers = JSON.parse(localStorage.getItem("voucher")) || [];
  
  //   // Ensure savedVouchers is always an array
  //   if (!Array.isArray(savedVouchers)) {
  //     savedVouchers = [savedVouchers];
  //   }
  
  //   // Find the selected voucher
  //   const selectedVoucher = voucherData.find((v) => v.voucherCode === code);
  
  //   if (selectedVoucher) {
  //     // Avoid duplicate entries
  //     if (!savedVouchers.some((v) => v.voucherCode === code)) {
  //       savedVouchers.push(selectedVoucher);
  //       localStorage.setItem("voucher", JSON.stringify(savedVouchers));
  //     }
  //   }
  // };
  
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
  

    
  

    

  
    // const handleDotClick = (index) => {
    //   setActiveSlide(index);
    // };

  const saveRating = (rating) => {
    localStorage.setItem(`rating_${selectedProduct._id}`, rating);
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    saveRating(rating);
  };

  useEffect(() => {
    const updateWishlist = () => {
      const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(storedWishlist);
    };
  
    window.addEventListener("wishlistUpdated", updateWishlist);
  
    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlist);
    };
  }, []);
  
  
  // ✅ Load wishlist when the page loads
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);
  

  
  const handleWishlistToggle = async (product) => {
    if (!product || !product._id) {
      console.error("Invalid product data", product);
      return;
    }
  
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser ? storedUser.id : null;
  
    if (!userId) {
      alert("User not logged in");
      return;
    }
  
    try {
      const response = await fetch("https://api.atoutfashion.com/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product._id }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        let updatedWishlist;
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  
        if (storedWishlist.some((item) => item?.productId?._id === product._id)) {
          // Remove product from wishlist
          updatedWishlist = storedWishlist.filter((item) => item?.productId?._id !== product._id);
        } else {
          // Add product to wishlist
          updatedWishlist = [...storedWishlist, { productId: product }];
        }
  
        // ✅ Update localStorage and state
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);
  
        // ✅ Notify all pages to update wishlist
        window.dispatchEvent(new Event("wishlistUpdated"));
      } else {
        console.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };
  

  
  

  // const handleImageSelect = (image) => {
  //   console.log("Selected image:", image);
  // };

  // const handleModalOpen = () => {
  //   setIsModalOpen(true);
  // };

  // const handleModalClose = () => {
  //   setIsModalOpen(false);
  // };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...selectedProduct, quantity: 1 }));
    setCartVisible(true); // Show the cart after adding item
  };

  // const handleBuyNow = () => {
  //   navigate('/checkout', { state: { cartItems: [{ ...selectedProduct, quantity: 1 }] } });
  // };


  const handleBuyNow = () => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  
    if (!parsedUser || !parsedUser.id) {
     
      localStorage.setItem("redirectAfterLogin", "/checkout");
  
      alert("Please log in to proceed with the checkout.");
      navigate("/profile"); 
    } else {
      // If user is logged in, navigate directly to checkout
      navigate("/checkout", { state: { cartItems: [{ ...selectedProduct, quantity: 1 }] } });
    }
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
     
        marginTop: "8%",
        fontFamily:"'Poppins', sans-serif",
        overflow: "hidden",

      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
   
        <div style={{ flex: "1", textAlign: "center" }}>
     
      <div
        style={{
          position: "relative",
          height: "400px",
          marginBottom: "20px",
          overflow: "hidden",
          cursor: "zoom-in",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={selectedImage}
          alt={selectedProduct.category}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />

        {/* Zoom Effect */}
        {zoomPosition.show && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "-150px", // Adjust position
              width: "250px",
              height: "250px",
              border: "2px solid #ddd",
              overflow: "hidden",
              backgroundColor: "#fff",
              zIndex: 10,
              borderRadius: "10px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={selectedImage}
              alt="Zoomed View"
              style={{
                position: "absolute",
                top: `-${zoomPosition.y}%`,
                left: `-${zoomPosition.x}%`,
                width: "200%",
                height: "200%",
                objectFit: "cover",
              }}
            />
          </div>
        )}
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
              border: selectedImage === image ? "2px solid #FF5722" : "1px solid #ddd",
              borderRadius: "5px",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => handleImageSelect(image)}
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
    </div>


        {/* Right Section: Details */}
        <div style={{ flex: "2" }}>
        <div style={{ flex: "2" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Product Title */}
      <h1 style={{ fontSize: "18px", fontWeight: "bold" }}>
        {selectedProduct.category}
      </h1>

      {/* Icons: Wishlist & Share */}
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {/* Wishlist Icon */}
        {selectedProduct && selectedProduct._id ? (
       <FontAwesomeIcon
       icon={faHeart}
       style={{
         fontSize: "20px",
         color: wishlist.some((item) => item?.productId?._id === selectedProduct._id)
           ? "red"
           : "#D3D3D3",
         cursor: "pointer",
       }}
       onClick={(e) => {
         e.stopPropagation();
         handleWishlistToggle(selectedProduct);
       }}
     />
     
        
        ) : (
          <p style={{ fontSize: "14px", color: "red" }}>Product not available</p>
        )}

        {/* Share Icon */}
        <FontAwesomeIcon
          icon={faShareAlt}
          style={{
            fontSize: "20px",
            color: "#8B5635",
            cursor: "pointer",
          }}
          onClick={handleShare} // Trigger Share Functionality
        />
      </div>
    </div>
  </div>
  <h2
  style={{
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#795441",
  }}
>
  ₹{selectedProduct.price}
</h2>
<p style={{ fontSize: "12px" }}>(Inclusive of all taxes)</p>

{/* Reviews Section (Green Rating) */}
<div style={{ display: "flex", alignItems: "center", marginTop: "5px", gap: "5px" }}>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "5px 10px",
      borderRadius: "5px",
      fontSize: "14px",
      fontWeight: "bold",
    }}
  >
    <FontAwesomeIcon icon={faStar} style={{ marginRight: "5px" }} />
    4.2
  </div>
</div>

{/* Free Size Label */}
<div
  style={{
    marginTop: "5px",
    backgroundColor: "#EEE",
    color: "#333",
    padding: "5px 10px",
    borderRadius: "8px",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "bold",
  }}
>
  Free Delivery
</div>


  {/* Ratings Section */}
  {/* <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
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
  
        ({selectedRating} / 5)
      </span>
    </div> */}

<div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
  {/* Add to Cart Button */}
  <button
    onClick={handleCartClick}
    style={{
      padding: "4px 15px",
      width: "200px",
      height: "40px",
      backgroundColor: isAddedToCart ? "#4CAF50" : "#8B5635",
      color: "white",
      fontSize:'14px',
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    }}
  >
    <FontAwesomeIcon icon={faShoppingCart} />
    {isAddedToCart ? "Added" : "Add to Cart"}
  </button>

  {/* Buy Now Button */}
  <button
    onClick={handleBuyNowClick}
    style={{
      padding: "4px 15px",
      width: "200px",
      height: "40px",
      backgroundColor: "#ECA600",
      color: "black",
      border: "none",
      fontSize:'14px',
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    }}
  >
    <FontAwesomeIcon icon={faBolt} />
    Buy Now
  </button>

  {/* Toast Container (Required for Toastify) */}
  <ToastContainer />
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
        padding: "15px",
        textAlign: "center",
        borderRadius: "8px",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
        // maxWidth: "600px",
        margin: "auto",
        height: "auto",
        marginTop: "3%",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#444", marginBottom: "8px" }}>
        {voucherData[activeSlide - 1]?.title || "Best Offers"}
      </h3>
      <div
        style={{
          margin: "10px 0",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <p style={{ fontSize: "14px", color: "#222", margin: 0 }}>
          {voucherData[activeSlide - 1]?.desc || "Loading offers..."} -{" "}
          <strong style={{ color: "#d32f2f" }}>
            {voucherData[activeSlide - 1]?.discountPercentage || "N/A"}% Off
          </strong>
        </p>
        <span
          onClick={() => copyToClipboard(voucherData?.[activeSlide - 1]?.voucherCode, voucherData)}
          style={{
            border: "1px dashed #333",
            padding: "6px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#333",
            cursor: "pointer",
            backgroundColor: "#fff",
            transition: "all 0.3s ease",
          }}
        >
          {voucherData[activeSlide - 1]?.voucherCode || "N/A"}
        </span>
      </div>

      {/* Navigation Dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "8px",
        }}
      >
        {voucherData.map((_, index) => (
          <span
            key={index}
            onClick={() => handleDotClick(index + 1)}
            style={{
              height: "10px",
              width: "10px",
              margin: "0 4px",
              backgroundColor: activeSlide === index + 1 ? "#8B5635" : "#ccc",
              borderRadius: "50%",
              display: "inline-block",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          ></span>
        ))}
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>

<br/>
  {/* Collapsible Details Section */}
  <div
      style={{
        marginTop: "20px",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        width: "100%",
        // maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h5
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#444",
          textAlign: "center",
          marginBottom: "10px",
          borderBottom: "2px solid #eee",
          paddingBottom: "8px",
        }}
      >
        Product Details
      </h5>

      <p style={{ fontSize: "15px", color: "#666", textAlign: "center", marginBottom: "12px" }}>
        {selectedProduct.details ||
          "A beautifully handcrafted saree made from premium fabric, featuring intricate designs and vibrant colors that add a touch of elegance to any occasion."}
      </p>

      {/* Details Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          fontSize: "14px",
          color: "#333",
        }}
      >
         <div
          style={{
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <strong>Category:</strong> {selectedProduct.category }
        </div>
        <div
          style={{
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <strong>Width:</strong> {selectedProduct.width }
        </div>
        <div
          style={{
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <strong>Length:</strong> {selectedProduct.length || "6.5 meters"}
        </div>

        <div
          style={{
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <strong>Color:</strong> {selectedProduct.color || "Red and Gold"}
        </div>

        <div
          style={{
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <strong>Material:</strong> {selectedProduct.material || "Silk"}
        </div>

        <div
          style={{
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <strong>Delivery:</strong>
          <span style={{ color: "#FF5722", display: "flex", alignItems: "center", gap: "5px" }}>
            <FontAwesomeIcon icon={faShippingFast} />
            {selectedProduct.deliveryDate || "Expected delivery within 7-10 business days after purchase."}
          </span>
        </div>
      </div>
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
        fontSize:'14px'
      }}
      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
    >
      Description
      <span style={{ fontSize: "24px" }}>{isDescriptionExpanded ? "-" : "+"}</span>
    </h5>
    {isDescriptionExpanded && (
      
      <p style={{ marginTop: "10px", fontSize:'12px' }}>
        {/* A tribute to the erstwhile art of handweaving and handspinning, this handwoven cotton zari saree from our collection 'Atout by Supriya' will take you through your celebrations effortlessly with a subtle touch of glamour.

- An ethically crafted handwoven cotton zari saree in charming shades handdyed with festive hues.

- Suitable for day-long comfort, this saree is the perfect choice for celebrations with flawless elegance.

Being handwoven, the textile may have slight irregularities in the weaving work. These irregularities are the hallmark of all handmade products and make each artistic piece one-of-its-kind. */}
{selectedProduct.description || "Silk"}
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
        fontSize:'14px'
      }}
      onClick={() => setIsShipping(!isShipping)}
    >
      Shipping and Returns
      <span style={{ fontSize: "24px" }}>{isShipping ? "-" : "+"}</span>
    </h5>
    {isShipping && (
      <div style={{ marginTop: "10px", fontSize:'14px' }}>
        <p>- Free Shipping.</p>
        <p>- Your order will be shipped within 7 to 10 business days.</p>
        <p>- Once your order is shipped, we will email you the tracking details.</p>
        <p>- For exchange/return, kindly email us at <a href="mailto:hello@atoutbysupriya.com">hello@atoutbysupriya.com</a>, within 48 hours of receiving the order.</p>
        <p>- Shipping charges of Rs. 300 will be applicable for exchange/return.</p>
      </div>
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
        fontSize:'14px'
      }}
      onClick={() => setIsReviewOpen(!isReviewOpen)}
    >
 Customer Reviews
      <span style={{ fontSize: "24px" }}>{isReviewOpen ? "-" : "+"}</span>
    </h5>
   
        {isReviewOpen && (
          <div>
            {reviews.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {reviews.map((review, index) => (
                  <div key={index} className="review-item" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                    <h4 style={{fontSize:'14px'}}>{review.customerName}</h4>
                    <div className="review-stars" style={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          style={{ color: i < review.rating ? '#FFD700' : '#D3D3D3', marginRight: '5px' }}
                        />
                      ))}
                    </div>
                    <p style={{fontSize:'14px'}}>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}

          
          </div>
        )}
  </div>
</div>


      </div>

      {/* <div className="review-section" style={{ marginTop: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
        <h2 onClick={() => setIsReviewOpen(!isReviewOpen)} style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
          Customer Reviews {isReviewOpen ? "▲" : "▼"}
        </h2>
        {isReviewOpen && (
          <div>
            {reviews.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {reviews.map((review, index) => (
                  <div key={index} className="review-item" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                    <h4 style={{fontSize:'14px'}}>{review.customerName}</h4>
                    <div className="review-stars" style={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          style={{ color: i < review.rating ? '#FFD700' : '#D3D3D3', marginRight: '5px' }}
                        />
                      ))}
                    </div>
                    <p style={{fontSize:'14px'}}>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}

          
          </div>
        )}
      </div> */}

      <div className="row mt-4 text-center">
  <div className="col-12">
    <p className="fw-bold" style={{ fontSize: "20px" }}>You may also like</p>

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
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "white",
          padding: "10px 0",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          borderTop: "1px solid #ccc",
        }}
      >
        <button
          onClick={handleCartClick}
          style={{
            padding: "15px",
            backgroundColor: isAdded ? "#4CAF50" : "#8B5635", // Green after clicking
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            flex: 1,
            transition: "background-color 0.3s ease", // Smooth transition
          }}
        >
          {isAdded ? "Added" : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          style={{
            padding: "15px",
            backgroundColor: "#ECA600",
            color: "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            flex: 1,
          }}
        >
          Buy Now
        </button>
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

