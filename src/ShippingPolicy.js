import React from "react";


const ShippingPolicy = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "50vh", fontFamily: "'Poppins', sans-serif", marginTop: "7%", marginLeft: "5%" }}>
     
      <div className="container mt-5" style={{marginTop:'4%'}}>
        <h2 className="text-center mb-4">Shipping Policy</h2>
        <div className="policy-content border py-4 m-auto" style={{padding:'1%'}}>
          <p>
            We use reliable third-party courier services to deliver our products. While we strive to ensure timely delivery, we do not guarantee delivery times and are not responsible for delays caused by the shipping provider or unforeseen circumstances.
          </p>
          <p>
            You will be notified of the estimated delivery timeline at the time of purchase. All the orders will be dispatched in 3-4 business days and will be delivered in 7-10 business days.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ShippingPolicy;
