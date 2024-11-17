const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  addPurchase,

  retrieveProduct,
  addServiceFee,
  getOrgProductSalesWithServices,
  getBranchGross,
  getBranchInventory,
} = require("../Service/inventoryService");

const addProductHandler = async (req, res) => {
  try {
    const branchId = req.params.branchId;
    const { firebaseUid } = req.query;
    const productDetails = req.body;
    console.log(branchId);

    if (!branchId) {
      return res.status(400).json({ message: "No Branch ID provided." });
    }

    const { productId, productSKU } = await addProduct(
      branchId,
      productDetails,
      firebaseUid
    );

    return res.status(200).json({
      message: "Product added successfully",
      productId: productId,
      productSKU: productSKU,
    });
  } catch (error) {
    console.error("Error adding product: ", error);

    if (error.status === 400) {
      return res.status(409).json({ message: error.message });
    }

    return res
      .status(500)
      .json({ message: "Error adding product.", error: error.message });
  }
};

const deleteProductHandler = async (req, res) => {
  try {
    const { branchId, productId } = req.query;
    const { isDeleted } = req.body;
    if (!branchId || !productId) {
      return res.status(401).json({ message: "No Branch/Product ID provided" });
    }
    await deleteProduct(branchId, productId, isDeleted);
    return res.status(201).json({ message: "Product deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product.", error: error.message });
  }
};

const updateProductHandler = async (req, res) => {
  try {
    const branchId = req.params.branchId;
    const productId = req.params.productId;
    const productDetails = req.body;

    if (!branchId || !productId) {
      return res
        .status(401)
        .json({ message: "No Branch/Product ID provided." });
    }
    await updateProduct(branchId, productId, productDetails);
    return res.status(201).json({ message: "Product update successfully." });
  } catch (error) {
    console.error("Error updating product: ", error);

    if (error.status === 400) {
      return res.status(409).json({ message: error.message });
    }

    return res
      .status(500)
      .json({ message: "Error updating product.", error: error.message });
  }
};
const addPurchaseHandler = async (req, res) => {
  try {
    const branchId = req.params.branchId;
    const staffId = req.params.staffId;
    const { firebaseUid } = req.query;
    const purchaseDetails = req.body;
    console.log(branchId, staffId);

    if (!branchId || !staffId) {
      return res.status(400).json({ message: "No Branch/Staff ID provided." });
    }

    const { purchaseId, createdAt } = await addPurchase(
      purchaseDetails,
      branchId,
      staffId,
      firebaseUid
    );
    return res.status(201).json({ purchaseId, createdAt });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding purchase", error: error.message });
  }
};
const getBranchInventoryHandler = async (req, res) => {
  try {
    const { firebaseUid, branchId } = req.query;

    if (!firebaseUid || !branchId) {
      return res.status(400).json({
        message:
          "Missing required query parameters: 'firebaseUid' or 'branchId'.",
      });
    }

    const inventory = await getBranchInventory(branchId, firebaseUid);

    return res.status(200).json(inventory);
  } catch (error) {
    console.error("Error in getBranchInventoryHandler:", error);
    return res.status(error.status || 500).json({
      message:
        error.message || "An error occurred while fetching branch inventory.",
    });
  }
};

const getOrgProductSalesHandler = async (req, res) => {
  try {
    const { organizationId, firebaseUid } = req.query;

    const inventoryData = await getOrgProductSalesWithServices(
      organizationId,
      firebaseUid
    );

    return res.status(200).json(inventoryData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching data." + error });
  }
};
const retrieveProductHandler = async (req, res) => {
  try {
    const { firebaseUid } = req.query;
    const branchId = req.params.branchId;
    const products = req.body.products;

    await retrieveProduct(branchId, products, firebaseUid);
    return res.status(200).json({ message: "Product retrieved" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while retrieving data." + error });
  }
};
const addServiceFeeHandler = async (req, res) => {
  try {
    const branchId = req.params.branchId;
    const { firebaseUid, patientId, doctorId } = req.query;
    const serviceDetails = req.body;

    if (!branchId) {
      return res.status(400).json({ message: "No Branch ID provided." });
    }
    const serviceId = await addServiceFee(
      branchId,
      doctorId,
      patientId,
      serviceDetails,
      firebaseUid
    );
    if (serviceId) {
      return res.status(200).json({ serviceId: serviceId });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while adding data." + error });
  }
};

module.exports = {
  addProductHandler,

  deleteProductHandler,
  updateProductHandler,
  addPurchaseHandler,
  getBranchInventoryHandler,
  getOrgProductSalesHandler,
  retrieveProductHandler,
  addServiceFeeHandler,
};
