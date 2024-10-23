const admin = require("firebase-admin");
const { v4: uuid } = require("uuid");
const { inventoryCollection, db } = require("../Config/FirebaseConfig");
const {
  encryptDocument,
  removeNullValues,
  decryptDocument,
  generateUniqueId,
} = require("../Helper/Helper");
const { decryptData } = require("../Security/DataHashing");

const generateSKU = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let sku = "";
  for (let i = 0; i < 8; i++) {
    sku += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return sku;
};

const addProduct = async (branchId, productDetails, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }

    const inventoryRef = inventoryCollection;
    const productsCollectionRef = inventoryRef
      .doc(branchId)
      .collection("products");

    const querySnapshot = await productsCollectionRef.get();

    let productExists = false;
    querySnapshot.forEach((doc) => {
      const productData = doc.data();

      if (productData.product_name) {
        const decryptedProductName = decryptData(productData.product_name);
        const decryptedProductBrand = decryptData(productData.brand);
        if (
          decryptedProductName === productDetails.product_name &&
          decryptedProductBrand === productDetails.brand
        ) {
          productExists = true;
        }
      }
    });

    if (productExists) {
      throw { status: 400, message: "The product already exists." };
    }

    const productId = await generateUniqueId(productsCollectionRef);
    const productSKU = generateSKU();
    const productRef = productsCollectionRef.doc(productId);
    productDetails = removeNullValues(productDetails);
    console.log(productDetails);

    const encryptedProduct = encryptDocument(productDetails, [
      "quantity",
      "price",
      "expirationDate",
    ]);

    await productRef.set({ ...encryptedProduct, productId, productSKU });
    return { productId, productSKU };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

const getProducts = async (branchId, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }
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
        "productSKU",
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
    const productsCollectionRef = inventoryCollection
      .doc(branchId)
      .collection("products");

    const querySnapshot = await productsCollectionRef.get();
    let productExists = false;

    querySnapshot.forEach((doc) => {
      const productData = doc.data();

      if (doc.id !== productId && productData.product_name) {
        const decryptedProductName = decryptData(productData.product_name);
        const decryptedProductBrand = decryptData(productData.brand);

        if (
          decryptedProductName === productDetails.product_name &&
          decryptedProductBrand === productDetails.brand
        ) {
          productExists = true;
        }
      }
    });

    if (productExists) {
      throw {
        status: 400,
        message: "Another product with the same name and brand already exists.",
      };
    }

    const productRef = productsCollectionRef.doc(productId);

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
    console.log("Product updated successfully");
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
};

const addPurchase = async (purchaseDetails, branchId, staffId, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }

    const currentDate = new Date();
    const purchaseCollectionRef = inventoryCollection
      .doc(branchId)
      .collection("purchases");
    const productsCollectionRef = inventoryCollection
      .doc(branchId)
      .collection("products");

    const purchaseId = await generateUniqueId(purchaseCollectionRef);
    const purchaseRef = purchaseCollectionRef.doc(purchaseId);

    //batch read
    await db.runTransaction(async (transaction) => {
      const productDocs = await Promise.all(
        purchaseDetails.map(async (product) => {
          const productRef = productsCollectionRef.doc(product.productId);
          const productDoc = await transaction.get(productRef);

          if (!productDoc.exists) {
            throw {
              status: 404,
              message: `Product not found: ${product.productId}`,
            };
          }

          const productData = productDoc.data();
          const decryptedProductData = decryptDocument(productData, [
            "quantity",
            "expirationDate",
            "price",
            "productSKU",
            "productId",
          ]);

          if (decryptedProductData.quantity < product.quantity) {
            throw {
              status: 400,
              message: `Insufficient stock for product: ${product.productId}`,
            };
          }

          return {
            productRef,
            decryptedProductData,
            requestedQuantity: product.quantity,
          };
        })
      );

      // proceed with the writes
      // create purchase record
      transaction.set(purchaseRef, {
        staffId,
        purchaseDetails,
        createdAt: currentDate.toISOString(),
      });

      // update product stock each product
      productDocs.forEach(
        ({ productRef, decryptedProductData, requestedQuantity }) => {
          const updatedQuantity =
            decryptedProductData.quantity - requestedQuantity;

          const updatedProductData = encryptDocument(
            { ...decryptedProductData, quantity: updatedQuantity },
            ["quantity", "expirationDate", "price", "productSKU", "productId"]
          );

          transaction.update(productRef, updatedProductData);
        }
      );
    });

    console.log("Purchase and stock updates successful.");
  } catch (error) {
    console.error("Error during purchase:", error);
    throw error;
  }
};

module.exports = {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  addPurchase,
};
