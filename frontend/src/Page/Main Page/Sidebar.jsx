import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";
import { TbScan } from "react-icons/tb";
import { FaRegStickyNote } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { SlOrganization } from "react-icons/sl";
import SidebarLogo from "../../assets/Image/sidebar_logo.png";
import Cookies from "universal-cookie";
import useLogout from "../../Hooks/useLogout";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { useSelector } from "react-redux";

const SideBar = () => {
  const role = useSelector((state) => state.reducer.user.user.role);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useLogout();
  const [selected, setSelected] = useState(() => {
    return sessionStorage.getItem("selectedTab");
  });

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    sessionStorage.setItem("selectedTab", selected);
  }, [selected]);

  return (
    <div
      className={`h-auto w-full xl:h-screen z-50 ${
        isCollapsed ? "xl:w-24" : "xl:w-64"
      } bg-c-primary xl:bg-[#EEF1F1] border-r-2  border-f-gray transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between xl:mb-10 px-4 md:px-6 lg:px-8">
        {isMenuOpen ? (
          <IoMdClose
            className="text-f-light text-2xl xl:hidden"
            onClick={handleMenuClick}
          />
        ) : (
          <GiHamburgerMenu
            className="text-f-light text-2xl xl:hidden"
            onClick={handleMenuClick}
          />
        )}
        <img
          src={SidebarLogo}
          alt="Sidebar Logo"
          className={`h-14 md:h-16 lg:h-18 w-auto mx-auto ${
            isCollapsed ? "hidden" : "block"
          }`}
        />
        <button
          className={`text-f-dark text-xl ${isCollapsed ? "ml-1" : "ml-4"}`}
          onClick={handleCollapseToggle}
        >
          {isCollapsed ? (
            <GiHamburgerMenu
              className="text-f-dark mt-5 hidden xl:block "
              onClick={handleMenuClick}
            />
          ) : (
            <IoMdClose
              className="text-f-dark hidden xl:block"
              onClick={handleMenuClick}
            />
          )}
        </button>
      </div>
      <div
        className={`xl:flex xl:flex-col px-4 xl:space-y-3 xl:px-6 xl:pt-5 xl:pb-5 transition-all duration-300 ease-in-out overflow-hidden xl:h-full ${
          isMenuOpen
            ? "block max-h-screen bg-[#EEF1F1] fixed xl:static w-full xl:w-auto"
            : "hidden xl:block"
        }`}
      >
        <div className="flex flex-col xl:gap-4 mt-2">
          {role === "0" && (
            <>
              <NavLink
                className={`font-Poppins flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime ${
                  selected === "dashboard"
                    ? "xl:bg-c-primary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? " xl:justify-center xl:px-2 py-2 "
                    : " xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("dashboard")}
                to="dashboard"
              >
                <TbLayoutDashboard
                  className={`${
                    isCollapsed
                      ? " h-[25px] w-[25px] "
                      : " h-[25px] w-[25px] xl:mr-3 "
                  }`}
                />
                {!isCollapsed && (
                  <span className="ml-2">{isCollapsed ? "" : "Dashboard"}</span>
                )}
              </NavLink>
              <NavLink
                className={`font-Poppins flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime ${
                  selected === "patient"
                    ? "xl:bg-c-primary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? " xl:px-2 py-2 xl:justify-center"
                    : " xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("patient")}
                to="patient"
              >
                <FiUser
                  className={`${
                    isCollapsed
                      ? " h-[25px] w-[25px]"
                      : " h-[25px] w-[25px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Patients</span>}
              </NavLink>
              <NavLink
                className={`font-Poppins flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime ${
                  selected === "organization"
                    ? "xl:bg-c-primary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? " xl:px-2 py-2 xl:justify-center "
                    : "xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("organization")}
                to="organization"
              >
                <SlOrganization
                  className={`${
                    isCollapsed
                      ? " h-[25px] w-[25px]"
                      : " h-[25px] w-[25px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Organization</span>}
              </NavLink>
            </>
          )}
          {role === "1" && (
            <>
              <NavLink
                className={`font-Poppins flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime ${
                  selected === "scan"
                    ? "xl:bg-c-primary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? " xl:px-2 py-2  justify-center"
                    : "xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("scan")}
                to="scan"
              >
                <TbScan
                  className={`${
                    isCollapsed
                      ? " h-[25px] w-[25px] "
                      : " h-[25px] w-[25px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Scan Fundus</span>}
              </NavLink>
              <NavLink
                className={`font-Poppins flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime ${
                  selected === "scribe"
                    ? "xl:bg-c-primary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? " xl:px-2 py-2 justify-center"
                    : "xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("scribe")}
                to="scribe"
              >
                <FaRegStickyNote
                  className={`${
                    isCollapsed
                      ? " h-[25px] w-[25px]"
                      : " h-[25px] w-[25px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Scribe</span>}
              </NavLink>
              <NavLink
                className={`font-Poppins flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime ${
                  selected === "patient"
                    ? "xl:bg-c-primary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? " xl:px-2 py-2 justify-center"
                    : "xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("patient")}
                to="patient"
              >
                <FiUser
                  className={`${
                    isCollapsed
                      ? " h-[25px] w-[25px]  justify-center"
                      : " h-[25px] w-[25px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Patients</span>}
              </NavLink>
            </>
          )}
          {role === "2" && (
            <NavLink
              className={`font-Poppins flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime ${
                selected === "add-patient"
                  ? "xl:bg-c-primary text-f-light font-semibold "
                  : "text-f-dark font-medium"
              }${
                isCollapsed
                  ? " xl:px-2 py-2 justify-center"
                  : "xl:py-3 xl:px-4 "
              } `}
              onClick={() => setSelected("add-patient")}
              to="add-patient"
            >
              <FiUser
                className={`${
                  isCollapsed
                    ? " h-[25px] w-[25px]  justify-center "
                    : " h-[25px] w-[25px] xl:mr-3 "
                }`}
              />
              {!isCollapsed && <span className=" ml-2 ">Add Patient</span>}
            </NavLink>
          )}
        </div>
        <div className={`mb-2 ${role === "0" ? `xl:pt-72` : `xl:pt-72`}`}>
          <NavLink
            className={`font-Poppins flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime ${
              isCollapsed
                ? "xl:bg-c-primary text-f-light font-semibold "
                : "text-f-dark font-medium"
            }`}
            onClick={logout}
          >
            <IoLogOutOutline
              className={`${
                isCollapsed
                  ? " xl:h-[25px] xl:w-[25px] h-[30px] w-[30px] "
                  : " h-[25px] w-[25px]  xl:h-[30px] xl:w-[30px] xl:mr-3 "
              }`}
            />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
