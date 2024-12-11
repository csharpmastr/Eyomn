const admin = require("firebase-admin");
const { v4: uuid } = require("uuid");
const {
  inventoryCollection,
  db,
  organizationCollection,
} = require("../Config/FirebaseConfig");
const {
  encryptDocument,
  removeNullValues,
  decryptDocument,
  generateUniqueId,
  verifyFirebaseUid,
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
    await verifyFirebaseUid(firebaseUid);

    const inventoryRef = inventoryCollection;
    const productsCollectionRef = inventoryRef
      .doc(branchId)
      .collection("products");

    const querySnapshot = await productsCollectionRef.get();

    let productExists = false;
    for (const doc of querySnapshot.docs) {
      const productData = doc.data();

      if (productData.product_name) {
        const decryptedProductName = decryptData(productData.product_name);
        const decryptedProductBrand = decryptData(productData.brand);
        if (
          decryptedProductName === productDetails.product_name &&
          decryptedProductBrand === productDetails.brand
        ) {
          productExists = true;
          break;
        }
      }
    }

    if (productExists) {
      throw { status: 400, message: "The product already exists." };
    }

    const productId = await generateUniqueId(productsCollectionRef);
    const productSKU = generateSKU();
    const productRef = productsCollectionRef.doc(productId);
    productDetails = removeNullValues(productDetails);

    productDetails.isDeleted = false;
    const encryptedProduct = encryptDocument(productDetails, [
      "quantity",
      "price",
      "expirationDate",
      "isDeleted",
      "retail_price",
    ]);

    await productRef.set({ ...encryptedProduct, productId, productSKU });
    return { productId, productSKU };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

const deleteProduct = async (branchId, productId, isDeleted) => {
  try {
    const productRef = inventoryCollection
      .doc(branchId)
      .collection("products")
      .doc(productId);

    const docSnapshot = await productRef.get();
    if (!docSnapshot.exists) {
      throw new Error("Document does not exist");
    }

    await productRef.update({
      isDeleted,
    });
  } catch (error) {
    console.error("Error marking product as deleted: ", error);
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
      "retail_price",
      "isDeleted",
    ]);

    await productRef.update(encryptedProductDetails);
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
};

const addPurchase = async (
  purchaseDetails,
  serviceDetails,
  branchId,
  staffId,
  firebaseUid,
  doctorId,
  patientId
) => {
  try {
    console.log(purchaseDetails, serviceDetails);

    // Verify Firebase UID
    await verifyFirebaseUid(firebaseUid);

    // Ensure at least one of the inputs is provided
    if (!purchaseDetails?.length && !serviceDetails) {
      throw {
        status: 400,
        message: "No purchase details or service details provided.",
      };
    }

    const currentDate = new Date();
    const createdAt = currentDate.toISOString();

    const purchaseCollectionRef = inventoryCollection
      .doc(branchId)
      .collection("purchases");
    const productsCollectionRef = inventoryCollection
      .doc(branchId)
      .collection("products");

    const purchaseId = await generateUniqueId(purchaseCollectionRef);
    const purchaseRef = purchaseCollectionRef.doc(purchaseId);

    let serviceId;
    // Perform Firestore transaction
    await db.runTransaction(async (transaction) => {
      // Handle products if `purchaseDetails` is provided
      if (purchaseDetails?.length > 0) {
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
              "isDeleted",
              "retail_price",
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

        // Update stock for each product
        productDocs.forEach(
          ({ productRef, decryptedProductData, requestedQuantity }) => {
            const updatedQuantity =
              decryptedProductData.quantity - requestedQuantity;

            const updatedProductData = encryptDocument(
              { ...decryptedProductData, quantity: updatedQuantity },
              [
                "quantity",
                "expirationDate",
                "price",
                "productSKU",
                "productId",
                "isDeleted",
                "retail_price",
              ]
            );

            transaction.update(productRef, updatedProductData);
          }
        );

        // Create purchase record
        const purchaseData = {
          staffId,
          purchaseDetails,
          createdAt,
        };

        if (patientId) purchaseData.patientId = patientId;

        transaction.set(purchaseRef, purchaseData);
      }

      // Handle service if `serviceDetails` is provided
      if (serviceDetails && Object.keys(serviceDetails).length > 0) {
        const servicesColRef = inventoryCollection
          .doc(branchId)
          .collection("services");

        serviceId = await generateUniqueId(servicesColRef);

        const serviceDataWithTimestamp = {
          ...serviceDetails,
          createdAt,
        };

        if (doctorId) serviceDataWithTimestamp.doctorId = doctorId;
        if (patientId) serviceDataWithTimestamp.patientId = patientId;

        const encryptedServiceData = encryptDocument(serviceDataWithTimestamp, [
          "service_price",
          "date",
          "createdAt",
          "doctorId",
          "patientId",
        ]);

        transaction.set(servicesColRef.doc(serviceId), encryptedServiceData);
      }
    });

    console.log(purchaseId, serviceId);

    return { purchaseId, serviceId, createdAt };
  } catch (error) {
    console.error("Error during purchase:", error);
    throw error;
  }
};

const getBranchInventory = async (branchId, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const servicesRef = inventoryCollection
      .doc(branchId)
      .collection("services");
    const purchasesRef = inventoryCollection
      .doc(branchId)
      .collection("purchases");
    const productsRef = inventoryCollection
      .doc(branchId)
      .collection("products");

    const [servicesSnap, purchasesSnap, productsSnap] = await Promise.all([
      servicesRef.get(),
      purchasesRef.get(),
      productsRef.get(),
    ]);

    const services = servicesSnap.empty
      ? []
      : servicesSnap.docs.map((doc) => {
          const serviceData = doc.data();

          const decryptedServiceData = decryptDocument(serviceData, [
            "service_price",
            "date",
            "createdAt",
            "doctorId",
            "patientId",
          ]);

          return {
            id: doc.id,
            ...decryptedServiceData,
          };
        });

    const purchases = purchasesSnap.empty
      ? []
      : purchasesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

    const products = productsSnap.empty
      ? []
      : productsSnap.docs.map((doc) => {
          const productData = doc.data();

          const decryptedProductData = decryptDocument(productData, [
            "product",
            "productId",
            "expirationDate",
            "productSKU",
            "price",
            "quantity",
            "isDeleted",
            "retail_price",
          ]);

          return {
            id: doc.id,
            ...decryptedProductData,
          };
        });

    return { services, purchases, products };
  } catch (error) {
    console.error("Error retrieving branch inventory:", error);
    throw {
      status: error.status || 500,
      message:
        error.message || "An error occurred while fetching branch inventory.",
    };
  }
};

const getOrgProductSalesWithServices = async (organizationId, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const orgDoc = await organizationCollection.doc(organizationId).get();
    if (!orgDoc.exists) {
      throw { status: 404, message: "Organization not found." };
    }

    const orgData = orgDoc.data();
    const inventoryData = {};

    const branchPromises = orgData.branch.map(async (branchId) => {
      try {
        const [salesSnapshot, productsSnapshot, services] = await Promise.all([
          inventoryCollection.doc(branchId).collection("purchases").get(),
          inventoryCollection.doc(branchId).collection("products").get(),
          getServiceFees(branchId, firebaseUid),
        ]);

        const sales = salesSnapshot.docs.map((doc) => doc.data());
        const products = productsSnapshot.docs.map((doc) => {
          const productData = doc.data();
          return decryptDocument(productData, [
            "expirationDate",
            "price",
            "quantity",
            "productId",
            "productSKU",
            "isDeleted",
            "retail_price",
          ]);
        });

        inventoryData[branchId] = {
          purchases: sales,
          products: products,
          services: services,
        };
      } catch (branchError) {
        console.error(
          `Error fetching data for branch ${branchId}:`,
          branchError
        );
      }
    });

    await Promise.all(branchPromises);

    return inventoryData;
  } catch (error) {
    console.error(
      "Error fetching organization product sales with services:",
      error
    );
    throw new Error(
      "Error fetching product sales and services data: " + error.message
    );
  }
};

const retrieveProduct = async (branchId, products, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const productRef = inventoryCollection.doc(branchId).collection("products");

    await Promise.all(
      products.map(async (productId) => {
        const productDocRef = productRef.doc(productId);

        await productDocRef.update({ isDeleted: false });
      })
    );
  } catch (error) {
    console.error("Error retrieving product:", error);
    throw new Error("Error retrieving product: " + error.message);
  }
};

const addServiceFee = async (
  branchId,
  doctorId,
  patientId,
  serviceDetails,
  firebaseUid
) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const currentDate = new Date();
    const servicesColRef = inventoryCollection
      .doc(branchId)
      .collection("services");

    const serviceId = await generateUniqueId(servicesColRef);

    const serviceDataWithTimestamp = {
      ...serviceDetails,
      createdAt: currentDate.toISOString(),
      doctorId: doctorId,
      patientId: patientId,
    };

    const encryptedServiceData = encryptDocument(serviceDataWithTimestamp, [
      "service_price",
      "date",
      "createdAt",
      "doctorId",
      "patientId",
    ]);

    await servicesColRef.doc(serviceId).set(encryptedServiceData);

    return serviceId;
  } catch (error) {
    console.error("Error adding service fee:", error);
  }
};
const getServiceFees = async (branchId, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const servicesRef = inventoryCollection
      .doc(branchId)
      .collection("services");

    const servicesSnap = await servicesRef.get();

    if (servicesSnap.empty) {
      console.log("No service fees found.");
      return [];
    }

    const services = servicesSnap.docs.map((doc) => {
      const serviceData = doc.data();

      const decryptedServiceData = decryptDocument(serviceData, [
        "service_price",
        "date",
        "createdAt",
        "doctorId",
        "patientId",
      ]);

      return {
        id: doc.id,
        ...decryptedServiceData,
      };
    });

    return services;
  } catch (error) {
    console.error("Error retrieving service fees:", error);
    throw error;
  }
};
const getPatientProductServicesAvail = async (
  branchId,
  patientId,
  firebaseUid
) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const purchasesRef = inventoryCollection
      .doc(branchId)
      .collection("purchases");
    const servicesRef = inventoryCollection
      .doc(branchId)
      .collection("services");

    const [purchasesSnapshot, servicesSnapshot] = await Promise.all([
      purchasesRef.where("patientId", "==", patientId).get(),
      servicesRef.where("patientId", "==", patientId).get(),
    ]);

    const purchasesData = purchasesSnapshot.empty
      ? []
      : purchasesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

    const servicesData = servicesSnapshot.empty
      ? []
      : servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...decryptDocument(doc.data(), [
            "createdAt",
            "date",
            "doctorId",
            "patientId",
            "service_price",
          ]),
        }));

    return {
      purchases: purchasesData,
      services: servicesData,
    };
  } catch (error) {
    console.error("Error fetching patient data:", error);
    throw new Error(
      "Unable to fetch patient product and service availability."
    );
  }
};

module.exports = {
  addProduct,

  deleteProduct,
  updateProduct,
  addPurchase,
  getBranchInventory,
  getOrgProductSalesWithServices,
  retrieveProduct,
  addServiceFee,
  getPatientProductServicesAvail,
};
