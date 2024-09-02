import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "../Slice/PatientSlice";

export const store = configureStore({
  reducer: {
    patientReducer,
  },
});
