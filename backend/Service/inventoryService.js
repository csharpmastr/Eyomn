const { v4: uuid } = require("uuid");
const { inventoryCollection } = require("../Config/FirebaseConfig");
const {
  encryptDocument,
  removeNullValues,
  decryptDocument,
} = require("../Helper/Helper");

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

const getProducts = async (branchId) => {
  try {
    const productRef = inventoryCollection.doc(branchId).collection("products");
    const snapshot = await productRef.get();

    if (snapshot.empty) {
      console.log("No products found for this branch.");
      return [];
    }

    const products = snapshot.docs.map((doc) => {
      console.log(doc.data());

      const decryptedData = decryptDocument(doc.data(), [
        "product",
        "productId",
        "expirationDate",
        "price",
        "quantity",
      ]);
      return {
        ...decryptedData,
      };
    });

    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw error;
  }
};

const deleteProduct = async (branchId, productId) => {
  try {
    const productRef = inventoryCollection
      .doc(branchId)
      .collection("products")
      .doc(productId);

    const docSnapshot = await productRef.get();
    if (!docSnapshot.exists) {
      throw new Error("Document does not exist");
    }
    await productRef.delete();
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
};
const updateProduct = async (branchId, productId, productDetails) => {
  try {
    const productRef = inventoryCollection
      .doc(branchId)
      .collection("products")
      .doc(productId);

    const docSnapshot = await productRef.get();
    if (!docSnapshot.exists) {
      throw new Error("Document does not exist");
    }
    const encryptedProductDetails = encryptDocument(productDetails, [
      "price",
      "quantity",
      "expirationDate",
    ]);

    await productRef.update(encryptedProductDetails);
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
};

module.exports = {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
};
