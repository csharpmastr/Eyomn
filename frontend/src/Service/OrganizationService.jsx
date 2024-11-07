import axios from "axios";

const ORGANIZATION_API_BASE_URL = "http://localhost:3000/api/v1/organization";
export const getStaffs = async (
  organizationId,
  branchId,
  accessToken,
  refreshToken,
  firebaseUid
) => {
  try {
    const response = await axios.get(
      `${ORGANIZATION_API_BASE_URL}/get-staffs`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
        params: {
          firebaseUid,
          organizationId,
          branchId,
        },
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
  accessToken,
  refreshToken,
  firebaseUid
) => {
  try {
    const response = await axios.post(
      `${ORGANIZATION_API_BASE_URL}/add-staff/${organizationId}`,

      staffData,
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
  } catch (err) {
    throw err;
  }
};

export const getDoctorList = async (
  organizationId,
  branchId,
  accessToken,
  refreshToken,
  firebaseUid
) => {
  try {
    const response = await axios.get(
      `${ORGANIZATION_API_BASE_URL}/get-doctors`,
      {
        params: {
          organizationId,
          branchId,
          firebaseUid,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
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
  accessToken,
  refreshToken,
  firebaseUid
) => {
  try {
    const response = await axios.post(
      `${ORGANIZATION_API_BASE_URL}/add-branch/${organizationId}`,
      branchDetails,
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
    console.error("Error adding branch:", error);
    throw error;
  }
};

export const getBranchData = async (
  organizationId,
  accessToken,
  refreshToken,
  firebaseUid
) => {
  try {
    const response = await axios.get(
      `${ORGANIZATION_API_BASE_URL}/get-branch-data/${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Refresh-Token": refreshToken,
        },
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
