// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null, // Start with a default value
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
        const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
        localStorage.setItem("expirationTime", expirationTime);
      }
    },
    logout: (state) => {
      state.userInfo = null;
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
