import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  branch: [],
};
const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranch: (state, action) => {
      state.branch = action.payload;
    },
    clearBranch: (state) => {
      state.branch = [];
    },
    addBranch: (state, action) => {
      state.branch.push(action.payload);
    },
  },
});

export const { setBranch, clearBranch, addBranch } = branchSlice.actions;

export default branchSlice.reducer;
