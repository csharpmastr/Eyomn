import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { userLogin } from "../Service/UserService";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { setDoctor } from "../Slice/doctorSlice";
import { getPatients } from "../Service/PatientService";
import { setPatients } from "../Slice/PatientSlice";

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
      const { userId, role, tokens, organization, staffData } = response;
      const { accessToken, refreshToken } = tokens;
      let patientsData = {};
      if (role === "0" || role === "1") {
        const clinicId = role === "0" ? userId : staffData.clinicId;
        patientsData = await getPatients({ clinicId });
      }

      cookies.set("accessToken", accessToken, { path: "/" });
      cookies.set("refreshToken", refreshToken, { path: "/" });
      cookies.set("role", role, { path: "/" });
      cookies.set("organization", organization, { path: "/" });
      dispatch({ type: "LOGIN", payload: userId });
      reduxDispatch(setDoctor(staffData));
      reduxDispatch(setPatients(patientsData));

      return response;
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};
