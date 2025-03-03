    import { configureStore } from '@reduxjs/toolkit';
    import selectedProductReducer from './selectedProductSlice';
    import orderReducer from './orderSlice';
    import cartReducer from './cartSlice';

    export const store = configureStore({
    reducer: {
        selectedProduct: selectedProductReducer,
        order: orderReducer, 
        cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false, // Avoid unnecessary Redux warnings
        }),
    });
