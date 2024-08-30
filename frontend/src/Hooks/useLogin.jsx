import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { userLogin } from "../Service/UserService";
import Cookies from "universal-cookie";

export const useLogin = () => {
  const cookies = new Cookies();
  const { dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userLogin(email, password);

      const userId = response.userId;
      const accessToken = response.tokens.accessToken;
      const refreshToken = response.tokens.refreshToken;

      cookies.set("accessToken", accessToken, { path: "/" });
      cookies.set("refreshToken", refreshToken, { path: "/" });
      dispatch({ type: "LOGIN", payload: userId });
      return response;
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};
