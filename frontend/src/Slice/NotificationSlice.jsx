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
      const newNotification = action.payload;
      const isDuplicate = state.notifications.some(
        (notification) =>
          notification.notificationId === newNotification.notificationId
      );
      if (!isDuplicate) {
        state.notifications.push(newNotification);
      }
    },
    updateNotificationRead: (state, action) => {
      const { notificationId } = action.payload; // Make sure you're getting notificationId from payload
      const notification = state.notifications.find(
        (notif) => notif.notificationId === notificationId // Change from notif.id to notif.notificationId
      );

      if (notification) {
        notification.read = true; // Update read status to true
      }
    },
  },
});

export const {
  setNotifications,
  clearNotifications,
  addNotification,
  updateNotificationRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
