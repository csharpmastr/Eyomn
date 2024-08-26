import axios from "axios";

const AddUserToWaitlist = async (data) => {
  try {
    const res = await axios.post(
      "https://eyomn.vercel.app/api/sheet/submit", // Ensure correct URL format
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    return res.data;
  } catch (err) {
    console.error("Error submitting form:", err);
  }
};

export default AddUserToWaitlist;
