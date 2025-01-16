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
    updatedAppointment: (state, action) => {
      const { id, ...updates } = action.payload;

      const index = state.appointment.findIndex(
        (appointment) => appointment.id === id
      );
      if (index !== -1) {
        state.appointment[index] = { ...state.appointment[index], ...updates };
      }
    },
    removeAppointment: (state, action) => {
      const id = action.payload;
      state.appointment = state.appointment.filter(
        (appointment) => appointment.id !== id
      );
    },
  },
});

export const {
  setAppointments,
  clearAppointment,
  addAppointment,
  updatedAppointment,
  removeAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
