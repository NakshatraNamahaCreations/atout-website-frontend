import React from "react";

const TermsAndConditions = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "50vh", fontFamily: "'Poppins', sans-serif", marginTop: "7%", marginLeft: "5%" }}>
      <div className="container mt-5" style={{ marginTop: '4%' }}>
        <h2 className="text-center mb-4" style={{fontSize:'20px', textAlign:'left', fontWeight:'bold'}}>Terms and Conditions</h2>
        <div className="terms-content border py-4 m-auto" style={{ padding: '1%' }}>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>Introduction:</h4>
          <p>
            By using our website or placing an order, you agree to comply with these Terms & Conditions, which govern your use of our online store and the purchase of products.
          </p>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>User Agreement:</h4>
          <p>
            By accessing our website, you agree to the following terms. If you do not agree with these terms, please refrain from using our website.
          </p>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>Product Information and Pricing:</h4>
          <p>
            All products available for sale are as described on our website. However, we cannot guarantee that the description is 100% accurate.
          </p>
          <p>
            Prices of products are listed in INR (Indian Rupees), and all applicable taxes are included in the final price.
          </p>
          <p>
            We reserve the right to change product prices at any time without prior notice. However, the prices of products purchased will remain unchanged after order confirmation.
          </p>
          <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>Payment:</h4>
          <p>
            We accept various payment methods, including credit/debit cards, UPI, and bank transfers.
          </p>
          <p>
            All payments must be made in full before the order is processed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;