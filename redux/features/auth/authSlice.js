// === authSlice.js ===
import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage =
  typeof window !== 'undefined' && localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const initialState = {
  userInfo: userInfoFromStorage,
};

const authSlice = createSlice({

  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      const { accessToken, ...userData } = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(userData));
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
