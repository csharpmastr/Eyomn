const {
  addStaff,
  getAllStaff,
  getDoctorsList,
} = require("../Service/organizationService");

const addStaffHandler = async (req, res) => {
  try {
    const { clinicId, ...staffData } = req.body;
    if (!clinicId || Object.keys(staffData).length === 0) {
      return res
        .status(400)
        .json({ message: "Clinic ID and patient data are required." });
    }
    await addStaff(clinicId, staffData);
    return res.status(200).json({ message: "Staff added successfully" });
  } catch (error) {
    console.error("Error adding patient: ", error);
    res
      .status(500)
      .json({ message: "Error adding staff.", error: error.message });
  }
};

const getStaffsHandler = async (req, res) => {
  try {
    const { clinicId } = req.body;
    if (!clinicId || Object.keys(clinicId).length === 0) {
      return res
        .status(400)
        .json({ message: "Clinic ID and patient data are required." });
    }
    const staffs = await getAllStaff(clinicId);

    return res.status(200).json(staffs);
  } catch (error) {
    console.error("Error getting staffs: ", error);
    res
      .status(500)
      .json({ message: "Error getting staff.", error: error.message });
  }
};

const getDoctorsListHandler = async (req, res) => {
  try {
    const { clinicId } = req.query;

    if (!clinicId || Object.keys(clinicId).length === 0) {
      return res
        .status(400)
        .json({ message: "Clinic ID and patient data are required." });
    }
    const doctors = await getDoctorsList(clinicId);
    if (!doctors || doctors.length === 0) {
      return res
        .status(404)
        .json({ message: "No doctors found for the provided clinic ID." });
    }
    return res.status(200).json({ doctors });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching doctors." });
  }
};
module.exports = {
  addStaffHandler,
  getStaffsHandler,
  getDoctorsListHandler,
};
