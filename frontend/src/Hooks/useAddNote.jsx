import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { addPatientNote } from "../Service/PatientService";

export const useAddNote = () => {
  const reduxDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cookies = new Cookies();
  const user = useSelector((state) => state.reducer.user.user);
  const accessToken = cookies.get("accessToken", { path: "/" });
  const refreshToken = cookies.get("refreshToken", { path: "/" });

  const addNote = async (note, patientId) => {
    setError(null);
    try {
      setIsLoading(true);
      const response = await addPatientNote(
        note,
        patientId,
        user.firebaseUid,
        accessToken,
        refreshToken
      );
      if (response) {
        return response;
      }
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  return { addNote, isLoading, error };
};
