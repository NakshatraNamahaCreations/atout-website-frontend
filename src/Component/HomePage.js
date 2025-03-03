import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import image1 from '../Images/image1.jpg'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import axios from 'axios';
import Slider from "react-slick";
import image2 from '../Images/image2.jpg';
import image3 from '../Images/image3.jpg';
import ladyimage from '../Images/ladyimage.png' 
import artimage from '../Images/art image.png'
import vectorimage from '../Images/Vector.png'
import museumimage from '../Images/museumimage.png'
import imagebackground from '../Images/image-bandground.png'
import { Link } from 'react-router-dom';





const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [sarees, setSarees] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);

  useEffect(() => {
    fetchSoldProducts();
  }, []);

  const fetchSoldProducts = async () => {
    try {
      const response = await axios.get("https://api.atoutfashion.com/api/sold-products");
      if (response.data.success) {
        setSoldProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sold products:", error);
    }
  };


  useEffect(() => {
    fetchSarees();
  }, []);

  const fetchSarees = async () => {
    try {
      const response = await axios.get("https://api.atoutfashion.com/api/last-four-maheshwari");
      if (response.data.success) {
        setSarees(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sarees:", error);
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);  
  }
  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const settings = {
 
    infinite: true, 
    speed: 500, 
    slidesToShow: 4, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 2000, 
  };

  return (
    <div style={{overflow:'hidden'}}>
    <div className="container-fluid">
      <Carousel
        activeIndex={activeIndex}
        onSelect={handleSelect}
        interval={2000} 
        controls={false} 
        indicators={false} 
      >
       <Carousel.Item>
  <div className="carousel-image-container position-relative">
    <img
      className="d-block w-100 banner-image"
      src={image1}
      alt="First slide"
      style={{ height: '400px' }}
    />
   <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-50"></div>
    <div className="carousel-text position-absolute top-50 start-50 translate-middle text-white text-center">
      <h2>Colors, Comfort, and Culture</h2>
      <p>Discover the artistry of handcrafted saree that celebrate you</p>
    </div>
  </div>
</Carousel.Item>

        <Carousel.Item>
  <div className="carousel-image-container position-relative">
    <img
      className="d-block w-100 banner-image"
      src={image2}
      alt="Second slide"
      style={{ height: '400px' }}
    />
    <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-50"></div>
    <div className="carousel-text position-absolute top-50 start-50 translate-middle text-white text-center">
    <h2>Threads of Culture and Comfort</h2>
    <p>Adore yourself with saree that blend heritage and style</p>
    </div>
  </div>
</Carousel.Item>

        <Carousel.Item>
          <div className="carousel-image-container">
            <img
              className="d-block w-100 banner-image"
              src={image3}
              alt="Third slide"
              style={{ height: '400px' }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-50"></div>
            <div className="carousel-text position-absolute top-50 start-50 translate-middle text-white text-center">
              <h2>A Tradition That Never Fades </h2>
              <p>Celebrate life's moments in sarees woven with love</p>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>

      <div className="d-flex justify-content-center mt-2">
        <span
          className={`dot ${activeIndex === 0 ? 'active' : ''}`}
          onClick={() => setActiveIndex(0)}
        ></span>
        <span
          className={`dot ${activeIndex === 1 ? 'active' : ''}`}
          onClick={() => setActiveIndex(1)}
        ></span>
        <span
          className={`dot ${activeIndex === 2 ? 'active' : ''}`}
          onClick={() => setActiveIndex(2)}
        ></span>
      </div>

  </div>

  <div className="row mt-2">
  {/* 1st Column - Image */}
  <div className="col-md-6">
    <div className="position-relative" style={{ width: '338px', height: '447px' }}>
      <img
        src={ladyimage}
        alt="Main Image"
        className="img-fluid"
        style={{ width: '338px', height: '447px' }}
      />
      <img
        src={artimage}
        alt="Overlay Image"
        className="position-absolute"
        style={{
          width: '420px', // Adjust the size of the overlay image
          height: '273px',
          bottom: '-22px', // Adjust the bottom position
          right: '-214px', // Adjust the right position
        }}
      />
    </div>
  </div>

  {/* 2nd Column - Text */}
  <div className="col-md-6" style={{ marginTop: '7%' }}>
    <h3>Little Bit About Us</h3>
    <p>
      <span style={{ color: 'red', fontFamily: 'Satisfy', fontSize: '18px' }}>
        Atout by Supriya
      </span>{" "}
      Is a Clothing Brand Believes in quality and potentiality Exhibiting the fine artistry of
      prints Embracing the love for cotton fabric. With a passion for timeless elegance, we
      showcases the essence of handpicked fabrics and intricate craftsmanship. Celebrating the
      beauty of tradition, each piece is designed to reflect comfort, style, and sustainability.
      From vibrant prints to soothing textures, the collection embodies the perfect harmony of
      heritage and contemporary fashion, ensuring every drape tells a unique story.
    </p>
  </div>
</div>

{/* Vector Image Below the Two Columns */}
<div className="row mt-4 text-center">
  <div className="col-12">
    <img
      src={vectorimage}
      alt="Vector Illustration"
      className="img-fluid"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  </div>
</div>

{/* New Arrival Section */}
<div className="row mt-4 text-center">
      <div className="col-12">
        {/* Centered Text */}
        <h2 className="fw-bold">New Arrival</h2>
        <h3 className="text-muted" style={{ color: "#007BFF" }}>Maheshwari Silk Sarees</h3>

        {/* Saree Images */}

        <div className="d-flex justify-content-center align-items-center mt-3">
  {sarees.map((saree, index) => (
    <Link key={saree._id} to={`/product/${saree._id}`} state={{ product: saree }} style={{ textDecoration: "none" }}>
      <div
        className="position-relative mx-2"
        style={{ width: "300px", height: "444px", cursor: "pointer" }}
      >
        <img
          src={saree.images[0]} // First image from the array
          alt={saree.name}
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
          <div style={{ fontSize: "16px", marginBottom: "2px" }}>{saree.name}</div>
          <div style={{ fontSize: "16px", marginBottom: "2px", color: "#FFC8B0" }}>
            Rs. {saree.price} + shipping
          </div>
        </div>
      </div>
    </Link>
  ))}
</div>

      </div>
    </div>


<br/>

<div className="position-relative" style={{ width: '100%', height: '280px' }}>
  {/* Image with <img> tag */}
  <img
    src={museumimage} // Path to your image
    alt="Museum Image"
    className="img-fluid"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  />

  {/* Black Transparent Overlay */}
  <div
    className="position-absolute top-0 start-0 w-100 h-100"
    style={{
      background: 'rgba(0, 0, 0, 0.4)', // Black transparent overlay
    }}
  ></div>

  {/* Text on top of the image */}
  <div
    className="position-absolute top-50 start-50 translate-middle text-center text-white"
    style={{
      fontSize: '24px',
      fontWeight: 'bold',
    }}
  >
    <p>Exclusive Collection</p>
    <Link to="/shop" className="btn btn-primary">Shop Now</Link>


  </div>
</div>

<div className="row mt-4 text-center">
      <div className="col-12">
        {/* Centered Text */}
        <h2 className="fw-bold">Best Selling Products</h2>
        <h3 className="text-muted" style={{ color: "#007BFF" }}>Most Popular Sarees</h3>

        {/* Swiper Slider */}
        <Swiper
  modules={[Navigation, Pagination, Autoplay]}
  slidesPerView={4} 
  spaceBetween={20}
  navigation
  pagination={{ clickable: true }}
  autoplay={{ delay: 2500, disableOnInteraction: false }}
  loop={true}
  breakpoints={{
    320: { slidesPerView: 1 },  
    768: { slidesPerView: 2 },  
    1024: { slidesPerView: 3 }, 
    1280: { slidesPerView: 4 },
  }}
>
  {soldProducts.map((product) => (
    <SwiperSlide key={product._id}>
      <Link to={`/product/${product._id}`} state={{ product }}>
        <div
          className="position-relative mx-2"
          style={{ width: "300px", height: "444px", cursor: "pointer" }}
        >
          <img
            src={product.images[0]} 
            alt={product.name}
            className="img-fluid"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
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
            <div style={{ fontSize: "16px", marginBottom: "2px" }}>{product.name}</div>
            <div style={{ fontSize: "16px", marginBottom: "2px", color: "#FFC8B0" }}>
              Rs. {product.price} + shipping
            </div>
          </div>
        </div>
      </Link>
    </SwiperSlide>
      ))}
</Swiper>
      </div>
    </div>





   
    </div>
  );
};

export default HomePage;
