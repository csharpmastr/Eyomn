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
        (product) => product.productId !== action.payload
      );
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (p) => p.productId === action.payload.productId
      );

      if (index !== -1) {
        // Update the product details
        state.products[index] = {
          ...state.products[index],
          quantity: action.payload.quantity, // Set new quantity directly
          ...Object.keys(action.payload).reduce((acc, key) => {
            if (key !== "quantity") {
              acc[key] = action.payload[key]; // Update other fields
            }
            return acc;
          }, {}),
        };
      }
    },
    purchaseProduct: (state, action) => {
      const index = state.products.findIndex(
        (p) => p.productId === action.payload.productId
      );

      if (index !== -1) {
        const currentQuantity = state.products[index].quantity;
        const quantityToSubtract = action.payload.quantity;

        state.products[index].quantity = Math.max(
          currentQuantity - quantityToSubtract,
          0
        );
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
  purchaseProduct,
} = productSlice.actions;

export default productSlice.reducer;
