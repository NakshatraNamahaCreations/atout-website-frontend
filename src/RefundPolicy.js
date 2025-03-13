import React from "react";


const RefundPolicy = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "50vh", fontFamily: "'Poppins', sans-serif", marginTop: "7%", marginLeft: "5%" }}>
      
      <div className="container mt-5" style={{marginTop:'4%'}}>
        <h2 className="text-center mb-4">Refund Policy</h2>
        <div className="policy-content border py-4 m-auto" style={{padding:'1%'}}>
          <p>
            We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, the refund will be credited to the original payment method within 7-10 business days.
          </p>
          <p>
            Please remember it can take some time for your bank or credit card company to process and post the refund too. If more than 15 business days have passed since we’ve approved your return, please contact us.
          </p>
        </div>
      </div>

    </div>
  );
};

export default RefundPolicy;
