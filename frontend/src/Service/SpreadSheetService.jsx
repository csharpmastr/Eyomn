import axios from "axios";

const AddUserToWaitlist = async (data) => {
  try {
    const res = await axios.post(
      "https://eyomn.vercel.app/api/sheet/submit",
      data
    );
    return res.data;
  } catch (err) {
    console.error(
      "Error message:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
};

export default AddUserToWaitlist;
