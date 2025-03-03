import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { selectSelectedProduct } from "../redux/selectedProductSlice"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const userId = parsedUser ? parsedUser.id : null;

        if (!userId) {
          alert("User not logged in");
          return;
        }

        const response = await fetch(`https://api.atoutfashion.com/api/wishlist/${userId}`);
        const data = await response.json();

        if (response.ok) {
          const validWishlist = data.filter(item => item.productId && item.productId._id);
          setWishlist(validWishlist);
          const items = validWishlist.reduce((acc, item) => {
            acc[item.productId._id] = true;
            return acc;
          }, {});
          setWishlistItems(items);
        } else {
          alert("Error fetching wishlist:", data.message);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    const storedCart = localStorage.getItem("cart");
    setCart(storedCart ? JSON.parse(storedCart) : []);

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const userId = parsedUser ? parsedUser.id : null;

      if (!userId) {
        alert("User not logged in");
        return;
      }

      await fetch("https://api.atoutfashion.com/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, status: "inactive" }),
      });

      setWishlist(prevWishlist => prevWishlist.filter(item => item.productId._id !== productId));
      setWishlistItems(prevItems => {
        const updatedItems = { ...prevItems };
        delete updatedItems[productId];
        return updatedItems;
      });
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const dispatch = useDispatch(); // Import from redux
  const cartItems = useSelector(state => state.cart.items); // Get cart state
  
  const handleAddToCart = (item) => {
    const product = item.productId; // Extract actual product details
  
    if (!product) {
      console.error("Invalid product data:", item);
      return;
    }
  
    const cartItem = {
      _id: product._id,
      name: product.name,
      sku: product.sku,
      stock:product.stock,

      category: product.category,
      price: product.price,
      images: product.images && product.images.length > 0 
        ? [`https://api.atoutfashion.com/uploads/${product.images[0]}`] 
        : ["https://via.placeholder.com/220"], // Handle missing image
      quantity: product.quantity,
    };
  
    const updatedCart = [...cart, cartItem];
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  
    dispatch(addToCart(cartItem)); // Dispatch Redux action
  };
  
  
  

 
  
  const isItemInCart = (productId) => cart.some(item => item._id === productId);
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(storedCart);
    storedCart.forEach(item => dispatch(addToCart(item))); // Sync with Redux
  }, []);

  return (
    <div style={{ marginTop: "8%" }}>
    <h2 style={{textAlign:'center'}}>My Wishlist</h2>
    <div className="row">
      {wishlist.length > 0 ? (
        wishlist.map((item) => {
          const product = item.productId || {};
          const productId = product._id;
          const images = product.images || [];
          const name = product.name || "Product Name";
          const category = product.category || "Category";
          const price = product.price || "Price";
          const inCart = isItemInCart(productId);
  
          return (
            <div className="col-md-3 col-sm-6 col-12 mb-3" key={productId}>
              <div className="card shadow-sm" style={{ maxWidth: "230px", margin: "auto" }}>
                <img
                  src={images.length > 0 ? `https://api.atoutfashion.com/uploads/${images[0]}` : "https://via.placeholder.com/200"}
                  alt={name}
                  className="card-img-top"
                  style={{ height: "150px", objectFit: "cover", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
                />
                <div className="card-body p-2">
                  <h6 className="card-title text-truncate" style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {name}
                  </h6>
                  <p className="card-text mb-1" style={{ fontSize: "12px" }}>{category}</p>
                  <p className="card-text mb-1" style={{ fontSize: "12px" }}>₹{price}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveFromWishlist(productId)}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                    {!inCart ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>Your wishlist is empty!</p>
      )}
    </div>
  </div>
  
  );
};

export default WishlistPage;
