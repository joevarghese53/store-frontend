// redux/features/auth/registerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  password: ''
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegisterData: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    clearRegisterData: (state) => {
      state.name = '';
      state.email = '';
      state.password = '';
    }
  }
});

export const { setRegisterData, clearRegisterData } = registerSlice.actions;
export default registerSlice.reducer;
