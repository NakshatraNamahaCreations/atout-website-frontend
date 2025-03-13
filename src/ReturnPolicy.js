import React from "react";


const ReturnPolicy = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "50vh", fontFamily: "'Poppins', sans-serif", marginTop: "7%", marginLeft: "5%" }}>
      
      <div className="container mt-5" style={{marginTop:'4%'}}>
        <h2 className="text-center mb-4">Return Policy</h2>
        <div className="policy-content border py-4 m-auto" style={{padding:'1%'}}>
          <p>
            We have a 2-day return/exchange policy, which means you have 2 days after receiving your item to request a return/exchange. Once the return/exchange is approved, it will be delivered in 7-10 business days.
          </p>
          <p>
            To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
          </p>
        </div>
      </div>
   
    </div>
  );
};

export default ReturnPolicy;
