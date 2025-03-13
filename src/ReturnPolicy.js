import React from "react";


const ReturnPolicy = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "50vh", fontFamily: "'Poppins', sans-serif", marginTop: "7%", marginLeft: "5%" }}>
      
      <div className="container mt-5" style={{marginTop:'4%'}}>
        <h2 className="text-center mb-4" style={{fontSize:'20px', textAlign:'left', fontWeight:'bold'}}>Return Policy</h2>
        <div className="policy-content border py-4 m-auto" style={{padding:'1%'}}>
          <p>
            We have a 2-day return/exchange policy, which means you have 2 days after receiving your item to request a return/exchange. Once the return/exchange is approved, it will be delivered in 7-10 business days.
          </p>
          <p>
            To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
          </p>

          <div className="container mt-5" style={{marginTop:'4%'}}>
        <h2 className="text-center mb-4" style={{fontSize:'20px', textAlign:'left', fontWeight:'bold'}}>Refund Policy</h2>
        <div className="policy-content  py-4 m-auto" style={{padding:'1%'}}>
          <p>
            We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, the refund will be credited to the original payment method within 7-10 business days.
          </p>
          <p>
            Please remember it can take some time for your bank or credit card company to process and post the refund too. If more than 15 business days have passed since we’ve approved your return, please contact us.
          </p>
        </div>
      </div>
        </div>
      </div>
   
    </div>
  );
};

export default ReturnPolicy;
