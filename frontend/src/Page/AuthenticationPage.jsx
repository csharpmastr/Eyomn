import React from "react";
import Login from "../Component/sections/Login";
import SigninImg from "../assets/Image/signin_img.png";
import Aguila from "../assets/Image/aguila.png";
import Logo from "../assets/Image/logo.png";
import { FaInstagram } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const AuthenticationPage = () => {
  return (
    <div className="h-screen w-full bg-bg-mc flex justify-between items-center p-0 lg:p-6 xl:p-8 2xl:p-10 gap-0 lg:gap-6 xl:gap-8 2xl:gap-10 font-Poppins relative">
      <div className="w-full lg:w-3/5 h-full relative">
        <div className="absolute inset-0 bg-f-dark bg-opacity-50 lg:opacity-0"></div>
        <img src={Aguila} alt="" className="absolute h-12 m-4" />
        <div className="w-full h-full flex lg:rounded-xl items-center justify-center overflow-hidden">
          <img
            src={SigninImg}
            alt="SI IMG"
            className="w-full h-full object-cover"
          />
        </div>
        <article className="absolute bottom-5 left-4 text-p-sc font-normal text-f-light">
          <p>
            Photo by{" "}
            <span>
              <a
                href="https://unsplash.com/@arteum?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                target="_blank"
              >
                <u>Arteum.ro</u>
              </a>
            </span>{" "}
            Fet on{" "}
            <span>
              <a
                href="https://unsplash.com/photos/person-showing-green-and-black-eyelid-closeup-photography-7H41oiADqqg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                target="_blank"
              >
                <u>Unsplash</u>
              </a>
            </span>
          </p>
        </article>
      </div>
      <div className="h-full w-full lg:w-2/5 flex flex-col items-center justify-between absolute lg:static">
        <div className="text-f-light lg:text-f-dark text-p-sm lg:text-p-rg w-full flex flex-col items-end pr-4 pt-4 lg:p-0">
          <img src={Logo} alt="" className="object-fill" />
          <p>Smart Solutions for Better Healthcare</p>
        </div>
        <div className="w-full px-8 md:px-20 xl:px-8 2xl:px-10">
          <Login />
        </div>
        <div className="text-f-light lg:text-c-gray3 text-p-sm w-full items-end flex flex-col gap-2 pr-4 pb-4 lg:p-0">
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
