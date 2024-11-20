import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  patients: [],
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    addPatient: (state, action) => {
      if (!Array.isArray(state.patients)) {
        state.patients = [];
      }
      const existingPatient = state.patients.find(
        (patient) => patient.patientId === action.payload.patientId
      );

      if (!existingPatient) {
        state.patients.push(action.payload);
      }
    },

    removePatient: (state, action) => {
      state.patients = state.patients.filter(
        (patient) => patient.id !== action.payload
      );
    },
    updatePatient: (state, action) => {
      const index = state.patients.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = {
          ...state.patients[index],
          ...action.payload.data,
        };
      }
    },
    setPatients: (state, action) => {
      state.patients = action.payload;
    },
    clearPatients: (state) => {
      state.patients = [];
    },
  },
});

export const {
  addPatient,
  removePatient,
  updatePatient,
  setPatients,
  clearPatients,
} = patientSlice.actions;

export default patientSlice.reducer;
