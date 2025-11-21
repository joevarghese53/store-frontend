// === authSlice.js ===
import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage =
  typeof window !== 'undefined' && localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const initialState = {
  userInfo: userInfoFromStorage, // { name, email, accessToken, ... }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.userInfo = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo');
      }
    },
    setAccessToken: (state, action) => {
      if (!state.userInfo) return;
      state.userInfo.accessToken = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    },
  },
});

export const { setCredentials, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
