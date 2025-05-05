import React, { useState } from 'react';
import axios from 'axios';

const PhonePePayment = () => {
  const [amount, setAmount] = useState(100); 

  const handlePayment = async () => {
    try {
      const response = await axios.post('https://api.atoutfashion.com/api/payments/initiate', {
        merchantOrderId: `ORDER_${Date.now()}`,
        amount,
      
      });


      console.log('Response from server:', response.data);

      const redirectUrl = response.data?.redirectUrl; 
      if (redirectUrl) {
       
        window.location.href = redirectUrl;
      } else {
        alert("Payment initiation failed or missing redirect URL!");
      }

    } catch (error) {
      console.error('Payment initiation error:', error.response?.data || error);
      alert("An error occurred! Check console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4" style={{ marginTop: '20%' }}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border rounded p-2"
        placeholder="Enter Amount in Paise (min 100)"
      />
      <button
        onClick={handlePayment}
        className="bg-blue-500 px-4 py-2 rounded"
        style={{ color: 'black' }}
      >
        Pay with PhonePe
      </button>
    </div>
  );
};

export default PhonePePayment;