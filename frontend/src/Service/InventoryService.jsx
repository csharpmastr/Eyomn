import axios from "axios";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";

const INVENTORY_API_BASE_URL = "http://localhost:3000/api/v1/inventory";

const cookies = new Cookies();
const accessToken = cookies.get("accessToken", { path: "/" });
const refreshToken = cookies.get("refreshToken", { path: "/" });

export const addProductService = async (
  branchId,
  productDetails,
  firebaseUid
) => {
  try {
    const response = await axios.post(
      `${INVENTORY_API_BASE_URL}/add/${branchId}`,
      productDetails,
      {
        withCredentials: true,
        params: {
          firebaseUid,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const getBranchInventory = async (branchId, firebaseUid) => {
  try {
    const response = await axios.get(
      `${INVENTORY_API_BASE_URL}/get-branch-inventory`,
      {
        params: {
          branchId,
          firebaseUid,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting products : ", error);
    throw error;
  }
};

export const deleteProduct = async (
  branchId,
  productId,
  isDeleted,
  firebaseUid
) => {
  try {
    const response = await axios.patch(
      `${INVENTORY_API_BASE_URL}/delete`,
      isDeleted,
      {
        params: {
          branchId,
          productId,
          firebaseUid,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error deleting product : ", error);
    throw error;
  }
};

export const updateProductService = async (
  branchId,
  productId,
  productDetails
) => {
  try {
    const response = await axios.put(
      `${INVENTORY_API_BASE_URL}/update/${branchId}/${productId}`,
      productDetails,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating product : ", error);
    throw error;
  }
};

export const addPurchaseService = async (
  data,
  doctorId = null,
  staffId,
  branchId,
  firebaseUid,
  patientId = null
) => {
  try {
    const url = patientId
      ? `${INVENTORY_API_BASE_URL}/add-purchase/${patientId}`
      : `${INVENTORY_API_BASE_URL}/add-purchase`;

    const params = {
      branchId,
      firebaseUid,
      staffId,
      ...(doctorId && { doctorId }),
    };

    const response = await axios.post(url, data, {
      params,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding purchase:", error);
    throw error;
  }
};

export const getPurchases = async (branchId, firebaseUid) => {
  try {
    const response = await axios.get(
      `${INVENTORY_API_BASE_URL}/get-purchases`,
      {
        params: {
          branchId,
          firebaseUid,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting purchases : ", error);
    throw error;
  }
};

export const getInventory = async (organizationId, firebaseUid) => {
  try {
    const response = await axios.get(
      `${INVENTORY_API_BASE_URL}/get-inventory`,
      {
        params: {
          firebaseUid,
          organizationId,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting organization products and sales : ", error);
    throw error;
  }
};

export const retrieveProductService = async (
  branchId,
  products,
  firebaseUid
) => {
  try {
    const response = await axios.patch(
      `${INVENTORY_API_BASE_URL}/retrieve-product/${branchId}`,
      { products },
      {
        params: {
          firebaseUid,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving product: ", error);
    throw error;
  }
};
export const addService = async (
  branchId,
  doctorId,
  patientId,
  serviceDetails,
  firebaseUid
) => {
  try {
    const response = await axios.post(
      `${INVENTORY_API_BASE_URL}/add-service/${branchId}`,
      serviceDetails,
      {
        params: {
          firebaseUid,
          patientId,
          doctorId,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding service fee: ", error);
    throw error;
  }
};

export const getPatientProductServiceAvail = async (
  branchId,
  patientId,
  firebaseUid
) => {
  try {
    const response = await axios.get(
      `${INVENTORY_API_BASE_URL}/get-patient-avail`,
      {
        params: {
          branchId,
          firebaseUid,
          patientId,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error patient products and services avail: ", error);
    throw error;
  }
};
