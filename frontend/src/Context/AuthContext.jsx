import React, { createContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

const isTokenExpired = (token) => {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return exp < currentTime;
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const cookies = new Cookies();
  useEffect(() => {
    const checkTokens = () => {
      const accessToken = cookies.get("accessToken");
      const refreshToken = cookies.get("refreshToken");

      if (!accessToken || !refreshToken) {
        dispatch({ type: "LOGOUT" });
        cookies.remove("accessToken", { path: "/" });
        cookies.remove("refreshToken", { path: "/" });
        return;
      }

      const accessTokenExpired = isTokenExpired(accessToken);
      const refreshTokenExpired = isTokenExpired(refreshToken);

      if (accessTokenExpired || refreshTokenExpired) {
        dispatch({ type: "LOGOUT" });
        cookies.remove("accessToken", { path: "/" });
        cookies.remove("refreshToken", { path: "/" });
      } else {
        const user = jwtDecode(accessToken);

        dispatch({ type: "LOGIN", payload: user });
      }
    };

    checkTokens();

    const intervalId = setInterval(checkTokens, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
