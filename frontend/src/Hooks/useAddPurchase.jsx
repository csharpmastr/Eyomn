import { useState } from "react";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { addPurchaseService } from "../Service/InventoryService";
import { purchaseProduct, updateProduct } from "../Slice/InventorySlice";

export const useAddPurchase = () => {
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();

  const addPurchaseHook = async (
    data,
    doctorId,
    staffId,
    branchId,
    patientId
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await addPurchaseService(
        data,
        doctorId,
        staffId,
        branchId,
        user.firebaseUid,
        patientId
      );

      if (response) {
        data.purchaseDetails.forEach((product) => {
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
