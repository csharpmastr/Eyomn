import axios from "axios";

const PATIENT_API_BASE_URL = "http://localhost:3000/api/v1/patient";

export const addPatientService = async (
  patientData,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.post(
      `${PATIENT_API_BASE_URL}/add`,
      patientData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Error adding patient : ", err);
    throw err;
  }
};

export const getPatientsByDoctor = async (
  clinicId,
  doctorId,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.post(
      `${PATIENT_API_BASE_URL}/get-patients`,
      {
        clinicId,
        doctorId,
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
    console.error("Error fetching patients: ", err);
    throw err;
  }
};
