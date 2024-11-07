import axios from "axios";

const API_URL = "https://eyomn.vercel.app/api/v1/user";

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
