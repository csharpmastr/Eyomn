import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "../Slice/PatientSlice";
import doctorReducer from "../Slice/doctorSlice";
import staffReducer from "../Slice/StaffSlice";
import userReducer from "../Slice/UserSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { version } from "react";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const reducer = combineReducers({
  doctor: doctorReducer,
  patient: patientReducer,
  staff: staffReducer,
  user: userReducer,
});
const persistedReducer = persistReducer(persistConfig, reducer);
export const store = configureStore({
  reducer: {
    reducer: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
