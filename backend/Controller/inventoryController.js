const {
  addProduct,
  getProducts,
  deleteProduct,
} = require("../Service/inventoryService");

const addProductHandler = async (req, res) => {
  try {
    const branchId = req.params.branchId;
    const productDetails = req.body;
    if (!branchId) {
      return res.status(400).json({ message: "No Branch ID provided." });
    }

    const productId = await addProduct(branchId, productDetails);
    return res
      .status(200)
      .json({ message: "Product added successfully", productId: productId });
  } catch (error) {
    console.error("Error adding product: ", error);
    res
      .status(500)
      .json({ message: "Error adding product.", error: error.message });
  }
};

const getProductsHandler = async (req, res) => {
  try {
    const { branchId } = req.query;
    if (!branchId) {
      return res.status(400).json({ message: "No Branch ID provided" });
    }

    const products = await getProducts(branchId);

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
module.exports = {
  addProductHandler,
  getProductsHandler,
  deleteProductHandler,
};
