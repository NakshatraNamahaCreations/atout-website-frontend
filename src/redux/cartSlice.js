import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [], // Load cart from localStorage
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((cartItem) => cartItem._id === item._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items)); // ✅ Save updated cart
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item._id !== id);

      localStorage.setItem("cartItems", JSON.stringify(state.items)); // ✅ Update localStorage
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item) {
        item.quantity = quantity;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items)); // ✅ Ensure localStorage is updated
    },
    clearCart: (state) => {
      state.items = []; // ✅ Clears the Redux cart state
      localStorage.removeItem("cartItems"); // ✅ Remove cart from localStorage
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
