import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visits: [],
};

const visitSlice = createSlice({
  name: "visit",
  initialState,
  reducers: {
    addVisit: (state, action) => {
      state.visits.push(action.payload);
    },
    removeVisit: (state, action) => {
      state.visits = state.visits.filter(
        (visit) => visit.id !== action.payload
      );
    },
    setVisits: (state, action) => {
      state.visits = action.payload;
    },
    clearVisits: (state) => {
      state.visits = [];
    },
  },
});

export const { addVisit, removeVisit, setVisits, clearVisits } =
  visitSlice.actions;

export default visitSlice.reducer;
