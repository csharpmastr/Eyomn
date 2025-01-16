import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { addPatientService } from "../Service/PatientService";
import { addPatient } from "../Slice/PatientSlice";

export const useAddPatient = () => {
  const reduxDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.reducer.user.user);
  const [isSuccess, setIsSuccess] = useState(false);

  const addPatientHook = async (data, doctorId, branchId) => {
    setIsLoading(true);
    try {
      const response = await addPatientService(
        data,
        user.organizationId,
        branchId,
        doctorId,
        user.firebaseUid
      );

      if (response) {
        setIsSuccess(true);
        reduxDispatch(
          addPatient({
            ...data,
            branchId: branchId,
            doctorId: doctorId,
            patientId: response.data.id,
            createdAt: response.data.createdAt,
          })
        );
        return response;
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { addPatientHook, isLoading, error, isSuccess };
};
