import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rawNotes: {},
  medicalScribeNotes: [],
};

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setRawNotes: (state, action) => {
      const newNotes = action.payload;
      const patientId = Object.keys(newNotes)[0];

      state.rawNotes[patientId] = state.rawNotes[patientId] || [];
      state.rawNotes[patientId] = [
        ...state.rawNotes[patientId],
        ...newNotes[patientId],
      ];
    },

    clearRawNotes: (state) => {
      state.rawNotes = {};
    },

    addNewRawNote: (state, action) => {
      const patientId = Object.keys(action.payload)[0];
      const noteData = action.payload[patientId];

      if (!state.rawNotes[patientId]) {
        state.rawNotes[patientId] = [];
      }

      state.rawNotes[patientId].push(noteData);
    },

    setMedicalScribeNotes: (state, action) => {
      state.medicalScribeNotes = action.payload;
    },

    clearMedicalScribeNotes: (state) => {
      state.medicalScribeNotes = [];
    },

    addNewMedicalScribeNote: (state, action) => {
      state.medicalScribeNotes.push(action.payload);
    },
  },
});

export const {
  setRawNotes,
  clearRawNotes,
  addNewRawNote,
  setMedicalScribeNotes,
  clearMedicalScribeNotes,
  addNewMedicalScribeNote,
} = noteSlice.actions;

export default noteSlice.reducer;
