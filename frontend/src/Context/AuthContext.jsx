import React, { createContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import Cookies from "universal-cookie";
import axios from "axios";

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

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isSessionExpired: false,
  });
  const cookies = new Cookies();

  useEffect(() => {
    const checkTokens = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/user/validate-and-refresh-tokens",
          {
            withCredentials: true,
          }
        );

        if (response.data.valid) {
          dispatch({ type: "LOGIN", payload: response.data.user });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.error("Error during session validation or refresh:", error);
        dispatch({ type: "SESSION_EXPIRED" });
      }
    };

    checkTokens();
    const intervalId = setInterval(checkTokens, 900000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, dispatch, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
