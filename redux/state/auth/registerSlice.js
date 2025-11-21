// redux/features/auth/registerSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Safely read from localStorage (browser only)
let registerDataFromStorage = { name: '', email: '' };

if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('registerData');
    if (stored) {
      const parsed = JSON.parse(stored);
      registerDataFromStorage = {
        name: parsed.name || '',
        email: parsed.email || '',
      };
    }
  } catch (e) {
    console.warn('Failed to parse registerData from localStorage:', e);
  }
}

const initialState = {
  name: registerDataFromStorage.name,
  email: registerDataFromStorage.email,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegisterData: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'registerData',
          JSON.stringify({
            name: state.name,
            email: state.email,
          })
        );
      }
    },
    clearRegisterData: (state) => {
      state.name = '';
      state.email = '';

      if (typeof window !== 'undefined') {
        localStorage.removeItem('registerData');
      }
    },
  },
});

export const { setRegisterData, clearRegisterData } = registerSlice.actions;
export default registerSlice.reducer;
