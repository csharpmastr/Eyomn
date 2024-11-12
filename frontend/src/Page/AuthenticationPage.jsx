import React from "react";
import Login from "../Component/sections/Login";
import SigninImg from "../assets/Image/signin_img.png";
import Logo from "../assets/Image/logo.png";
import { FaInstagram } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const AuthenticationPage = ({ type }) => {
  return (
    <div className="h-screen w-full bg-bg-mc flex justify-between items-center p-0 lg:p-6 xl:p-8 2xl:p-10 gap-0 lg:gap-6 xl:gap-8 2xl:gap-10 font-Poppins relative">
      <div className="w-full lg:w-3/5 h-full lg:rounded-xl flex items-center justify-center overflow-hidden bg-red-400">
        <img
          src={SigninImg}
          alt="SI IMG"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="h-full w-full lg:w-2/5 flex flex-col items-center justify-between absolute lg:static">
        <div className="text-f-dark text-p-rg w-full flex flex-col items-end">
          <img src={Logo} alt="" className="object-fill" />
          <p>Smart Solutions for Better Healthcare</p>
        </div>
        <div className="w-full px-8 md:px-20 xl:px-8 2xl:px-10">
          <Login />
        </div>
        <div className="text-c-gray3 text-p-sm w-full items-end flex flex-col gap-2">
          <section className="flex gap-2">
            <p>Eyomn AI</p>
            <FaInstagram className="h-6 w-6" />
          </section>
          <section className="flex gap-2">
            <a
              href="mailto:info@eyomn.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              info@eyomn.com
            </a>
            <MdOutlineEmail className="h-6 w-6" />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
