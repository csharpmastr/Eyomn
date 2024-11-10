import axios from "axios";
import { useSelector } from "react-redux";

const PATIENT_API_BASE_URL = "http://localhost:3000/api/v1/patient";

export const addPatientService = async (
  patientData,
  accessToken,
  refreshToken,
  organizationID,
  branchId,
  doctorId,
  firebaseUid
) => {
  try {
    const response = await axios.post(
      `${PATIENT_API_BASE_URL}/add-patient/${organizationID}/${branchId}/${doctorId}`,
      patientData,
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
    console.log(
      `${PATIENT_API_BASE_URL}/add-patient/${organizationID}/${branchId}/${doctorId}`
    );

    return response;
  } catch (err) {
    console.error("Error adding patient : ", err);
    throw err;
  }
};

export const getPatientsByDoctor = async (
  organizationId,
  staffId,
  firebaseUid,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.get(
      `${PATIENT_API_BASE_URL}/patients-doctor`,
      {
        params: {
          organizationId,
          staffId,
          firebaseUid,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching patients: ", err);
    throw err;
  }
};

export const getPatients = async (
  organizationId,
  branchId = null,
  doctorId = null,
  accessToken,
  refreshToken,
  role,
  firebaseUid
) => {
  try {
    const response = await axios.get(`${PATIENT_API_BASE_URL}/get-patients`, {
      params: {
        organizationId,
        branchId,
        doctorId,
        role,
        firebaseUid,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      },
    });
    console.log(firebaseUid);

    return response.data;
  } catch (err) {
    console.error("Error fetching patients: ", err);
    throw err;
  }
};

export const addPatientNote = async (
  note,
  patientId,
  firebaseUid,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.post(
      `${PATIENT_API_BASE_URL}/add-note/${patientId}`,
      note,
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
    return response.data;
  } catch (error) {
    console.error("Error fetching patients: ", err);
    throw err;
  }
};

export const getPatientVisit = async (
  patientId,
  accessToken,
  refreshToken,
  firebaseUid
) => {
  try {
    const response = await axios.get(`${PATIENT_API_BASE_URL}/get-visits`, {
      params: {
        patientId,
        firebaseUid,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching patients: ", error);
    throw error;
  }
};

export const addVisitService = async (
  reason_visit,
  patientId,
  doctorId,
  branchId,
  firebaseUid,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.post(
      `${PATIENT_API_BASE_URL}/add-visit/${patientId}/${doctorId}/${branchId}`,
      { reason_visit },
      {
        params: {
          firebaseUid,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching patients: ", error);
    throw error;
  }
};

export const getPatientNotes = async (
  patientId,
  firebaseUid,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.get(`${PATIENT_API_BASE_URL}/get-notes`, {
      params: {
        firebaseUid,
        patientId,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching patient notes: ", error);
    throw error;
  }
};

export const uploadImageArchive = async (
  patientId,
  image,
  firebaseUid,
  accessToken,
  refreshToken
) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(
      `${PATIENT_API_BASE_URL}/upload-image/${patientId}`,
      formData,
      {
        params: {
          firebaseUid,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading patient image:", error);

    if (error.response && error.response.status === 401) {
      throw new Error("Access token expired. Please re-authenticate.");
    }

    throw error;
  }
};

export const getPatientImageArchive = async (
  patientId,
  firebaseUid,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.get(`${PATIENT_API_BASE_URL}/image-archive`, {
      params: {
        patientId,
        firebaseUid,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting patient images:", error);
  }
};
