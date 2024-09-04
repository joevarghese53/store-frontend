import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  products: [],
  checked: [],
  priceRange: [], // New state for price range
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
      console.log(state.priceRange);
    },
  },
});

export const {
  setCategories,
  setProducts,
  setChecked,
  setPriceRange, // Export the new action
} = shopSlice.actions;

export default shopSlice.reducer;
