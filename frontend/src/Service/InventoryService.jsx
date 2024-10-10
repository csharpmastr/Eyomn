import axios from "axios";

const INVENTORY_API_BASE_URL = "http://localhost:3000/api/v1/inventory";

export const addProduct = async (
  branchId,
  productDetails,
  accessToken,
  refreshToken
) => {
  try {
    const response = await axios.post(
      `${INVENTORY_API_BASE_URL}/add-product/${branchId}`,
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
    console.error("Error adding product : ", err);
    throw err;
  }
};

export const getProducts = async (branchId, accessToken, refreshToken) => {
  try {
    const response = await axios.get(`${INVENTORY_API_BASE_URL}/get-products`, {
      params: {
        branchId,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting products : ", err);
    throw err;
  }
};
