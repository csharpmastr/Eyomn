const { appendToSheet } = require("../Service/googleSheetService");

const addUserToWaitlist = async (req, res) => {
  const values = req.body;
  console.log(req.body);
  try {
    const result = await appendToSheet(values);
    res
      .status(200)
      .json({ message: "Data written successfully", data: result });
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
