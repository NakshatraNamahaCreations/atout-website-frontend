import React, { useState, useEffect, useLayoutEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import chandrisaree from "../Images/Chanderi Sarees.png";
import { useLocation } from "react-router-dom";
import { store } from "react-notifications-component";
import kotasaree from "../Images/Kota.png";
import ReactSlider from "react-slider";
import { Offcanvas, Button } from "react-bootstrap";
import maheshwarisilksaree from "../Images/Maheshwari Silk.png";
import handblocksaree from "../Images/Hand Block Print Sarees.png";
import linensaree from "../Images/Linen Sarees.png";
import vectorimage2 from "../Images/Vector_image.png";
import { useDispatch } from "react-redux";
// import { useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { addToCart, removeFromCart } from "../redux/cartSlice";
import { setSelectedProduct } from "../redux/selectedProductSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




const categoryImages = {
  "chanderi cotton saree": chandrisaree,
  "kota saree": kotasaree,
  "maheshwari silk saree": maheshwarisilksaree,
  "mulmul saree": handblocksaree,
  "linen saree": linensaree,
};
console.log('categoryImages', categoryImages)

const ShopByCategory = ({
  cartVisible,
  setCartVisible,

  product,
  setCartItems,
}) => {
  const location = useLocation();

  const dispatch = useDispatch();
  const handleCloseCart = () => setCartVisible(false);
  const cartItems = useSelector((state) => state.cart.items);
  const [isInCart, setIsInCart] = useState(false);

  // localStorage.setItem("user", JSON.stringify({ id: "USER_ID_HERE" }));
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");

  const useData = localStorage.getItem("user");
  const parsedData = useData ? JSON.parse(useData) : null;

  console.log(parsedData, "parsedData");

  const [products, setProducts] = useState([]);
  // const [price, setPrice] = useState(8000);
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [cartStatus, setCartStatus] = useState({}); // Track cart status for each product
  const [wishlist, setWishlist] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [price, setPriceRange] = useState([0, 8000]);
  const [displayedProductCount, setDisplayedProductCount] = useState(0);

  // const handleAddToCart = (product) => {
  //   // Dispatch the action to update the global cart in Redux
  //   dispatch(addToCart(product));

  //   // Update local state for the specific product
  //   setCartStatus((prevStatus) => ({
  //     ...prevStatus,
  //     [product._id]: true, // Set the cart status for the specific product
  //   }));
  // };

  const handleAddToCart = (product) => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  
    if (!parsedUser || !parsedUser.id) {
      toast.error("Please log in to add items to your cart!", {
        position: "top-right",
        autoClose: 2000, // ✅ Auto-close after 2 seconds
        closeOnClick: true,
        draggable: true,
      });
      navigate("/profile"); // Redirect to login page
      return;
    }
  
    // Get existing cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
    // Check if the product is already in the cart
    const existingItem = cartItems.find((item) => item._id === product._id);
    if (existingItem) {
      cartItems = cartItems.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
  setTimeout(() => {
    toast.info("Product quantity increased in cart!", {
      position: "top-right",
      autoClose: 2000,
      closeOnClick: true,
      draggable: true,
    });
  }, 1000);
      
  
    } else {
      cartItems.push({ ...product, quantity: 1 });
  setTimeout(() => {
    toast.success("Added to Cart!", {
      position: "top-right",
      autoClose: 2000,
      closeOnClick: true,
      draggable: true,
    });
  }, 1000);
    
    }
  

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  
   
    setCartStatus((prevStatus) => ({
      ...prevStatus,
      [product._id]: true, 
    }));
  
    
    dispatch(addToCart(product));
  
   
    window.dispatchEvent(new Event("cartUpdated"));
  };
  
  

  useEffect(() => {
    const updateCartStatus = () => {
      const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const cartStatusMap = {};
      storedCart.forEach((item) => {
        cartStatusMap[item._id] = true;
      });
      setCartStatus(cartStatusMap);
    };
  
    // Listen for cart updates from other pages
    window.addEventListener("cartUpdated", updateCartStatus);
  
    // Load cart status on page load
    updateCartStatus();
  
    return () => {
      window.removeEventListener("cartUpdated", updateCartStatus);
    };
  }, []);
  

  




  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://api.atoutfashion.com/api/products", {
        params: {
          minPrice: price[0], // Corrected
          maxPrice: price[1], // Corrected
          color: color.trim() !== "" ? color : undefined,
          material: material.trim() !== "" ? material : undefined,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      let productsData = response.data.data || [];

      // Apply search filter
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        productsData = productsData.filter(
          (product) =>
            product.name.toLowerCase().includes(lowerCaseQuery) ||
            product.category.toLowerCase().includes(lowerCaseQuery)
        );
      }

      setProducts(productsData);
      setFilteredProducts(productsData);
      setDisplayedProductCount(productsData.length);
    } catch (error) {
      console.error("Error fetching products:", error.message || error);
    }
  };

  // Fetch products when search query, price, color, or material changes
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, price, color, material]);
  

  useEffect(() => {
    if (product && product._id) {
      const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const isProductInCart = cart.some((item) => item._id === product._id);
      setIsInCart(isProductInCart);
    }
  }, [product, cartItems]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  console.log("products", products);

  const navigate = useNavigate();

  const addToCartHandler = (saree) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === saree.id);
      if (itemExists) {
        return prevItems.map((item) =>
          item.id === saree.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prevItems, { ...saree, quantity: 1 }];
    });
  };


  const handleRangeChange = (newRange) => {
    setPriceRange(newRange);

    if (!Array.isArray(products) || products.length === 0) return; 


    const filteredByPrice = products.filter((saree) => {
      const priceValue = parseFloat(String(saree.price).replace(/[^0-9.-]+/g, ""));
      return !isNaN(priceValue) && priceValue >= newRange[0] && priceValue <= newRange[1];
    });

    setFilteredProducts(filteredByPrice);
  };
  
  

  const handleCartToggle = () => {
    setCartVisible(true); // Show off-canvas cart
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isClicked, setIsClicked] = useState(false);
  const [filteredSarees, setFilteredSarees] = useState(products);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const toggleCart = () => {
    console.log("Cart Visible:", !showCart);
    setShowCart(!showCart);
  };
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSaree, setSelectedSaree] = useState(null);

  const handleCheckboxChange = () => {
    setInStockOnly((prev) => {
      const newInStockOnly = !prev;
  
      let updatedProducts;
      if (newInStockOnly) {
        updatedProducts = products; 
      } else {
        updatedProducts = products.filter((product) => product.inStock); 
      }
  
      setFilteredProducts(updatedProducts);
      setDisplayedProductCount(updatedProducts.length); 
  
      return newInStockOnly;
    });
  };
  
  

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryClick = (category) => {
    console.log("category", category);
  
    const filteredProducts = products.filter(
      (productItem) => productItem.category_id === category
    );
  
    setFilteredProducts(filteredProducts);
    setDisplayedProductCount(filteredProducts.length); // ✅ Update displayed product count
  };
  
  // console.log("filteredProducts", filteredProducts);
  // console.log("selectedCategory", selectedCategory);

  const handleProductClick = (product) => {
    dispatch(setSelectedProduct(product));
    navigate("/description");
    
  };



  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleShowCart = (item) => {
    setCurrentItem(item);
    setShowCart(true);
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };


  
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // useEffect(() => {
  //   const updateWishlist = () => {
  //     const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  //     setWishlist(storedWishlist);
  //   };
  
  //   // Listen for wishlist updates
  //   window.addEventListener("wishlistUpdated", updateWishlist);
  
  //   return () => {
  //     window.removeEventListener("wishlistUpdated", updateWishlist);
  //   };
  // }, []);
  
  

  const handleWishlistToggle = async (product) => {
    if (!product || !product._id) {
      console.error("Invalid product data", product);
      return;
    }
  
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser ? storedUser.id : null;
  
    if (!userId) {
      toast.error("Please log in to manage your wishlist.", {
        position: "top-right",
        autoClose: 2000, 
        closeOnClick: true,
        draggable: true,
      });
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
        const isProductInWishlist = storedWishlist.some(
          (item) => item?.productId?._id === product._id
        );
  
        if (isProductInWishlist) {
        
          updatedWishlist = storedWishlist.filter(
            (item) => item?.productId?._id !== product._id
          );
  
        
          setTimeout(()=>{
            toast.info("Removed from Wishlist", {
              position: "top-right",
              autoClose: 2000,
              closeOnClick: true,
              draggable: true,
            });
          },1000)
       
        } else {
          // Add product to wishlist
          updatedWishlist = [...storedWishlist, { productId: product }];
  
          setTimeout(()=>{
          toast.success("Added to Wishlist", {
            position: "top-right",
            autoClose: 2000,
            closeOnClick: true,
            draggable: true,
          });
        },1000)
        }
  
        // ✅ Update localStorage and state
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);
  
        // ✅ Notify all pages to update wishlist
        window.dispatchEvent(new Event("wishlistUpdated"));
      } else {
        console.error(`Error: ${data.message}`);
        toast.error("Failed to update wishlist", {
          position: "top-right",
          autoClose: 2000, // ✅ Auto-close
          closeOnClick: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist", {
        position: "top-right",
        autoClose: 2000, // ✅ Auto-close
        closeOnClick: true,
        draggable: true,
      });
    }
  };
  
  
  
  
  // ✅ Listen for wishlist updates across pages
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
  
  
  
  
  



  const validWishlist = wishlist.filter((item) => item?.productId?._id);
  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://api.atoutfashion.com/api/categories");
      console.log("API Response Inside fetchCategories:", response.data); // Log API response
      setCategories(response.data || []); // Set categories in state
      console.log("Categories After setCategories:", response.data); // Log the new data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div style={{ marginTop: "8%" ,  fontFamily:"'Poppins', sans-serif", }}>
      <div className="container text-center">
        <h1 className="mb-4" style={{ fontSize: "24px" }}>
          Shop by Category
        </h1>
       
        <div className="row justify-content-center">
  {Categories.map((item) => {
    const formattedCategory = item.category.trim().toLowerCase(); // Normalize category name
    const imageSrc = categoryImages[formattedCategory] || chandrisaree; // Use default image if not found

    console.log("Category:", item.category, " | Formatted:", formattedCategory, " | Image Source:", imageSrc);

    return (
      <div
        key={item._id}
        className="col-6 col-sm-4 col-md-2 position-relative"
        onClick={() => handleCategoryClick(item._id)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={imageSrc}
          alt={item.category}
          className="img-fluid rounded-circle mb-3"
        />
        <div className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
          {item.category}
        </div>
      </div>
    );
  })}
</div>


        {/* <div className="row justify-content-center">
          {Categories.map((item) => (
        <div key={item._id}>
          <div
            className="col-6 col-sm-4 col-md-2 position-relative"
            onClick={() => handleCategoryClick(item._id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={chandrisaree}
              alt="Chandricotton Saree"
              className="img-fluid rounded-circle mb-3"
            />
            <div className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
             {item.category}
            </div>
          </div>
          <div
            className="col-6 col-sm-4 col-md-2 position-relative"
            onClick={() => handleCategoryClick(item._id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={kotasaree}
              alt="Kota Saree"
              className="img-fluid rounded-circle mb-3"
            />
            <div className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
             {item.category}
            </div>
          </div>
          <div
            className="col-6 col-sm-4 col-md-2 position-relative"
            onClick={() => handleCategoryClick(item._id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={maheshwarisilksaree}
              alt="Maheshwari Silk Saree"
              className="img-fluid rounded-circle mb-3"
            />
            <div className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
               {item.category}
            </div>
          </div>
          <div
            className="col-6 col-sm-4 col-md-2 position-relative"
            onClick={() =>handleCategoryClick(item._id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={handblocksaree}
              alt="Mulmul Saree"
              className="img-fluid rounded-circle mb-3"
            />
            <div className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
              {item.category}
            </div>
          </div>
          <div
            className="col-6 col-sm-4 col-md-2 position-relative"
            onClick={() => handleCategoryClick(item._id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={linensaree}
              alt="Linen Saree"
              className="img-fluid rounded-circle mb-3"
            />
            <div className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
              {item.category}
            </div>
          </div>

          </div>
           ))}
        </div> */}
      </div>
      <div className="col-12">
        <img
          src={vectorimage2}
          alt="Vector Illustration"
          className="img-fluid"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
      <div className="row mt-5">
        {/* Header Section */}
        <div className="col-md-12 d-flex justify-content-between align-items-center mb-4">
          <div style={{ marginLeft: "26%" }}>
            <h4>All Collections</h4>
            {/* <p>Showing {products.length} products</p> */}
            <p>Showing {displayedProductCount} products</p> 
          </div>
          <div className="d-flex align-items-center">
          <input
  type="checkbox"
  id="inStockCheckbox"
  width={100}
  className="me-2"
  checked={inStockOnly}
  onChange={handleCheckboxChange}
/>
<label htmlFor="inStockCheckbox" className="form-label me-3"style={{marginTop:'4%'}}>
  Show all products 
</label>

            {/* <FontAwesomeIcon
              icon={faSliders}
              style={{ fontSize: "20px", cursor: "pointer" }}
            /> */}
          </div>
        </div>

        <div className="row">
          {/* Filter Section */}
          <div className="col-md-3">
            <div className="filter-box border p-3" style={{marginLeft:'5%', borderRadius:'15px'}}>
              <h5>Filter By</h5>
              <div className="mb-4">
      <label className="block text-lg font-semibold mb-2">Price Range</label>

      {/* React Slider Component */}
      <ReactSlider
        className="custom-slider"
        thumbClassName="custom-thumb"
        trackClassName="custom-track"
        value={price}
        min={0}
        max={8000}
        step={1}
        onChange={handleRangeChange}
        renderTrack={(props, state) => (
          <div
            {...props}
            className={`custom-track ${state.index === 1 ? "selected-track" : ""}`}
          />
        )}
      />

      {/* Price Display */}
      <div className="flex justify-between text-sm mt-3">
        <span className="font-bold">₹{price[0]}</span>

        <span className="font-bold" style={{marginLeft:'65%'}}>₹{price[1]}</span>
      </div>

 
      <style>
        {`
          /* Main slider track */
          .custom-slider {
            width: 100%;
            height: 6px;
            background: #ddd; 
            border-radius: 5px;
            position: relative;
          }

          /* Default track (not selected) */
          .custom-track {
            height: 6px;
            border-radius: 5px;
          }

          /* Selected track (between two thumbs) */
          .selected-track {
            background: #8B5635 !important; 
          }

          /* Thumb (slider handle) */
          .custom-thumb {
            width: 20px;
            height: 20px;
            background-color: white;
            border: 3px solid #8B5635;
            border-radius: 50%;
            cursor: pointer;
            outline: none;
            transition: transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            top: 50%;
            transform: translateY(-50%);
          }

          .custom-thumb:hover {
            transform: scale(1.1) translateY(-50%);
          }
        `}
      </style>
    </div>

              <div className="mb-3">
      <label className="form-label">Color</label>
      <input
        type="text"
        className="form-control"
        placeholder="Enter Color (e.g., Red)"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </div>

    {/* Material Input Box */}
    <div className="mb-3">
      <label className="form-label">Material</label>
      <input
        type="text"
        className="form-control"
        placeholder="Enter Material (e.g., Cotton)"
        value={material}
        onChange={(e) => setMaterial(e.target.value)}
      />
    </div>

              {/* <div className="mb-3">
                <label className="form-label">Collection</label>
                <select className="form-select">
                  <option>New Arrivals</option>
                  <option>Popular</option>
                  <option>Discounted</option>
                </select>
              </div> */}
            </div>
          </div>

          {/* Products Section */}
          <div className="col-md-9">
            <div className="row justify-content-center">
              {currentItems.map((product) => {
                const isInCart = cartStatus[product._id] || false; 

                return (
                  <div
                    className="col-md-4 col-lg-3"
                    key={product._id}
                    style={{ marginTop: "2%" }}
                  >
                    <div
                      className="position-relative mx-2"
                      style={{
                        width: "100%",
                        height: "444px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleProductClick(product)} 
                    >
                      <img
                        src={product.images[0]}
                        alt={product.sku}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          addToCartHandler(product); 
                          handleCartToggle(); 
                          navigate("/description", { state: { product } }); 
                        }}
                      />
                      <div
                        className="position-absolute start-0 top-0 w-100 h-100"
                        style={{
                          background:
                            "linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%)",
                        }}
                      ></div>
                      <div
                        className="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-between align-items-center"
                        style={{ color: "white", fontSize: "14px" }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "16px",
                              marginBottom: "2px",
                              color: "#FFC8B0",
                            }}
                          >
                            {product.sku}
                          </div>
                          <div
                            style={{
                              fontSize: "16px",
                              marginBottom: "2px",
                              color: "#FFC8B0",
                            }}
                          >
                            {product.price}
                          </div>
                        </div>
                        <div>
                        <FontAwesomeIcon
  icon={faShoppingCart}
  style={{
    fontSize: "18px",
    color: cartStatus[product._id] ? "blue" : "white", // Blue if in cart
  }}
  onClick={(e) => {
    e.stopPropagation();
    handleAddToCart(product);
  }}
/>

                        </div>
                      </div>
                      <div
                        className="position-absolute top-0 end-0 m-2"
                        style={{ zIndex: 10 }}
                      >
                 {product && product._id && (
  <FontAwesomeIcon
    icon={faHeart}
    style={{
      fontSize: "20px",
      color: wishlist.some((item) => item?.productId?._id === product._id)
        ? "red"
        : "#D3D3D3",
    }}
    onClick={(e) => {
      e.stopPropagation();
      handleWishlistToggle(product);
    }}
  />
)}



                      </div>
                      <ToastContainer 
  position="top-right"
  autoClose={2000}  // ✅ Auto close after 2 seconds
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss={false}  // ✅ Prevent pause on focus loss
  draggable
  pauseOnHover={false}  // ✅ Prevent pause on hover
/>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-4">
  {[...Array(totalPages)].map((_, index) => (
    <button
      key={index}
      className={`btn mx-2 ${currentPage === index + 1 ? "active" : ""}`}
      onClick={() => setCurrentPage(index + 1)}
      style={{
        backgroundColor: currentPage === index + 1 ? "#522C1B" : "transparent",
        color: currentPage === index + 1 ? "white" : "#522C1B",
        border: "1px solid #522C1B",
        padding: "8px 12px",
        borderRadius: "5px",
        transition: "all 0.3s ease",
      }}
    >
      {index + 1}
    </button>
  ))}
</div>


           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
