import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { userLogin } from "../Service/UserService";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { setDoctor } from "../Slice/doctorSlice";
import { setStaffs } from "../Slice/StaffSlice";
import { setUser } from "../Slice/UserSlice";
import { setPatients } from "../Slice/PatientSlice";
import { setBranch } from "../Slice/BranchSlice";

export const useLogin = () => {
  const { dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const reduxDispatch = useDispatch();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userLogin(email, password);

      const {
        userId,
        role,
        organizationId,
        organization,
        staffData,
        branchData,
        firebaseUid,
      } = response;

      dispatch({ type: "LOGIN", payload: userId });

      if (role === "0") {
        reduxDispatch(setUser({ userId, organization, role, firebaseUid }));
      } else if (role === "1") {
        const name = branchData.name;
        const email = branchData.email;
        const municipality = branchData.municipality;
        const province = branchData.province;

        reduxDispatch(
          setUser({
            userId,
            organization,
            role,
            name,
            email,
            municipality,
            province,
            organizationId,
            firebaseUid,
          })
        );
      } else {
        const { schedule, ...restOfStaffData } = staffData;

        reduxDispatch(
          setUser({
            ...restOfStaffData,
            userId,
            organization,
          })
        );
      }
      return response;
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
