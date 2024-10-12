import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appointment: [],
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointment = action.payload;
    },
    clearAppointment: (state) => {
      state.appointment = [];
    },
    addAppointment: (state, action) => {
      state.appointment.push(action.payload);
    },
  },
});

export const { setAppointments, clearAppointment, addAppointment } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;
