import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "50vh", fontFamily: "'Poppins', sans-serif", marginTop: "7%", marginLeft: "5%" }}>
      <div className="container mt-5" style={{ marginTop: '4%' }}>
        <h2 className="text-center mb-4">Privacy Policy</h2>
        <div className="privacy-content border py-4 m-auto" style={{ padding: '1%' }}>
          <h4 style={{fontSize:'18px', textAlign:'left', fontWeight:'bold'}}>Introduction:</h4>
          <p>
            We value the privacy of our customers and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your data in compliance with Indian data protection laws.
          </p>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>Information We Collect:</h4>
          <p><strong>Personal Information:</strong> When you place an order, we collect personal information such as your name, address, phone number, email address, and payment details.</p>
          <p><strong>Usage Information:</strong> We may collect information about how you interact with our website, such as your IP address, browsing history, and device information.</p>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>How We Use Your Information:</h4>
          <ul>
            <li>To process and fulfill your orders.</li>
            <li>To communicate with you regarding your order or any customer service inquiries.</li>
            <li>To improve our website and services.</li>
            <li>For marketing purposes, such as sending promotional emails (only if you have opted-in).</li>
          </ul>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>Data Security:</h4>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, or disclosure. However, please note that no method of data transmission over the internet is 100% secure.
          </p>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>Sharing Your Information:</h4>
          <p>
            We do not sell, rent, or share your personal information with third parties, except as necessary to fulfill your orders (e.g., third-party payment processors, delivery companies).
          </p>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>Cookies:</h4>
          <p>
            We use cookies to enhance your browsing experience. Cookies help us personalize content and remember your preferences. You can disable cookies through your browser settings, but this may affect your ability to use certain features of our website.
          </p>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>Your Rights:</h4>
          <ul>
            <li>Access and update your personal information.</li>
            <li>Request deletion of your personal data.</li>
            <li>Opt-out of marketing communications.</li>
          </ul>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>Changes to Privacy Policy:</h4>
          <p>
            We may update our Privacy Policy from time to time. Any changes will be posted on this page, and we will notify you of any significant changes.
          </p>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>Contact Us:</h4>
          <p>
            If you have any questions or concerns regarding our Privacy Policy, please contact us at Atoutby Supriya <a href="mailto:atoutbysupriya@gmail.com">atoutbysupriya@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
