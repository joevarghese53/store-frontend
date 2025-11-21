import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAddress: null,
};

// Load state from localStorage if available
const loadStateFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    return initialState;
  }
  
  try {
    const serializedState = localStorage.getItem('selectedAddress');
    if (serializedState === null) {
      return initialState;
    }
    return { selectedAddress: JSON.parse(serializedState) };
  } catch (e) {
    console.warn('Could not load state from localStorage', e);
    return initialState;
  }
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: loadStateFromLocalStorage(),
  reducers: {
    selectShippingAddress: (state, action) => {
      state.selectedAddress = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          const serializedState = JSON.stringify(state.selectedAddress);
          localStorage.setItem('selectedAddress', serializedState);
        } catch (e) {
          console.warn('Could not save state to localStorage', e);
        }
      }
    },
  },
});

export const { selectShippingAddress } = checkoutSlice.actions;
export const selectSelectedAddress = (state) => state.checkout.selectedAddress;
export default checkoutSlice.reducer;
