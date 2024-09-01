import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cookies = new Cookies();
  const navigate = useNavigate();

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      navigate("/");
      cookies.remove("accessToken", { path: "/" });
      cookies.remove("refreshToken", { path: "/" });
      dispatch({ type: "LOGOUT" });
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
