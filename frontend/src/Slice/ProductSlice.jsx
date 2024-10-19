import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      if (!Array.isArray(state.products)) {
        state.products = [];
      }
      state.products.push(action.payload);
    },

    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (p) => p.productId === action.payload.productId
      ); // Ensure you're matching the correct identifier
      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          ...action.payload, // Spread the entire payload to update the product details
        };
      }
    },

    setProducts: (state, action) => {
      state.products = action.payload;
    },
    clearProducts: (state) => {
      state.products = [];
    },
  },
});

export const {
  addProduct,
  removeProduct,
  updateProduct,
  setProducts,
  clearProducts,
} = productSlice.actions;

export default productSlice.reducer;
