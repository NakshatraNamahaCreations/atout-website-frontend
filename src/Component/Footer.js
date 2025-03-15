import React from 'react';
import logo from '../Images/logo.svg'
import vectorimage2 from '../Images/Vector_image.png'

function Footer() {
  return (
    <>
    <div className="row mt-4 text-center">
    <div className="col-12">
      <img
        src={vectorimage2}
        alt="Vector Illustration"
        className="img-fluid"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  </div>
    <footer className="footer" style={{ backgroundColor: '#8B5635', color: '#fff', }}>
      
    <div className="container">
      <div className="row" >
        <div className="col-md-3" style={{marginTop:'1%'}}>
          <img src={logo} alt="Atout By Supriya" className="footer-logo" />
         
          <p className="footer-text">
          <span style={{fontFamily:'Satisfy', color:'#FF9393'}}>Atout By Supriya</span><br/>
            We craft timeless elegance, blending tradition with contemporary
            artistry to celebrate your unique style.
          </p>
        </div>
        <div className="col-md-3" style={{ marginTop: '1%' }}>
  <h4 className="footer-heading">Help</h4>
  <div>
    <a href="/shippingpolicy" style={{ display: 'block', color: 'white', textDecoration: 'none', marginBottom: '' }}>
      Shipping Policy
    </a>
    <a href="/returnpolicy" style={{ display: 'block', color: 'white', textDecoration: 'none', marginBottom: '' }}>
     Return/Refund Policy
    </a>
    {/* <a href="/refundpolicy" style={{ display: 'block', color: 'white', textDecoration: 'none' }}>
    Refund Policy
    </a> */}
    <a href="/termsandcondition" style={{ display: 'block', color: 'white', textDecoration: 'none' }}>
    Terms and Conditions
    </a>
    <a href="/privacypolicy" style={{ display: 'block', color: 'white', textDecoration: 'none' }}>
    Privacy Policy
    </a>
  </div>
</div>


<div className="col-md-3" style={{ marginTop: '1%' }}>
  <h4 className="footer-heading">Quick Links</h4>
  <div>
    <a href="/" style={{ display: 'block', color: 'white', textDecoration: 'none', marginBottom: '' }}>
      Home
    </a>
    <a href="/about-us" style={{ display: 'block', color: 'white', textDecoration: 'none', marginBottom: '' }}>
      About Us
    </a>
    <a href="/shop" style={{ display: 'block', color: 'white', textDecoration: 'none', marginBottom: '' }}>
      Shop
    </a>
    <a href="/contact-us" style={{ display: 'block', color: 'white', textDecoration: 'none', marginBottom: '' }}>
      Contact Us
    </a>
    {/* <a href="#" style={{ display: 'block', color: 'white', textDecoration: 'none', marginBottom: '10px' }}>
      Cart
    </a> */}
    <a href="/profile" style={{ display: 'block', color: 'white', textDecoration: 'none' }}>
      Profile
    </a>
  </div>
</div>

<div className="col-md-3" style={{ marginTop: '1%' }}>
  <h4 className="footer-heading">Connect With Us!</h4>
  <div>
    <a  style={{ display: 'block', color: 'white', textDecoration: 'none', marginBottom: '' }}>
      <i className="fas fa-envelope"></i> contact@atoutfashion.com
    </a>
    <a  style={{ display: 'block', color: 'white', textDecoration: 'none', marginBottom: '10px' }}>
      <i className="fas fa-mobile-alt"></i> +91 82962 68061
    </a>
  </div>
  <div style={{ marginTop: 'px', color: 'white', marginBottom:'10px' }}>
    <p style={{marginBottom:'1px'}}>Be the First to Know!</p>
    <p style={{fontFamily:'Satisfy', whiteSpace:'nowrap'}}>Subscribe to our Newsletter for latest updates</p>
    <div style={{ display: 'flex', marginTop: '10px' }}>
      <input 
        type="email" 
        placeholder="Enter your email" 
        style={{ padding: '10px', flex: 1, borderRadius: '5px', border: 'none', marginRight: '10px' }}
      />
      <button 
        style={{
          backgroundColor: '#fff', 
          color: '#8B5635', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '5px', 
          cursor: 'pointer'
        }}
      >
        Signup
      </button>
    </div>
  </div>
</div>
<br/>

      </div>
    </div>
    <br/>
    {/* <div className="footer-bottom">
      <p className="footer-text">© 2023 Atout By Supriya. All rights reserved.</p>
    </div> */}
  </footer>
  </>
  );
}

export default Footer;
