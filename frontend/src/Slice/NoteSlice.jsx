import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rawNotes: {},
  medicalScribeNotes: {},
  images: {},
};

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setRawNotes: (state, action) => {
      const newNotes = action.payload;
      const patientId = Object.keys(newNotes)[0];

      const existingNotes = state.rawNotes[patientId] || [];

      const newNotesArray = newNotes[patientId] || [];

      const updatedNotes = [
        ...existingNotes,
        ...newNotesArray.filter(
          (newNote) =>
            !existingNotes.some(
              (existingNote) => existingNote.noteId === newNote.noteId
            )
        ),
      ];

      state.rawNotes[patientId] = updatedNotes;
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

      if (!state.rawNotes[patientId].includes(noteData)) {
        state.rawNotes[patientId].push(noteData);
      }
    },

    setMedicalScribeNotes: (state, action) => {
      const newNotes = action.payload;
      const patientId = Object.keys(newNotes)[0];

      const existingNotes = state.medicalScribeNotes[patientId] || [];
      state.medicalScribeNotes[patientId] = [
        ...new Set([...existingNotes, ...newNotes[patientId]]),
      ];
    },

    clearMedicalScribeNotes: (state) => {
      state.medicalScribeNotes = {};
    },

    addNewMedicalScribeNote: (state, action) => {
      const patientId = action.payload.patientId;
      const noteData = action.payload.noteData;

      if (!state.medicalScribeNotes[patientId]) {
        state.medicalScribeNotes[patientId] = [];
      }

      if (
        !state.medicalScribeNotes[patientId].some(
          (note) => note.noteId === noteData.noteId
        )
      ) {
        state.medicalScribeNotes[patientId].push(noteData);
      }
    },

    setImagesArchive: (state, action) => {
      const newImages = action.payload;
      const patientId = Object.keys(newImages)[0];

      const existingImages = state.images[patientId] || [];
      state.images[patientId] = [
        ...new Set([...existingImages, ...newImages[patientId]]),
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

      if (!state.images[patientId].includes(imageUrl)) {
        state.images[patientId].push(imageUrl);
      }
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
