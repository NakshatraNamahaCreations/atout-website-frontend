import React from "react";

const ShippingPolicy = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "50vh", fontFamily: "'Poppins', sans-serif", marginTop: "7%", marginLeft: "5%" }}>
      <div className="container mt-5" style={{ marginTop: '4%' }}>
        <h2 className="text-center mb-4" style={{fontSize:'20px', textAlign:'left', fontWeight:'bold'}}>Shipping Policy</h2>
        <div className="policy-content border py-4 m-auto" style={{ padding: '1%' }}>
          {/* <p>
            We use reliable third-party courier services to deliver our products. While we strive to ensure timely delivery, we do not guarantee delivery times and are not responsible for delays caused by the shipping provider or unforeseen circumstances.
          </p>
          <p>
            You will be notified of the estimated delivery timeline at the time of purchase. All the orders will be dispatched in 3-4 business days and will be delivered in 7-10 business days.
          </p> */}
          {/* <h4 style={{fontSize:'16px', textAlign:'left', fontWeight:'bold'}}>Shipping Information:</h4> */}
          <p><strong>Processing Time:</strong> Orders will be processed within 2 business days from the time of order confirmation. This includes order verification, quality check, packaging, and shipping.</p>
          <p><strong>Shipping Methods:</strong> We offer standard and expedited shipping. The shipping method will be selected at checkout.</p>
          <p><strong>Shipping Charges:</strong> Shipping charges will be calculated based on the delivery location and the size of the order. Any applicable charges will be displayed at checkout before you confirm your order.</p>
          <p><strong>Delivery Time:</strong> Delivery times depend on the shipping method chosen and the location of delivery. Typically, deliveries will take 5 to 7 business days for domestic orders.</p>
          <p><strong>International Shipping:</strong> We also ship internationally. International delivery timelines and charges will vary based on the destination country.</p>
          <p><strong>Non-Delivery Areas:</strong> In case the delivery address is in a non-serviceable area, we will notify you and provide a full refund if payment has already been made.</p>
          <p><strong>Order Tracking:</strong> Once your order is dispatched, we will send a tracking number to the email address provided. You can track the status of your shipment through the courier’s website.</p>
          <p><strong>Address Information:</strong> Please ensure that your shipping address is correct and complete. Any issues arising from incorrect or incomplete address information will not be our responsibility.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
