import { useState } from "react";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { addStaff } from "../Slice/StaffSlice";
import { addStaffService } from "../Service/OrganizationService";

export const useAddStaff = () => {
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const accessToken = cookies.get("accessToken", { path: "/" });
  const refreshToken = cookies.get("refreshToken", { path: "/" });
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();
  const addStaffHook = async (staffData, branchId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await addStaffService(
        staffData,
        user.userId,
        branchId,
        accessToken,
        refreshToken,
        user.firebaseUid
      );
      return response;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  return { addStaffHook, isLoading, error };
};
