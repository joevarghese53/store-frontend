import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./state/auth/authSlice";
import checkoutReducer from "./state/checkout/checkoutSlice";
import shopReducer from "./state/shop/shopSlice";
import registerReducer from "./state/auth/registerSlice";


const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    register: registerReducer,
    checkout: checkoutReducer,
    shop: shopReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
