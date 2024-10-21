import React from "react";
import Signup from "../Component/sections/Signup";
import Login from "../Component/sections/Login";
import { FaArrowLeft } from "react-icons/fa";
import Logo from "../assets/Image/logo.png";
import { FaInstagram, FaLock } from "react-icons/fa";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";

const AuthenticationPage = ({ type }) => {
  return (
    <div className="h-screen w-full bg-bg-mc flex justify-between items-center p-10 gap-10">
      <div
        className="w-full h-full p-5 rounded-xl flex flex-col justify-between bg-black"
        style={{
          background: "linear-gradient(to top, #2C3E50, #ABF2FF, #1E8282)",
          clipPath: "polygon(0 0, 100% 0, 90% 100%, 00% 100%)",
        }}
      >
        <div>
          <div className="bg-[#C0C5CA] w-fit p-1 flex gap-2 rounded-full items-center">
            <FaArrowLeft className="bg-white py-2 px-4 h-auto w-auto rounded-full" />
            <h1 className="text-p-rg font-bold mr-3">Go Back</h1>
          </div>
        </div>
        <h1 className="text-[150px] w-full text-center">Image</h1>
        <section className="flex w-full justify-between text-p-sm text-f-light pr-20 2xl:pr-28">
          <p>© 2024 Eyomn AI. All rights reserved.</p>
          <p>Privacy Policy and Terms of Service.</p>
        </section>
      </div>

      <div className="h-full w-fit flex flex-col justify-between">
        <div className="text-f-dark text-p-rg w-full flex flex-col items-end">
          <img src={Logo} alt="" className="object-fill" />
          <p>Smart Solutions for Better Healthcare</p>
        </div>
        {type === "signup" ? <Signup /> : <Login />}
        <div className="text-c-gray3 text-p-sm w-full items-end flex flex-col gap-2">
          <section className="flex gap-2">
            <p>Eyomn AI</p>
            <FaInstagram className="h-6 w-6" />
          </section>
          <section className="flex gap-2">
            <p>eyomn.info@gmail.com</p>
            <MdOutlineEmail className="h-6 w-7" />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
