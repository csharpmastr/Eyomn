import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";
import { TbScan } from "react-icons/tb";
import { FaRegStickyNote } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import SidebarLogo from "../../assets/Image/sidebar_logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
const SideBar = () => {
  const [selected, setSelected] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {isMenuOpen ? "" : ""}
      <div className="h-auto w-full xl:h-full xl:w-1/6 bg-[#1ABC9C] xl:bg-[#2C3E50] ">
        <div className="flex items-center justify-between xl:mb-10 px-4 md:px-6 lg:px-8">
          {isMenuOpen ? (
            <IoMdClose
              className="text-white text-2xl xl:hidden"
              onClick={handleMenuClick}
            />
          ) : (
            <GiHamburgerMenu
              className="text-white text-2xl xl:hidden"
              onClick={handleMenuClick}
            />
          )}
          <img
            src={SidebarLogo}
            alt="Sidebar Logo"
            className="h-14 md:h-16 lg:h-18 w-auto mx-auto"
          />
        </div>
        <div
          className={`xl:flex xl:flex-col xl:space-y-3 xl:px-6 xl:pt-5 xl:pb-10  ${
            isMenuOpen ? "flex flex-col items-left h-auto p-4" : "hidden"
          } `}
        >
          <NavLink
            className={`font-Poppins flex text-[18px]  py-3 px-4 rounded-md ${
              selected === "dashboard"
                ? "xl:bg-[#A0A3A6] xl:text-white font-semibold"
                : " text-[#B5B5B5]"
            }`}
            onClick={() => setSelected("dashboard")}
            to={"dashboard"}
          >
            <TbLayoutDashboard className="h-[25px] w-[25px] xl:mr-3 xl:ml-0 mr-2" />
            Dashboard
          </NavLink>
          <NavLink
            className={`font-Poppins flex text-[18px]  py-3 px-4 rounded-md ${
              selected === "scan"
                ? "xl:bg-[#A0A3A6] xl:text-white font-semibold"
                : " text-[#B5B5B5]"
            }`}
            onClick={() => setSelected("scan")}
            to={"scan"}
          >
            <TbScan className="h-[25px] w-[25px] xl:mr-3 xl:ml-0 mr-2" />
            Scan Fundus
          </NavLink>
          <NavLink
            className={`font-Poppins flex text-[18px]  py-3 px-4 rounded-md ${
              selected === "scribe"
                ? "xl:bg-[#A0A3A6] xl:text-white font-semibold"
                : " text-[#B5B5B5]"
            }`}
            onClick={() => setSelected("scribe")}
            to={"scribe"}
          >
            <FaRegStickyNote className="xl:h-[25px] xl:w-[25px] xl:mr-3 xl:ml-0 ml-1 mr-2 m-1" />
            Scribe
          </NavLink>
          <NavLink
            className={`font-Poppins flex text-[18px]  py-3 px-4 rounded-md  ${
              selected === "patient"
                ? "xl:bg-[#A0A3A6] xl:text-white font-semibold"
                : " text-[#B5B5B5] "
            }`}
            onClick={() => setSelected("patient")}
            to={"patient"}
          >
            <FiUser className="h-[25px] w-[25px] xl:mr-3 xl:ml-0 mr-2" />
            Patients
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default SideBar;
