import axios from "axios";

const APPOINTMENT_API_BASE_URL = "http://localhost:3000/api/v1/appointment";

export const addAppointment = async (
  branchId,
  appointmentDetails,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.post(
      `${APPOINTMENT_API_BASE_URL}/add/${branchId}`,
      appointmentDetails,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding appointment: ", error);
    throw error;
  }
};
