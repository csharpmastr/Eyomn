import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
  },
});

export const { setNotifications, clearNotifications, addNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
