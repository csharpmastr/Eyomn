import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";
import { TbScan } from "react-icons/tb";
import { FaRegStickyNote } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import SidebarLogo from "../../assets/Image/sidebar_logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import Cookies from "universal-cookie";
import useLogout from "../../Hooks/useLogout";
import { useAuthContext } from "../../Hooks/useAuthContext";

const SideBar = () => {
  const cookies = new Cookies();
  const { user } = useAuthContext();
  const role = cookies.get("role");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, isLoading, error } = useLogout();
  const [selected, setSelected] = useState(() => {
    return sessionStorage.getItem("selectedTab") || "dashboard";
  });
  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    console.log(user);
    console.log(role === 0);

    sessionStorage.setItem("selectedTab", selected);
  }, [selected]);
  return (
    <>
      <div className=" h-auto w-full xl:h-screen xl:w-60 bg-[#1ABC9C] xl:bg-[#2C3E50] ">
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
          className={`xl:flex xl:flex-col px-4 xl:space-y-3 xl:px-6 xl:pt-5 xl:pb-5 transition-all duration-300 ease-in-out overflow-hidden  ${
            isMenuOpen
              ? "block max-h-screen bg-[#2C3E50] fixed xl:static w-full xl:w-auto"
              : "hidden xl:block"
          } `}
        >
          {role === 0 ? (
            <NavLink
              className={`font-Poppins flex text-[18px] py-3 px-4 rounded-md ${
                selected === "dashboard"
                  ? "xl:bg-[#A0A3A6] text-white font-semibold"
                  : "text-[#B5B5B5]"
              }`}
              onClick={() => setSelected("dashboard")}
              to={"dashboard"}
            >
              <TbLayoutDashboard className="h-[25px] w-[25px] xl:mr-3 xl:ml-0 mr-2" />
              Dashboard
            </NavLink>
          ) : (
            ""
          )}
          {role === 0 ? (
            ""
          ) : (
            <>
              {" "}
              <NavLink
                className={`font-Poppins flex text-[18px]  py-3 px-4 rounded-md ${
                  selected === "scan"
                    ? "xl:bg-[#A0A3A6] text-white font-semibold"
                    : " text-[#B5B5B5]"
                }`}
                onClick={() => setSelected("scan")}
                to={"scan"}
              >
                <TbScan className="h-[25px] w-[25px] xl:mr-3 xl:ml-0 mr-2" />
                Scan Fundus
              </NavLink>
              <NavLink
                className={`font-Poppins flex items-center text-[18px]  py-2 px-4 rounded-md   ${
                  selected === "scribe"
                    ? "xl:bg-[#A0A3A6] text-white  xl:text-white font-semibold"
                    : " text-[#B5B5B5]  "
                }`}
                onClick={() => setSelected("scribe")}
                to={"scribe"}
              >
                <FaRegStickyNote className="xl:h-[25px] xl:w-[25px] xl:mr-3 xl:ml-0 ml-1 mr-2 m-1" />
                Scribe
              </NavLink>
            </>
          )}
          <NavLink
            className={`font-Poppins flex text-[18px]  py-3 px-4 rounded-md   ${
              selected === "patient"
                ? "xl:bg-[#A0A3A6] text-white  xl:text-white font-semibold"
                : " text-[#B5B5B5]  "
            }`}
            onClick={() => setSelected("patient")}
            to={"patient"}
          >
            <FiUser className="h-[25px] w-[25px] xl:mr-3 xl:ml-0 mr-2" />
            Patients
          </NavLink>
          {role === 0 ? (
            <NavLink
              className={`font-Poppins flex items-center text-[18px]  py-2 px-4 rounded-md   ${
                selected === "staff"
                  ? "xl:bg-[#A0A3A6] text-white  xl:text-white font-semibold"
                  : " text-[#B5B5B5]  "
              }`}
              onClick={() => setSelected("staff")}
              to={"staff"}
            >
              <FaRegStickyNote className="xl:h-[25px] xl:w-[25px] xl:mr-3 xl:ml-0 ml-1 mr-2 m-1" />
              Staff
            </NavLink>
          ) : (
            ""
          )}
          <NavLink
            className={`font-Poppins flex text-[18px]  py-3 px-4 rounded-md`}
            onClick={logout}
          >
            Logout
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default SideBar;
