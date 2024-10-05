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
  },
});

export const { setBranch, clearBranch } = branchSlice.actions;

export default branchSlice.reducer;
