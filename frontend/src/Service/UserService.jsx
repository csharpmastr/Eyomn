import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/user";

export const userLogin = async (email, password) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (err) {
    throw err.response?.data?.error || "An error occurred";
  }
};

export const userSignUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (err) {
    throw err.response?.data?.error || "An error occurred";
  }
};

export const getNewAccess = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}/new-access`, {
      refreshToken,
    });

    return response.data.accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

export const changeUserPassword = async (
  organizationId = null,
  branchId = null,
  staffId,
  role,
  firebaseUid,
  password,
  newPassword,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.post(
      `${API_URL}/change-password`,
      { organizationId, branchId, staffId, role, password, newPassword },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
        params: {
          firebaseUid,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
