import { useState } from "react";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { addPurchaseService } from "../Service/InventoryService";
import { purchaseProduct, updateProduct } from "../Slice/InventorySlice";

export const useAddPurchase = () => {
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const accessToken = cookies.get("accessToken", { path: "/" });
  const refreshToken = cookies.get("refreshToken", { path: "/" });
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();

  const addPurchaseHook = async (purchaseDetails, branchId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await addPurchaseService(
        purchaseDetails,
        branchId,
        user.userId,
        user.firebaseUid,
        accessToken,
        refreshToken
      );

      if (response) {
        purchaseDetails.forEach((product) => {
          reduxDispatch(
            purchaseProduct({
              productId: product.productId,
              quantity: product.quantity,
            })
          );
        });
      }
      console.log(response);

      return response;
    } catch (err) {
      setError(err?.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return { addPurchaseHook, isLoading, error };
};
