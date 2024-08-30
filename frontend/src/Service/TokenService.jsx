import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
    s;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};
