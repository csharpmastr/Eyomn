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
      const userRole = userData.role;
      const userId = userData.userId;
      const accessToken = userData.token.accessToken;
      const refreshToken = userData.token.refreshToken;
      const orgranization = userData.orgranization;
      cookies.set("accessToken", accessToken, { path: "/" });
      cookies.set("refreshToken", refreshToken, { path: "/" });
      cookies.set("selectedTab", "dashboard");
      cookies.set("role", userRole, { path: "/" });
      cookies.set("organization", orgranization, { path: "/" });
      dispatch({ type: "LOGIN", payload: { userId, orgranization } });

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
