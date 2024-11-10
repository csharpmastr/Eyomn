import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SubmitButton from "../ui/SubmitButton";
import { useLogin } from "../../Hooks/useLogin";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";

const Login = () => {
  const { login, isLoading, error } = useLogin();
  const [isVisible, setIsvisible] = useState(false);
  const [isPassVisible, setIsPassVisible] = useState(false);
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
    if (userData.email === "" || userData.password === "") {
      return;
    }
    try {
      const response = await login(userData.email, userData.password);
      console.log(response);

      if (response) {
        if (
          response.role === "0" ||
          response.role === "1" ||
          response.role === "3"
        ) {
          sessionStorage.setItem("selectedTab", "dashboard");
          navigate("/dashboard");
        } else if (response.role === "2") {
          sessionStorage.setItem("selectedTab", "dashboard");
          navigate("/dashboard");
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
    <div className="flex flex-col h-fit w-[80vw] xl:w-[560px] font-Raleway text-f-dark">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-h-h4 font-semibold -mb-2">Get Started</h1>
            <p className=" text-p-rg text-c-gray3">
              Back to work? Let's care for our patients together
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <section>
              <label className="text-p-rg font-medium">Email Address</label>
              <div className="relative">
                <MdOutlineEmail className="w-6 h-6 absolute top-5 left-4 text-c-gray3" />
                <input
                  type="email"
                  name="email"
                  className="mt-1 w-full pl-12 py-4 border border-c-gray3 font-medium rounded-md text-f-dark focus:outline-c-primary font-Poppins"
                  placeholder="Enter your email"
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>
            </section>
            <section>
              <label className="text-p-rg font-medium">Password</label>
              <div className="relative">
                <MdOutlineLock className="w-6 h-6 absolute top-5 left-4 text-c-gray3" />
                <input
                  type={isPassVisible ? "text" : "password"}
                  name="password"
                  className="mt-1 w-full pl-12 py-4 border border-c-gray3 font-medium rounded-md text-f-dark focus:outline-c-primary font-Poppins"
                  placeholder="Enter your password"
                  value={userData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute top-6 right-4 text-f-gray2"
                  onClick={() => setIsPassVisible(!isPassVisible)}
                >
                  {isPassVisible ? (
                    <MdOutlineRemoveRedEye className="w-6 h-6" />
                  ) : (
                    <FaRegEyeSlash className="w-6 h-6" />
                  )}
                </button>
              </div>
              <div className="flex flex-row-reverse mt-1">
                <a
                  onClick={() => navigate("/forgot-password")}
                  className="text-p-rg font-bold text-c-secondary"
                >
                  Forgot password?
                </a>
              </div>
            </section>
          </div>
          <SubmitButton
            value={"Sign In"}
            disabled={isLoading}
            style={
              "bg-c-primary hover:bg-opacity-80 active:bg-pressed-doctor font-font-Raleway"
            }
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
