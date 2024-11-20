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
import { clearBranch } from "../Slice/BranchSlice";
import { clearAppointment } from "../Slice/AppointmentSlice";
import {
  clearProducts,
  clearPurchases,
  clearServices,
} from "../Slice/InventorySlice";
import { clearNotifications } from "../Slice/NotificationSlice";
import { clearVisits } from "../Slice/VisitSlice";
import {
  clearImages,
  clearMedicalScribeNotes,
  clearRawNotes,
} from "../Slice/NoteSlice";

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
      dispatch({ type: "LOGOUT" });
      sessionStorage.removeItem("selectedTab");
      localStorage.removeItem("hasFetched");
      cookies.remove("accessToken", { path: "/" });
      cookies.remove("refreshToken", { path: "/" });

      reduxDispatch(clearDoctor());
      reduxDispatch(clearPatients());
      reduxDispatch(clearStaffs());
      reduxDispatch(removeUser());
      reduxDispatch(clearBranch());
      reduxDispatch(clearAppointment());
      reduxDispatch(clearProducts());
      reduxDispatch(clearNotifications());
      reduxDispatch(clearVisits());
      reduxDispatch(clearRawNotes());
      reduxDispatch(clearMedicalScribeNotes());
      reduxDispatch(clearPurchases());
      reduxDispatch(clearBranch());
      reduxDispatch(clearImages());
      reduxDispatch(clearRawNotes());
      reduxDispatch(clearServices());
      reduxDispatch(clearMedicalScribeNotes());
      sessionStorage.removeItem("currentTab");
      sessionStorage.removeItem("medformData");
      sessionStorage.removeItem("currentPatientId");
      sessionStorage.removeItem("currentPath");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during logout.");
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};

export default useLogout;
