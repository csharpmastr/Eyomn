const { getBranchDoctors } = require("../Helper/Helper");
const {
  addStaff,
  getAllStaff,
  getDoctorsList,
  addBranch,
  getBranchData,
} = require("../Service/organizationService");
const { EmailAlreadyExistsError } = require("../Service/UserService");

const addStaffHandler = async (req, res) => {
  try {
    const organizationId = req.params.organizationId;

    const { firebaseUid } = req.query;
    const staffData = req.body;

    if (!organizationId || Object.keys(staffData).length === 0) {
      return res.status(400).json({
        message: "Organization ID and staff data are required.",
      });
    }

    const staffId = await addStaff(organizationId, staffData, firebaseUid);

    return res
      .status(200)
      .json({ message: "Staff added successfully", staffId: staffId });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Error adding staff.",
      error: error.message,
    });
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
    const { organizationId, branchId, firebaseUid } = req.query;

    if (!organizationId || !branchId) {
      return res
        .status(400)
        .json({ message: "Clinic ID and Branch ID are required." });
    }
    const doctors = await getBranchDoctors(
      organizationId,
      branchId,
      firebaseUid
    );
    if (!doctors || doctors.length === 0) {
      return res
        .status(404)
        .json({ message: "No doctors found for the provided clinic ID." });
    }
    return res.status(200).json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching doctors." });
  }
};

const addBranchHandler = async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const { firebaseUid } = req.query;
    const branchData = req.body;

    if (!organizationId) {
      return res
        .status(400)
        .json({ message: "Organization ID and branch data are required." });
    }

    const branchId = await addBranch(organizationId, branchData, firebaseUid);

    return res.status(201).json({
      message: "Branch added successfully.",
      branchId: branchId,
    });
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({
      message: "An error occurred while adding the branch.",
      error: err.message,
    });
  }
};

const getBranchDataHandler = async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const { firebaseUid } = req.query;
    if (!organizationId) {
      return res
        .status(400)
        .json({ message: "Organization ID and branch data are required." });
    }
    console.log(firebaseUid);

    const branchData = await getBranchData(organizationId, firebaseUid);

    return res.status(200).json(branchData);
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
  addBranchHandler,
  getBranchDataHandler,
};
