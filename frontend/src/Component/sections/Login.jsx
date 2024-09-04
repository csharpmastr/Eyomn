import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SubmitButton from "../ui/SubmitButton";
import { useLogin } from "../../Hooks/useLogin";

const Login = () => {
  const { login, isLoading, error } = useLogin();
  const [isVisible, setIsvisible] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(userData.email, userData.password);
      if (response) {
        if (response.role === "0") {
          sessionStorage.setItem("selectedTab", "dashboard");
          navigate("/dashboard");
        } else {
          sessionStorage.setItem("selectedTab", "scan");
          navigate("/scan");
        }
      } else {
        setIsvisible(true);
        console.log("Login failed");
      }
    } catch (err) {
      console.log("Failed to log in:", err);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col h-auto w-[80vw] border-2 border-[#c8c8c8] rounded-lg md:w-[50vw] lg:w-[50vw] xl:w-[30vw] pt-4 pb-4">
      <div className="text-center">
        <h1 className="text-[26px] font-Poppins font-semibold">Eyomn</h1>
        <p className="font-Poppins text-[14px]">
          Smart Solutions for Better Healthcare
        </p>
      </div>
      <form onSubmit={handleSubmit} className="w-full p-4">
        <h2 className="font-Poppins text-[20px] text-left mb-4">Login</h2>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            className="w-full p-2 rounded-md border-2 border-[#C8C8C8] font-Poppins"
            placeholder="Enter your email"
            value={userData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            className="w-full p-2 rounded-md border-2 border-[#C8C8C8] font-Poppins"
            placeholder="Enter your password"
            value={userData.password}
            onChange={handleChange}
          />
          {isVisible ? (
            <label className="font-Poppins text-[14px] text-red-500">
              Invalid Credentials
            </label>
          ) : (
            ""
          )}
          <SubmitButton value={"Login"} disabled={isLoading} />
        </div>
        <p className="font-Poppins text-[14px] text-center mt-5">
          Don't have an account? <Link to={"/signup"}>Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
