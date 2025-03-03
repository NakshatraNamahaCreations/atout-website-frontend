import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate  } from "react-router-dom"; 
import logo from "../Images/logo.svg";
import CartOffcanvas from './CartOffcanvas';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [cartVisible, setCartVisible] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const location = useLocation(); 
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLinkClick = (link) => { 
    setActiveLink(link); 
    setMobileMenuOpen(false); // Close mobile menu after clicking a link
  };


  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm w-100" style={{ position: "fixed", top: 0, left: 0, zIndex: 1030, height:'17%' }}>
      <div className="container-fluid py-3">
        <div className="row align-items-center">
          <div className="col-auto">
            <Link to="/">
              <img src={logo} alt="Logo" className="rounded-circle" style={{ height: "60px", width: "60px" }} />
            </Link>
          </div>

          <div className="col">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search"
                className="form-control rounded-pill"
                style={{ maxWidth: "300px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <Link to="/profile"><button className="btn btn-link text-dark p-2"><i className="fas fa-user"></i></button></Link>
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
  );
};

export default Header;
