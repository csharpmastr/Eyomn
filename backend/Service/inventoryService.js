const { v4: uuid } = require("uuid");
const { inventoryCollection } = require("../Config/FirebaseConfig");
const { encryptDocument, removeNullValues } = require("../Helper/Helper");

const addProduct = async (branchId, productDetails) => {
  try {
    const productId = uuid();

    const inventoryRef = inventoryCollection;
    const productRef = inventoryRef
      .doc(branchId)
      .collection("products")
      .doc(productId);
    productDetails = removeNullValues(productDetails);
    console.log(productDetails);

    const encryptedProduct = encryptDocument(productDetails, [
      "quantity",
      "price",
      "expirationDate",
    ]);

    await productRef.set({ ...encryptedProduct, productId });
    return productId;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

module.exports = {
  addProduct,
};
