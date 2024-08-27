const {
  appendToSheet,
  emailExists,
  getSheetData,
} = require("../Service/googleSheetService");

const addUserToWaitlist = async (req, res) => {
  const values = req.body;
  const email = values.email;
  const data = await getSheetData();

  try {
    const emailTaken = await emailExists(email);
    if (emailTaken) {
      return res.status(400).json({ message: "Email is already taken" });
    }
    const result = await appendToSheet(req.body);
    res.status(200).json({ message: "Data written successfully", data: data });
  } catch (error) {
    res.status(500).json({ message: "Failed to write data", error });
  }
};
const hello = async (req, res) => {
  try {
    res.status(200).json({ message: "Hello" });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

module.exports = {
  addUserToWaitlist,
  hello,
};
