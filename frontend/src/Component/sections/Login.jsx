import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SubmitButton from "../ui/SubmitButton";
import { useLogin } from "../../Hooks/useLogin";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

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
        if (response.role === "0" || response.role === "1") {
          sessionStorage.setItem("selectedTab", "dashboard");
          navigate("/dashboard");
        } else if (response.role === "2") {
          sessionStorage.setItem("selectedTab", "dashboard");
          navigate("/dashboard");
        } else {
          sessionStorage.setItem("selectedTab", "add-patient");
          navigate("/add-patient");
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
              <label className="text-p-rg font-medium">Email Address:</label>
              <input
                type="email"
                name="email"
                className="mt-1 w-full px-4 py-4 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                placeholder="Enter your email"
                value={userData.email}
                onChange={handleChange}
              />
            </section>
            <section>
              <label className="text-p-rg font-medium">Password:</label>
              <div className="relative">
                <input
                  type={isPassVisible ? "text" : "password"}
                  name="password"
                  className="mt-1 w-full px-4 py-4 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                  placeholder="Enter your password"
                  value={userData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute top-6 right-2 text-f-gray2"
                  onClick={() => setIsPassVisible(!isPassVisible)}
                >
                  {isPassVisible ? (
                    <MdOutlineRemoveRedEye className="w-6 h-6" />
                  ) : (
                    <FaRegEyeSlash className="w-6 h-6" />
                  )}
                </button>
              </div>
            </section>
          </div>
          <SubmitButton
            value={"Sign In"}
            disabled={isLoading}
            style={"bg-[#1ABC9C] font-font-Raleway"}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
