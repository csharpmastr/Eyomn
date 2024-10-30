import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notes: [],
};
const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    clearNotes: (state) => {
      state.notes = [];
    },
    addNewNote: (state, action) => {
      state.notes.push(action.payload);
    },
  },
});

export const { setNotes, clearNotes, addNewNote } = noteSlice.actions;

export default noteSlice.reducer;
