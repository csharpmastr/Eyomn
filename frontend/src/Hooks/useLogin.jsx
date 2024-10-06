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
  const cookies = new Cookies();
  const { dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const reduxDispatch = useDispatch();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userLogin(email, password);
      console.log(response);

      const {
        userId,
        role,
        tokens,
        organizationId,
        organization,
        branch,
        branchData,
        patients,
        staffData,
        doctors,
      } = response;
      const { accessToken, refreshToken } = tokens;

      dispatch({ type: "LOGIN", payload: userId });
      cookies.set("accessToken", accessToken, { path: "/" });
      cookies.set("refreshToken", refreshToken, { path: "/" });

      if (role === "0") {
        const resPatients = branch.flatMap((branch) => branch.patients);
        const resBranch = branch.map(({ branchId, name, location, email }) => ({
          branchId,
          name,
          location,
          email,
        }));
        const resStaffs = branch.flatMap((branch) => branch.staffs);

        reduxDispatch(setUser({ userId, organization, role }));
        reduxDispatch(setPatients(resPatients));
        reduxDispatch(setStaffs(resStaffs));
        reduxDispatch(setBranch(resBranch));
      } else if (role === "1") {
        const name = branchData.name;
        const email = branchData.email;
        const location = branchData.location;

        reduxDispatch(
          setUser({ userId, organization, role, name, email, location })
        );
        reduxDispatch(setPatients(patients));
      } else {
        const first_name = staffData.first_name;
        const last_name = staffData.last_name;
        const email = staffData.email;
        const location = staffData.location;
        const branchId = staffData.branchId;
        const position = staffData.position;
        reduxDispatch(
          setUser({
            userId,
            organization,
            role,
            first_name,
            last_name,
            email,
            location,
            organizationId,
            branchId,
            position,
          })
        );
        reduxDispatch(setPatients(patients));
        reduxDispatch(setDoctor(doctors));
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
