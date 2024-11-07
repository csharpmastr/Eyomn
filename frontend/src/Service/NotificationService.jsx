import axios from "axios";

const NOTIFICATION_API_BASE_URL = `https://eyomn.vercel.app/api/v1/notification`;

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
