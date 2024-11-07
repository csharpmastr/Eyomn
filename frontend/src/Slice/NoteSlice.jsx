import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rawNotes: {},
  medicalScribeNotes: [],
  images: {},
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
    setImagesArchive: (state, action) => {
      const newImages = action.payload;
      const patientId = Object.keys(newImages)[0];

      state.images[patientId] = state.images[patientId] || [];

      state.images[patientId] = [
        ...state.images[patientId],
        ...newImages[patientId],
      ];
    },

    clearImages: (state) => {
      state.images = {};
    },

    addNewImageArchive: (state, action) => {
      const patientId = Object.keys(action.payload)[0];
      const imageUrl = action.payload[patientId];

      if (!state.images[patientId]) {
        state.images[patientId] = [];
      }

      state.images[patientId].push(imageUrl);
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
  setImagesArchive,
  addNewImageArchive,
  clearImages,
} = noteSlice.actions;

export default noteSlice.reducer;
