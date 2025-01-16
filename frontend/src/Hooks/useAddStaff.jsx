import { useState } from "react";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { addStaff } from "../Slice/StaffSlice";
import { addStaffService } from "../Service/organizationService";

export const useAddStaff = () => {
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();
  const addStaffHook = async (staffData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await addStaffService(
        staffData,
        user.userId,
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
