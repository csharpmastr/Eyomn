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
        withCredentials: true,
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

export const getNewAccess = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/new-access`,
      {},
      {
        withCredentials: true,
      }
    );

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
  newPassword
) => {
  try {
    const response = await axios.post(
      `${API_URL}/change-password`,
      { organizationId, branchId, staffId, role, password, newPassword },
      {
        withCredentials: true,
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

export const sendOTP = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, { email });
    return response;
  } catch (error) {
    console.error("Error sending otp:", error);
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return response;
  } catch (error) {
    console.error("Error sending otp:", error);
    throw error;
  }
};

export const forgotChangePassword = async (email, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password-change`, {
      email,
      newPassword,
    });

    return response;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const sendQuestion = async (question, memory) => {
  try {
    const response = await axios.post(
      `https://csharpmastr--eyomnai-rag-chat-web-endpoint.modal.run`,
      {
        question: question,
        generation: "",
        web_search: "",
        documents: [],
        memory: memory,
        summarized_memory: "",
      }
    );
    return response;
  } catch (error) {
    console.error("Error during request :", error);
    throw error;
  }
};

export const userLogout = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("Logout API error:", error);
  }
};
