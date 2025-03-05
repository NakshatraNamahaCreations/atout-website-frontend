import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate  } from "react-router-dom"; 
import logo from "../Images/logo.svg";
import { FaSearch } from "react-icons/fa";
import CartOffcanvas from './CartOffcanvas';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBars, faTimes, faSearch, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [cartVisible, setCartVisible] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const location = useLocation(); 
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLinkClick = (link) => { 
    setActiveLink(link); 
    setMobileMenuOpen(false); 
  };
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown on click
  };

  const handleNavigateProfile = () => {
    navigate("/profile");
    setDropdownOpen(false); // Close dropdown after navigation
  };

  const handleNavigate = (path) => {
    navigate(path);
    setDropdownOpen(false); // Close the dropdown
  };

  useEffect(() => {
    if (!location.pathname.startsWith("/shop")) {
      setSearchTerm(""); // Clear the input only when navigating away from shop page
    }
  }, [location.pathname]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <header className=" shadow-sm w-100" style={{ position: "fixed", top: 0, left: 0, zIndex: 1030, height:'', backgroundColor: "white" }}>
      <div className="container-fluid ">
        <div className="row align-items-center">
          <div className="col-auto">
            <Link to="/">
              <img src={logo} alt="Logo" className="rounded-circle" style={{ height: "80px", width: "80px" }} />
            </Link>
          </div>

          <div className="col">
            <form onSubmit={handleSearch} className="position-relative" style={{marginLeft:"15%"}}>
              <input
                type="text"
                placeholder="Search"
                className="form-control rounded-pill"
                style={{ maxWidth: "450px" , paddingLeft:'30px'}}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
             <FaSearch
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#999",
                  cursor: "pointer",
                }}
              />
            </form>
            
          </div>

          <div className="col-auto d-none d-md-block">
            <nav>
              <ul className="nav">
                <li className="nav-item"><Link to="/" className={`nav-link ${activeLink === "/" ? "text-warning fw-bold" : "text-dark"}`} onClick={() => handleLinkClick("/")}>Home</Link></li>
                <li className="nav-item"><Link to="/about-us" className={`nav-link ${activeLink === "/about-us" ? "text-warning fw-bold" : "text-dark"}`} onClick={() => handleLinkClick("/about-us")}>About Us</Link></li>
                <li className="nav-item"><Link to="/shop" className={`nav-link ${activeLink === "/shop" ? "text-warning fw-bold" : "text-dark"}`} onClick={() => handleLinkClick("/shop")}>Shop</Link></li>
                <li className="nav-item"><Link to="/contact-us" className={`nav-link ${activeLink === "/contact-us" ? "text-warning fw-bold" : "text-dark"}`} onClick={() => handleLinkClick("/contact-us")}>Contact Us</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col-auto d-flex align-items-center">
            <button className="btn btn-link text-dark p-2 position-relative" onClick={() => setCartVisible(true)}>
              <i className="fas fa-shopping-cart" style={{ fontSize: "24px" }}></i>
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle" style={{ borderRadius: "50%", fontSize: "12px", width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>{cartItems.length}</span>
            </button>
            <CartOffcanvas cartVisible={cartVisible} handleCartToggle={() => setCartVisible(false)} />
            {/* <Link to="/profile"><button className="btn btn-link text-dark p-2"><i className="fas fa-user"></i></button></Link> */}
            <div className="position-relative">
        <button className="btn btn-link text-dark p-2" onClick={handleProfileClick}>
          <FontAwesomeIcon icon={faUser} size="lg" />
        </button>

        {/* Dropdown Menu (Hides when navigating) */}
        {dropdownOpen && (
          <div
            className="dropdown-menu show"
            style={{
              position: "absolute",
              right: 0,
              minWidth: "200px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "white",
              zIndex: 1050,
            }}
          >
            {user ? (
              <>
                <div className="dropdown-item-text fw-bold">Hi, {user.username}</div>
                <button className="dropdown-item" onClick={() => handleNavigate("/profile")}>Your Account</button>
                <button className="dropdown-item" onClick={() => handleNavigate("/wishlist")}>Wishlist</button>
                <button className="dropdown-item" onClick={() => handleNavigate("/orders")}>Your Orders</button>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
                  Logout
                </button>
              </>
            ) : (
              <button className="dropdown-item" onClick={() => handleNavigate("/profile")}>Login / Register</button>
            )}
          </div>
        )}
      </div>
            <Link to="/wishlist"><button className="btn btn-link text-dark p-2"><FontAwesomeIcon icon={faHeart} style={{ fontSize: "18px", color: "#000000" }} /></button></Link>
            <button className="btn btn-link text-dark p-2 d-md-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} style={{ fontSize: "24px" }} />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu bg-white p-3 position-absolute w-100" style={{ top: "100%", left: 0, zIndex: 1031, boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
          <nav>
            <ul className="nav flex-column">
              <li className="nav-item"><Link to="/" className="nav-link text-dark" onClick={() => handleLinkClick("/")}>Home</Link></li>
              <li className="nav-item"><Link to="/about-us" className="nav-link text-dark" onClick={() => handleLinkClick("/about-us")}>About Us</Link></li>
              <li className="nav-item"><Link to="/shop" className="nav-link text-dark" onClick={() => handleLinkClick("/shop")}>Shop</Link></li>
              <li className="nav-item"><Link to="/contact-us" className="nav-link text-dark" onClick={() => handleLinkClick("/contact-us")}>Contact Us</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
//     <header className="shadow-sm w-100" style={{ position: "fixed", top: 0, left: 0, zIndex: 1030, height: "auto", backgroundColor: "#CC8F69" }}>

//   <div className="container-fluid ">
//     <div className="row align-items-center justify-content-between">
      
//       {/* Left Side - Mobile Menu & Search */}
//       <div className="col-auto d-md-none">
//         <button className="btn btn-link text-dark p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//           <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} style={{ fontSize: "24px" }} />
//         </button>
//       </div>

//       {/* Center - Search Bar */}
//       <div className="col-md-4 col-6">
//         <form onSubmit={handleSearch} className="position-relative">
//           <input
//             type="text"
//             placeholder="Search"
//             className="form-control rounded-pill"
//             style={{ maxWidth: "300px", paddingLeft: "30px", color:'black' }}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <FaSearch
//             style={{
//               position: "absolute",
//               left: "10px",
//               top: "50%",
//               transform: "translateY(-50%)",
//               color: "#999",
//               cursor: "pointer",
//             }}
//           />
//         </form>
//       </div>

//       {/* Center - Logo */}
//       <div className="col-md-2 col-6 text-center">
//         <Link to="/" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
//           <img src={logo} alt="Logo" className="rounded-circle" style={{ height: "80px", width: "80px", left: "50%" }} />
//         </Link>
//       </div>

//       {/* Right Side - Navigation, Cart, Profile, Wishlist */}
//       <div className="col-md-4 d-none d-md-flex justify-content-end align-items-center">
//         <nav>
//           <ul className="nav">
//             <li className="nav-item"><Link to="/" className={`nav-link ${activeLink === "/" ? "text-warning fw-bold" : "text-white"}`} onClick={() => handleLinkClick("/")}>Home</Link></li>
//             <li className="nav-item"><Link to="/about-us" className={`nav-link ${activeLink === "/about-us" ? "text-warning fw-bold" : "text-white"}`} onClick={() => handleLinkClick("/about-us")}>About Us</Link></li>
//             <li className="nav-item"><Link to="/shop" className={`nav-link ${activeLink === "/shop" ? "text-warning fw-bold" : "text-white"}`} onClick={() => handleLinkClick("/shop")}>Shop</Link></li>
//             <li className="nav-item"><Link to="/contact-us" className={`nav-link ${activeLink === "/contact-us" ? "text-warning fw-bold" : "text-white"}`} onClick={() => handleLinkClick("/contact-us")}>Contact Us</Link></li>
//           </ul>
//         </nav>
//       </div>

//       {/* Icons - Cart, Profile, Wishlist */}
//       <div className="col-auto d-flex align-items-center">
//         <button className="btn btn-link text-white p-2 position-relative" onClick={() => setCartVisible(true)}>
//           <i className="fas fa-shopping-cart" style={{ fontSize: "24px" }}></i>
//           <span className="badge bg-danger position-absolute top-0 start-100 translate-middle" style={{ borderRadius: "50%", fontSize: "12px", width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>{cartItems.length}</span>
//         </button>
//         <CartOffcanvas cartVisible={cartVisible} handleCartToggle={() => setCartVisible(false)} />
//         <Link to="/profile"><button className="btn btn-link text-white p-2"><i className="fas fa-user"></i></button></Link>
//         <Link to="/wishlist"><button className="btn btn-link text-white p-2"><FontAwesomeIcon icon={faHeart} style={{ fontSize: "18px", color: "" }} /></button></Link>
//       </div>

//     </div>
//   </div>

//   {/* Mobile Navigation Menu */}
//   {mobileMenuOpen && (
//     <div className="mobile-menu bg-white p-3 position-absolute w-100" style={{ top: "100%", left: 0, zIndex: 1031, boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
//       <nav>
//         <ul className="nav flex-column">
//           <li className="nav-item"><Link to="/" className="nav-link text-dark" onClick={() => handleLinkClick("/")}>Home</Link></li>
//           <li className="nav-item"><Link to="/about-us" className="nav-link text-dark" onClick={() => handleLinkClick("/about-us")}>About Us</Link></li>
//           <li className="nav-item"><Link to="/shop" className="nav-link text-dark" onClick={() => handleLinkClick("/shop")}>Shop</Link></li>
//           <li className="nav-item"><Link to="/contact-us" className="nav-link text-dark" onClick={() => handleLinkClick("/contact-us")}>Contact Us</Link></li>
//         </ul>
//       </nav>
//     </div>
//   )}
// </header>

  );
};

export default Header;
