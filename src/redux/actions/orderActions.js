import { createAsyncThunk } from '@reduxjs/toolkit';

// Async action to create an order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.atoutfashion.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error creating order');
      }
      return data; // Success response
    } catch (error) {
      return rejectWithValue(error.message); // Error response
    }
  }
);
