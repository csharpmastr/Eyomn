import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearPatients } from "../Slice/PatientSlice";
import { clearDoctor } from "../Slice/doctorSlice";
import { useDispatch } from "react-redux";
import { clearStaffs } from "../Slice/StaffSlice";
import { removeUser } from "../Slice/UserSlice";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      navigate("/");
      cookies.remove("accessToken", { path: "/" });
      cookies.remove("refreshToken", { path: "/" });
      cookies.remove("organization", { path: "/" });
      cookies.remove("role", { path: "/" });
      dispatch({ type: "LOGOUT" });
      reduxDispatch(clearDoctor());
      reduxDispatch(clearPatients());
      reduxDispatch(clearStaffs());
      reduxDispatch(removeUser());

      sessionStorage.removeItem("selectedTab");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during logout.");
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};

export default useLogout;
