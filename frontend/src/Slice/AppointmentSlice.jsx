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
      const { id, ...updates } = action.payload; // Destructure id and the rest as updates

      const index = state.list.findIndex(
        (appointment) => appointment.id === id
      );
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updates }; // Merge updates
      }
    },
  },
});

export const {
  setAppointments,
  clearAppointment,
  addAppointment,
  updatedAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
