import React, { createContext, useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isSessionExpired: false };
    case "LOGOUT":
      return { user: null, isSessionExpired: false };
    case "SESSION_EXPIRED":
      return { ...state, isSessionExpired: true };
    default:
      return state;
  }
};

const SessionExpiredModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[380px] md:w-[450px] bg-white font-Poppins text-center rounded-md">
        <div className="flex flex-col items-center gap-3 p-8 ">
          <h2 className="text-h-h4">Session Expired</h2>
          <p>Your session has expired. Please log in again.</p>
          <button
            onClick={onClose}
            className="p-4 w-36 px-4 py-2 bg-c-secondary text-f-light text-p-rg font-medium rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const isTokenExpired = (token) => {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return exp < currentTime;
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isSessionExpired: false,
  });
  const cookies = new Cookies();

  useEffect(() => {
    const checkTokens = () => {
      const accessToken = cookies.get("accessToken");
      const refreshToken = cookies.get("refreshToken");
      if (!accessToken || !refreshToken) {
        return;
      }
      const accessTokenExpired = isTokenExpired(accessToken);
      const refreshTokenExpired = isTokenExpired(refreshToken);

      if (accessTokenExpired || refreshTokenExpired) {
        dispatch({ type: "SESSION_EXPIRED" });
      } else {
        const user = jwtDecode(accessToken);
        dispatch({ type: "LOGIN", payload: user });
      }
    };

    checkTokens();

    const intervalId = setInterval(checkTokens, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });
    dispatch({ type: "LOGOUT" });
  };
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}

      <SessionExpiredModal
        isVisible={state.isSessionExpired}
        onClose={handleLogout}
      />
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
