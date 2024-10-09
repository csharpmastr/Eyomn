import { addProduct } from "../Service/inventoryService";

const addProductHandler = async (req, res) => {
  try {
    const branchId = req.params.branchId;
    const productDetails = req.body;
    if (!branchId) {
      return res.status(400).json({ message: "No Branch ID provided." });
    }

    const patientId = await addProduct(branchId, productDetails);
    return res
      .status(200)
      .json({ message: "Patient added successfully", patientId: patientId });
  } catch (error) {
    console.error("Error adding product: ", error);
    res
      .status(500)
      .json({ message: "Error adding product.", error: error.message });
  }
};

module.exports = {
  addProductHandler,
};
