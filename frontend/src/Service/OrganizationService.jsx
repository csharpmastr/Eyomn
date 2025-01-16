import axios from "axios";

const ORGANIZATION_API_BASE_URL = "http://localhost:3000/api/v1/organization";

export const getStaffs = async (organizationId, branchId, firebaseUid) => {
  try {
    const response = await axios.get(
      `${ORGANIZATION_API_BASE_URL}/get-staffs`,
      {
        params: {
          firebaseUid,
          organizationId,
          branchId,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching staff: ", err);
    throw err;
  }
};

export const addStaffService = async (
  staffData,
  organizationId,
  firebaseUid
) => {
  try {
    const response = await axios.post(
      `${ORGANIZATION_API_BASE_URL}/add-staff/${organizationId}`,

      staffData,
      {
        withCredentials: true,
        params: {
          firebaseUid,
        },
      }
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDoctorList = async (organizationId, branchId, firebaseUid) => {
  try {
    const response = await axios.get(
      `${ORGANIZATION_API_BASE_URL}/get-doctors`,
      {
        params: {
          organizationId,
          branchId,
          firebaseUid,
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    throw error;
  }
};

export const addBranchService = async (
  branchDetails,
  organizationId,
  firebaseUid
) => {
  try {
    const response = await axios.post(
      `${ORGANIZATION_API_BASE_URL}/add-branch/${organizationId}`,
      branchDetails,
      {
        withCredentials: true,
        params: {
          firebaseUid,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding branch:", error);
    throw error;
  }
};

export const getBranchData = async (organizationId, firebaseUid) => {
  try {
    const response = await axios.get(
      `${ORGANIZATION_API_BASE_URL}/get-branch-data/${organizationId}`,
      {
        withCredentials: true,
        params: {
          firebaseUid,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch branch data:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching branch data:", error);
    return null;
  }
};

export const getBranchName = async (staffId, firebaseUid) => {
  try {
    const response = await axios.get(
      `${ORGANIZATION_API_BASE_URL}/get-branch-name`,
      {
        params: {
          firebaseUid,
          staffId,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching branch name:", error);
    return null;
  }
};
