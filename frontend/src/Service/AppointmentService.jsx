import axios from "axios";

const APPOINTMENT_API_BASE_URL = "http://localhost:3000/api/v1/appointment";

export const addAppointmentService = async (
  branchId,
  appointmentDetails,
  firebaseUid
) => {
  try {
    const response = await axios.post(
      `${APPOINTMENT_API_BASE_URL}/add/${branchId}`,
      appointmentDetails,
      {
        params: {
          firebaseUid,
        },
        withCredentials: true, // Include cookies for authentication
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const getAppointments = async (branchId, firebaseUid) => {
  try {
    const response = await axios.get(
      `${APPOINTMENT_API_BASE_URL}/get-appointments`,
      {
        params: {
          branchId,
          firebaseUid,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const getDoctorAppointments = async (doctorId, firebaseUid) => {
  try {
    const response = await axios.get(
      `${APPOINTMENT_API_BASE_URL}/get-doctor-appointments`,
      {
        params: {
          doctorId,
          firebaseUid,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const updateAppointment = async (
  branchId,
  appointmentId,
  appointmentDetails,
  firebaseUid
) => {
  try {
    const response = await axios.patch(
      `${APPOINTMENT_API_BASE_URL}/update-appointment`,
      appointmentDetails,
      {
        params: {
          firebaseUid,
          branchId,
          appointmentId,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const deleteAppointment = async (
  branchId,
  appointmentId,
  firebaseUid
) => {
  try {
    const response = await axios.delete(`${APPOINTMENT_API_BASE_URL}/delete`, {
      params: {
        branchId,
        appointmentId,
        firebaseUid,
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};
