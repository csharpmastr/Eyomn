import axios from "axios";
import { useSelector } from "react-redux";

const PATIENT_API_BASE_URL = "http://localhost:3000/api/v1/patient";

export const addPatientService = async (
  patientData,
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
        withCredentials: true,
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
export const updatePatientData = async (
  patientData,
  patientId,
  firebaseUid
) => {
  try {
    const response = await axios.patch(
      `${PATIENT_API_BASE_URL}/update/${patientId}`,
      patientData,
      {
        params: {
          firebaseUid,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating patient : ", error);
    throw error;
  }
};

export const getPatientsByDoctor = async (
  organizationId,
  staffId,
  firebaseUid
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
        withCredentials: true,
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
      withCredentials: true,
    });

    return response.data;
  } catch (err) {
    console.error("Error fetching patients: ", err);
    throw err;
  }
};

export const addPatientNote = async (note, patientId, firebaseUid) => {
  try {
    const response = await axios.post(
      `${PATIENT_API_BASE_URL}/add-note/${patientId}`,
      note,
      {
        withCredentials: true,
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

export const getPatientVisit = async (patientId, firebaseUid) => {
  try {
    const response = await axios.get(`${PATIENT_API_BASE_URL}/get-visits`, {
      params: {
        patientId,
        firebaseUid,
      },
      withCredentials: true,
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
  firebaseUid
) => {
  try {
    const response = await axios.post(
      `${PATIENT_API_BASE_URL}/add-visit/${patientId}/${doctorId}/${branchId}`,
      { reason_visit },
      {
        params: {
          firebaseUid,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching patients: ", error);
    throw error;
  }
};

export const getPatientNotes = async (patientId, firebaseUid) => {
  try {
    const response = await axios.get(`${PATIENT_API_BASE_URL}/get-notes`, {
      params: {
        firebaseUid,
        patientId,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching patient notes: ", error);
    throw error;
  }
};

export const uploadImageArchive = async (patientId, image, firebaseUid) => {
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
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
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

export const getPatientImageArchive = async (patientId, firebaseUid) => {
  try {
    const response = await axios.get(`${PATIENT_API_BASE_URL}/image-archive`, {
      params: {
        patientId,
        firebaseUid,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting patient images:", error);
  }
};

export const sharePatient = async (
  doctorId,
  authorizedDoctor,
  patientId,
  firebaseUid
) => {
  try {
    const response = await axios.patch(
      `${PATIENT_API_BASE_URL}/share-patient/${patientId}`,
      { authorizedDoctor },
      {
        params: {
          firebaseUid,
          doctorId,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error sharing patient", error);
  }
};

export const summarizeInitialPatientCase = async (medformData) => {
  try {
    const response = await axios.post(
      "https://csharpmastr--eyomnai-medical-team-agent-web-endpoint.modal.run",
      {
        patient_data: medformData,
        summarized_data: {
          subjective: "",
          objective: "",
          assessment: "",
          plan: "",
        },
        halu_score: Number(10),
        feedback: [],
        markdown_output: "",
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const storeGeneratedSoap = (
  formattedSoap,
  patientId,
  doctorId,
  firebaseUid,
  noteId
) => {
  try {
    axios.post(
      `${PATIENT_API_BASE_URL}/add-soap/${patientId}`,
      { formattedSoap },
      {
        params: {
          firebaseUid,
          doctorId,
          noteId,
        },
        withCredentials: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getAllVisits = async (staffId, firebaseUid) => {
  try {
    const response = await axios.get(`${PATIENT_API_BASE_URL}/get-all-visits`, {
      params: {
        firebaseUid,
        staffId,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
