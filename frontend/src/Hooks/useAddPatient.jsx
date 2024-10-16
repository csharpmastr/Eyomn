import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { addPatientService } from "../Service/PatientService";
import { addPatient } from "../Slice/PatientSlice";

export const useAddPatient = () => {
  const reduxDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cookies = new Cookies();
  const user = useSelector((state) => state.reducer.user.user);
  const accessToken = cookies.get("accessToken", { path: "/" });
  const refreshToken = cookies.get("refreshToken", { path: "/" });

  const addPatientHook = async (data, doctorId) => {
    setIsLoading(true);
    try {
      const response = await addPatientService(
        data,
        accessToken,
        refreshToken,
        user.organizationId,
        user.branchId,
        doctorId
      );

      reduxDispatch(
        addPatient({
          ...data,
          patientId: response.data.id,
          createdAt: response.data.createdAt,
        })
      );
      return response;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  return { addPatientHook, isLoading, error };
};
