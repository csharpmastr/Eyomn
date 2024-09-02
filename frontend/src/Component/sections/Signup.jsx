import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SubmitButton from "../ui/SubmitButton";
import { userSignUp } from "../../Service/UserService";
import useSignup from "../../Hooks/useSignup";
const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useSignup();
  const [clinicData, setClinic] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    contact: "",
    password: "",
  });

  const handleChange = (e) => {
    setClinic({ ...clinicData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(clinicData);
      if (res.status === 200) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("Failed to add user:", err);
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
        <h2 className="font-Poppins text-[20px] text-left mb-4">Signup</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="firstname"
            value={clinicData.firstname}
            onChange={handleChange}
            className="w-full p-2 rounded-md border-2 border-[#C8C8C8] font-Poppins"
            placeholder="Enter your first name"
            required
          />
          <input
            type="text"
            name="lastname"
            value={clinicData.lastname}
            onChange={handleChange}
            className="w-full p-2 rounded-md border-2 border-[#C8C8C8] font-Poppins"
            placeholder="Enter your last name"
            required
          />
          <input
            type="text"
            name="username"
            value={clinicData.username}
            onChange={handleChange}
            className="w-full p-2 rounded-md border-2 border-[#C8C8C8] font-Poppins"
            placeholder="Enter your organization name"
            required
          />
          <input
            type="email"
            name="email"
            value={clinicData.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md border-2 border-[#C8C8C8] font-Poppins"
            placeholder="Enter your email"
            required
          />
          <input
            type="number"
            name="contact"
            value={clinicData.contact}
            onChange={handleChange}
            className="w-full p-2 rounded-md border-2 border-[#C8C8C8] font-Poppins"
            placeholder="Enter your contact number"
            required
          />
          <input
            type="password"
            name="password"
            value={clinicData.password}
            onChange={handleChange}
            className="w-full p-2 rounded-md border-2 border-[#C8C8C8] font-Poppins"
            placeholder="Enter your password"
            required
          />
          <SubmitButton value={"Submit"} />
        </div>
        <p className="font-Poppins text-[14px] text-center mt-5">
          Already have an account? <Link to={"/login"}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
