import axios from "axios";

const STAFF_API_BASE_URL = "http://localhost:3000/api/v1/staff";
export const getStaffs = async (clinicId) => {
  try {
    const response = await axios.post(`${STAFF_API_BASE_URL}/get-staffs`, {
      clinicId,
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching staff: ", err);
    throw err;
  }
};
