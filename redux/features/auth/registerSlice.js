// redux/features/auth/registerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegisterData: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    clearRegisterData: (state) => {
      state.name = '';
      state.email = '';
    }
  }
});

export const { setRegisterData, clearRegisterData } = registerSlice.actions;
export default registerSlice.reducer;
