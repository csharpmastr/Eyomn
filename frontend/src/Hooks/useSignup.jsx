import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { userSignUp } from "../Service/UserService";
import Cookies from "universal-cookie";

const useSignup = () => {
  const { dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cookies = new Cookies();

  const signup = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userSignUp(data);
      const userData = response.data;
      console.log(userData);

      const userId = userData.userId;
      const accessToken = userData.token.accessToken;
      const refreshToken = userData.token.refreshToken;
      cookies.set("accessToken", accessToken, { path: "/" });
      cookies.set("refreshToken", refreshToken, { path: "/" });
      cookies.set("selectedTab", "dashboard");

      dispatch({ type: "LOGIN", payload: userId });

      return true;
    } catch (err) {
      // Handle errors by setting the error state
      setError(err.response?.data?.error || "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};

export default useSignup;
