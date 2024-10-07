import axios from "axios";

const ORGANIZATION_API_BASE_URL = "http://localhost:3000/api/v1/organization";
export const getStaffs = async (clinicId, accessToken, refreshToken) => {
  try {
    const response = await axios.post(
      `${ORGANIZATION_API_BASE_URL}/get-staffs`,
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
    const response = await axios.post(
      `${ORGANIZATION_API_BASE_URL}/add`,

      staffData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
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
  refreshToken
) => {
  try {
    const response = await axios.get(
      `${ORGANIZATION_API_BASE_URL}/get-doctors`,
      {
        params: {
          organizationId,
          branchId,
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

export const addBranch = async (
  branchDetails,
  organizationId,
  accessToken,
  refreshToken
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
  refreshToken
) => {
  try {
    const response = await axios.get(
      `${ORGANIZATION_API_BASE_URL}/get-branch-data/${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Refresh-Token": refreshToken,
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
