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

export const addStaffService = async (
  staffData,
  accessToken,
  refreshToken,
  organizationId,
  branchId
) => {
  try {
    const response = await axios.post(
      `${ORGANIZATION_API_BASE_URL}/add-staff/${organizationId}/${branchId}`,
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
  clinicId,
  doctorId,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.get(
      `${ORGANIZATION_API_BASE_URL}/get-doctors`,
      {
        params: {
          clinicId,
          doctorId,
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
