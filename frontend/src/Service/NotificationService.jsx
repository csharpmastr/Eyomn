import axios from "axios";


const NOTIFICATION_API_BASE_URL = `https://api.eyomn.com/api/v1/notification`;

export const updateNotification = async (
  staffId,
  notificationId,
  firebaseUid
) => {
  try {
    const response = await axios.patch(
      `${NOTIFICATION_API_BASE_URL}/update/${notificationId}`,
      { read: true },
      {
        params: { staffId, firebaseUid },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating notification:", error.message);
    throw new Error("Failed to update notification read status.");
  }
};

export const getUserNotification = async (
  staffId,
  firebaseUid,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.get(
      `${NOTIFICATION_API_BASE_URL}/get-notifications`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
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
