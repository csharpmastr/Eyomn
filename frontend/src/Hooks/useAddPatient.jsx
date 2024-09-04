import { useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { addPatientService } from "../Service/PatientService";
import { addPatient } from "../Slice/PatientSlice";

export const useAddPatient = () => {
  const reduxDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cookies = new Cookies();

  const accessToken = cookies.get("accessToken", { path: "/" });
  const refreshToken = cookies.get("refreshToken", { path: "/" });

  const addPatientHook = async (data) => {
    setIsLoading(true);
    try {
      const response = await addPatientService(data, accessToken, refreshToken);
      reduxDispatch(addPatient(data));
      return response;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  return { addPatientHook, isLoading, error };
};
