import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staffs: [],
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    addStaff: (state, action) => {
      state.staffs.push(action.payload);
    },
    removeStaff: (state, action) => {
      state.staffs = state.staffs.filter(
        (staff) => staff.id !== action.payload
      );
    },
    setStaffs: (state, action) => {
      state.staffs = action.payload;
    },
    clearStaffs: (state) => {
      state.staffs = [];
    },
  },
});

export const { addStaff, removeStaff, setStaffs, clearStaffs } =
  staffSlice.actions;

export default staffSlice.reducer;
