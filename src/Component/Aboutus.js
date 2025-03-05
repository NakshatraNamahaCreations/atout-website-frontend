import React, { useLayoutEffect } from "react";
import aboutimage from "../Images/aboutus.png"; // Adjust the path to your image

function AboutUs() {

    useLayoutEffect(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, []);
  
  return (
    <div className="container" style={{ marginTop: '120px',   fontFamily:"'Poppins', sans-serif", }}>
      <div className="row">
        {/* First Column: Text */}
        <div className="col-md-6">
          <h2 className="about-us-heading">Our Story</h2>
          <p>
          <span style={{ fontFamily: 'Dancing Script, cursive', color: '#B21B00' }}>
  Atout by Supriya
</span>  is a brand born out of a passion for celebrating the timeless beauty
of hand block printed sarees. Every piece in our collection reflects an unyielding
dedication to preserving the traditional art of block printing while embracing the
versatility of modern design. With a focus on quality and craftsmanship, we take
pride in offering sarees that are as elegant as they are unique. 
          </p>
          <p>
          We believe that every saree tells a story - of the skilled artisans who bring their
craft to life, of the intricate patterns that hold a piece of heritage, and of the
individuals who wear them with grace and pride. Each drape is a blend of artistry
and comfort, designed to resonate with those who cherish tradition and individuality.
          </p>

          <p>
          We are committed to promoting sustainable and ethical fashion by supporting
handloom artisans and eco-friendly practices. Our sarees are a celebration of slow
fashion, ensuring that every fabric is crafted with care and intention. Whether
for a festive occasion or everyday elegance, we strive to deliver timeless
creations that reflect your love for tradition and quality.
          </p>
        </div>

        {/* Second Column: Image */}
        <div className="col-md-6">
          <img
            src={aboutimage}
            alt="About Us"
            className="img-fluid"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
