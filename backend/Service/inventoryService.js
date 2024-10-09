const { v4: uuid } = require("uuid");
const { inventoryCollection } = require("../Config/FirebaseConfig");
const { encryptDocument } = require("../Helper/Helper");

const addProduct = async (branchId, productDetails) => {
  try {
    const productId = uuid();

    const inventoryRef = inventoryCollection;
    const productRef = inventoryRef.doc(productId);

    const encryptedProduct = encryptDocument(productDetails, [
      "quantity",
      "price",
      "expirationDate",
    ]);

    await productRef.set({ ...encryptDocument, productId });
    return productId;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

module.exports = {
  addProduct,
};
