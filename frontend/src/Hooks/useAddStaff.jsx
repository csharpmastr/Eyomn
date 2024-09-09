import { useState } from "react";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { addStaff } from "../Slice/StaffSlice";
import { addStaffService } from "../Service/StaffService";

export const useAddStaff = () => {
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const accessToken = cookies.get("accessToken", { path: "/" });
  const refreshToken = cookies.get("refreshToken", { path: "/" });
  const reduxDispatch = useDispatch();
  const addStaffHook = async (staffData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await addStaffService(
        staffData,
        accessToken,
        refreshToken
      );
      reduxDispatch(addStaff(staffData));
      return response;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  return { addStaffHook, isLoading, error };
};
