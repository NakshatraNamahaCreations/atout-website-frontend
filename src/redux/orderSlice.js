import { createSlice } from '@reduxjs/toolkit';
import { createOrder } from '../redux/actions/orderActions';

// Initial state for order
const initialState = {
  order: null,
  loading: false,
  error: null,
};

// Creating the orderSlice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {}, // No additional reducers for now
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true; // Set loading to true while the order is being created
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false once order creation is complete
        state.order = action.payload; // Save the created order in the state
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false; // Set loading to false when an error occurs
        state.error = action.payload; // Store the error message from rejected action
      });
  },
});

// Exporting the reducer to be used in the store
export default orderSlice.reducer;
