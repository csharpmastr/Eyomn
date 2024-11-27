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

// const SessionExpiredModal = ({ isVisible, onClose }) => {
//   if (!isVisible) return null;

//   return (
//     <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
//       <div className="w-[380px] md:w-[450px] bg-white font-Poppins text-center rounded-md">
//         <div className="flex flex-col items-center gap-3 p-8">
//           <h2 className="text-h-h4">Session Expired</h2>
//           <p>Your session has expired. Please log in again.</p>
//           <button
//             onClick={onClose}
//             className="p-4 w-36 px-4 py-2 bg-c-secondary text-f-light text-p-rg font-medium rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
//           >
//             OK
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isSessionExpired: false,
  });
  const cookies = new Cookies();

  useEffect(() => {
    const storedUser = cookies.get("user");
    if (storedUser) {
      dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
    }

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
          dispatch({ type: "SESSION_EXPIRED" });
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
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });
    cookies.remove("user", { path: "/" });
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
      {/* <SessionExpiredModal
        isVisible={state.isSessionExpired}
        onClose={handleLogout}
      /> */}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
