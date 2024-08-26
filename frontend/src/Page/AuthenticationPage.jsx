import React from "react";
import Signup from "../Component/sections/Signup";
import Login from "../Component/sections/Login";

const AuthenticationPage = ({ type }) => {
  return <div className="">{type === "signup" ? <Signup /> : <Login />}</div>;
};

export default AuthenticationPage;
