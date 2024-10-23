const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  addPurchase,
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

const getProductsHandler = async (req, res) => {
  try {
    const { branchId, firebaseUid } = req.query;
    if (!branchId) {
      return res.status(400).json({ message: "No Branch ID provided" });
    }

    const products = await getProducts(branchId, firebaseUid);

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products: ", error);
    res
      .status(500)
      .json({ message: "Error getting products.", error: error.message });
  }
};

const deleteProductHandler = async (req, res) => {
  try {
    const { branchId, productId } = req.query;

    if (!branchId || !productId) {
      return res.status(401).json({ message: "No Branch/Product ID provided" });
    }
    await deleteProduct(branchId, productId);
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

    await addPurchase(purchaseDetails, branchId, staffId, firebaseUid);
    return res.status(201).json({ message: "Success" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding purchase", error: error.message });
  }
};
module.exports = {
  addProductHandler,
  getProductsHandler,
  deleteProductHandler,
  updateProductHandler,
  addPurchaseHandler,
};
