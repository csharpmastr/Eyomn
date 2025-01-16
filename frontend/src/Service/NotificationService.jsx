import axios from "axios";

const NOTIFICATION_API_BASE_URL = `http://localhost:3000/api/v1/notification`;

export const updateNotification = async (
  userId,
  notificationId,
  firebaseUid
) => {
  try {
    const response = await axios.patch(
      `${NOTIFICATION_API_BASE_URL}/update/${notificationId}`,
      { read: true },
      {
        params: { userId, firebaseUid },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating notification:", error.message);
    throw new Error("Failed to update notification read status.");
  }
};

export const getUserNotification = async (staffId, firebaseUid) => {
  try {
    const response = await axios.get(
      `${NOTIFICATION_API_BASE_URL}/get-notifications`,
      {
        withCredentials: true,
        params: {
          staffId,
          firebaseUid,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting notification:", error.message);
    throw new Error("Failed to get notifications.");
  }
};
