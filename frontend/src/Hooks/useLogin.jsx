import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { userLogin } from "../Service/UserService";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { setDoctor } from "../Slice/doctorSlice";
import { getDoctorList, getStaffs } from "../Service/StaffService";
import { setStaffs } from "../Slice/StaffSlice";
import { setUser } from "../Slice/UserSlice";
import { getPatients, getPatientsByDoctor } from "../Service/PatientService";
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
      const { userId, role, tokens, organization, staffData, clinicId } =
        response;

      const { accessToken, refreshToken } = tokens;

      let staffResponse = [];
      let doctorList = [];
      let patientByDoctorList = [];
      let patients = [];
      if (role === "0") {
        staffResponse = await getStaffs(userId, accessToken, refreshToken);
        patients = await getPatients(userId, accessToken, refreshToken);
      } else if (role === "1") {
        const patientByDoctorResponse = await getPatientsByDoctor(
          clinicId,
          userId,
          accessToken,
          refreshToken
        );
        patientByDoctorList = patientByDoctorResponse;
      } else if (role === "2") {
        const doctorResponse = await getDoctorList(
          clinicId,
          userId,
          accessToken,
          refreshToken
        );
        doctorList = doctorResponse.doctors || [];
      }

      cookies.set("accessToken", accessToken, { path: "/" });
      cookies.set("refreshToken", refreshToken, { path: "/" });

      dispatch({ type: "LOGIN", payload: userId });

      reduxDispatch(setUser({ userId }));
      if (role === "0") {
        reduxDispatch(setUser({ userId, organization, role }));
        reduxDispatch(setStaffs(staffResponse || []));
        reduxDispatch(setPatients(patients || []));
      } else {
        reduxDispatch(setUser({ userId, clinicId, organization, role }));
        if (role === "1") {
          reduxDispatch(setDoctor(staffData));
        } else {
          reduxDispatch(setDoctor(doctorList));
        }
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
