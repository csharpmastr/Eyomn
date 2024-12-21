import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  purchases: [],
  services: [],
  requests: [],
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      if (!Array.isArray(state.products)) {
        state.products = [];
      }
      state.products.push(action.payload);
    },

    removeProduct: (state, action) => {
      const productIdToRemove = action.payload;
      const productIndex = state.products.findIndex(
        (product) => product.productId === productIdToRemove
      );

      if (productIndex !== -1) {
        state.products[productIndex].isDeleted = true;
      }
    },
    retrieveProduct: (state, action) => {
      const productIdsToRetrieve = action.payload;
      productIdsToRetrieve.forEach((productId) => {
        const productIndex = state.products.findIndex(
          (product) => product.productId === productId
        );

        if (productIndex !== -1) {
          state.products[productIndex].isDeleted = false;
        }
      });
    },

    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (p) => p.productId === action.payload.productId
      );

      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          quantity: action.payload.quantity,
          ...Object.keys(action.payload).reduce((acc, key) => {
            if (key !== "quantity") {
              acc[key] = action.payload[key];
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

    addPurchase: (state, action) => {
      if (!Array.isArray(state.purchases)) {
        state.purchases = [];
      }
      state.purchases.push(action.payload);
    },

    setPurchases: (state, action) => {
      state.purchases = action.payload;
    },
    clearPurchases: (state) => {
      state.purchases = [];
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    addServices: (state, action) => {
      if (!Array.isArray(state.services)) {
        state.services = [];
      }
      state.services.push(action.payload);
    },
    clearServices: (state) => {
      state.services = [];
    },
    addRequest: (state, action) => {
      if (!Array.isArray(state.requests)) {
        state.requests = [];
      }
      state.requests.push(action.payload);
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    clearRequests: (state) => {
      state.requests = [];
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
  addPurchase,
  setPurchases,
  clearPurchases,
  retrieveProduct,
  setServices,
  addServices,
  clearServices,
  setRequests,
  addRequest,
  clearRequests,
} = inventorySlice.actions;

export default inventorySlice.reducer;
