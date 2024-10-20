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
  accessToken,
  refreshToken,
  firebaseUid
) => {
  try {
    const response = await axios.post(
      `${INVENTORY_API_BASE_URL}/add/${branchId}`,
      productDetails,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
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

export const getProducts = async (
  branchId,
  accessToken,
  refreshToken,
  firebaseUid
) => {
  try {
    const response = await axios.get(`${INVENTORY_API_BASE_URL}/get-products`, {
      params: {
        branchId,
        firebaseUid,
      },
      headers: {},
    });
    return response.data;
  } catch (error) {
    console.error("Error getting products : ", err);
    throw err;
  }
};

export const deleteProduct = async (branchId, productId, firebaseUid) => {
  try {
    const response = await axios.delete(`${INVENTORY_API_BASE_URL}/delete`, {
      params: {
        branchId,
        productId,
        firebaseUid,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting product : ", error);
    throw error;
  }
};

export const updateProductService = async (
  branchId,
  productId,
  productDetails,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.put(
      `${INVENTORY_API_BASE_URL}/update/${branchId}/${productId}`,
      productDetails,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating product : ", error);
    throw error;
  }
};
