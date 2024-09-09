import axios from "axios";

const STAFF_API_BASE_URL = "http://localhost:3000/api/v1/staff";
export const getStaffs = async (clinicId, accessToken, refreshToken) => {
  try {
    const response = await axios.post(
      `${STAFF_API_BASE_URL}/get-staffs`,
      {
        clinicId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching staff: ", err);
    throw err;
  }
};

export const addStaffService = async (staffData, accessToken, refreshToken) => {
  try {
    const response = await axios.post(`${STAFF_API_BASE_URL}/add`, staffData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      },
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDoctorList = async (
  clinicId,
  doctorId,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.get(`${STAFF_API_BASE_URL}/get-doctors`, {
      params: {
        clinicId,
        doctorId,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    throw error;
  }
};
