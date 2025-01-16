import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  doctor: [],
};
const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    setDoctor: (state, action) => {
      state.doctor = action.payload;
    },
    clearDoctor: (state) => {
      state.doctor = [];
    },
  },
});

export const { setDoctor, clearDoctor } = doctorSlice.actions;

export default doctorSlice.reducer;
