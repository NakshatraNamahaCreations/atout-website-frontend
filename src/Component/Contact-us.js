// src/Component/ContactUs.js
import React, { useLayoutEffect } from "react";
import contactImage from "../Images/contactusimage.png"; // Update with the correct path to your image

const ContactUs = () => {

    useLayoutEffect(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, []);
  
  return (
    <div className="container overflow-hidden" style={{marginTop:'9%', overflowX:'hidden',   fontFamily:"'Poppins', sans-serif",}}>
      <div className="row">
        {/* First Column - Image */}
        <div className="col-md-6">
          <img
            src={contactImage}
            alt="Contact Us"
            className="img-fluid rounded"
            style={{ maxHeight: "329px", width: "348px", objectFit: "cover" }}
          />
        </div>

        {/* Second Column - Text */}
        <div className="col-md-6">
          <h2 className="text-dark mb-4">Hi People!</h2>
          <p>
          Have questions or need assistance? We’re here to help! Whether you’re looking
for the perfect saree for a special occasion or have inquiries about our collections,
feel free to reach out. Connect with us via phone or email and our team will get
back to you promptly.
          </p>
          <p>Let us help you weave elegance into your wardrobe!</p>
        
          <div>
  <h3>Contact Us</h3>
  <div>
    <a href="mailto:contact@atoutfashion.com" style={{ display: 'block', color: 'black', textDecoration: 'none', marginBottom: '10px' }}>
      <i className="fas fa-envelope"></i> contact@atoutfashion.com
    </a>
    <a href="tel:+1234567890" style={{ display: 'block', color: 'black', textDecoration: 'none', marginBottom: '10px' }}>
      <i className="fas fa-mobile-alt"></i> +91 82962 68061
    </a>
  </div>
</div>



        
          
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
