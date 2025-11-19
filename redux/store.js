import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import checkoutReducer from "./slices/checkoutSlice";
import shopReducer from "./features/shop/shopSlice";
import registerReducer from "./features/auth/registerSlice";

import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";

// PERSIST ONLY REGISTER SLICE
const registerPersistConfig = {
  key: "register",
  storage,
  whitelist: ["name", "email", "password"], // only persist these
};

// Combine reducers
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  register: persistReducer(registerPersistConfig, registerReducer),
  checkout: checkoutReducer,
  shop: shopReducer,
});

const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }).concat(apiSlice.middleware),

  devTools: true,
});

export const persistor = persistStore(store);
setupListeners(store.dispatch);

export default store;
