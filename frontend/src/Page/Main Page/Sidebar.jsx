import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import TopbarButton from "./TopbarButton";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import SidebarLogo from "../../assets/Image/sidebar_logo.png";
import { useSelector } from "react-redux";
import { BsLayoutSidebar } from "react-icons/bs";
import RoleColor from "../../assets/Util/RoleColor";
import { FiBox } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { FiHelpCircle } from "react-icons/fi";
import { FiFileText } from "react-icons/fi";
import { FiGrid } from "react-icons/fi";
import { FiClipboard } from "react-icons/fi";
import { FiUserPlus } from "react-icons/fi";
import Eyomnlogo from "../../assets/Logo/EyomnLogo.png";

const SideBar = () => {
  const role = useSelector((state) => state.reducer.user.user.role);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
  useEffect(() => {
    const current = sessionStorage.getItem("selectedTab");
    setSelected(current);
  }, [selected]);

  const { roleSbColor, btnHoverColor, btnBgColor } = RoleColor();

  return (
    <div
      className={`h-16 w-full xl:h-screen z-50 font-Poppins ${btnBgColor}  transition-all duration-300 ease-in-out  ${roleSbColor} ${
        isCollapsed ? "xl:w-24" : "xl:w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 xl:border-r border-f-gray">
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
          src={Eyomnlogo}
          alt="Sidebar Logo"
          className={`h-5 md:h-16 lg:h-18 w-1/2 mt-1 object-contain mx-auto ${
            isCollapsed ? "hidden" : "block"
          }`}
        />
        <button
          className={`text-f-dark text-xl ${isCollapsed ? "ml-1" : "ml-4"}`}
          onClick={handleCollapseToggle}
        >
          {isCollapsed ? (
            <GiHamburgerMenu className="text-f-dark mt-5 hidden xl:block " />
          ) : (
            <BsLayoutSidebar
              className="text-f-dark hidden xl:block
            "
            />
          )}
        </button>
      </div>

      <div
        className={`flex flex-col justify-between h-full xl:space-y-3 xl:px-6 xl:pt-10 xl:pb-5 transition-transform duration-300 ease-in-out border-r border-f-gray ${roleSbColor}  ${
          isMenuOpen
            ? " translate-x-0 max-h-screen h-full mt-3 md:mt-0 fixed xl:static w-3/4 md:w-1/3 lg:w-1/4 xl:w-auto bg-bg-sb "
            : " hidden xl:flex "
        }`}
        style={{ maxHeight: "calc(100vh - 64px)" }}
      >
        <div className="flex flex-col gap-2 mr-4 xl:mr-0">
          {isCollapsed ? (
            ""
          ) : (
            <h1 className=" text-p-sc md:text-p-sm font-medium text-c-gray3 mt-5 xl:mt-0 ml-5">
              Main Menu
            </h1>
          )}
          <NavLink
            className={`ml-4 xl:ml-0 flex items-center text-p-sm md:text-p-rg py-3 px-4 text-f-dark rounded-md 
              ${btnHoverColor}
              ${
                selected === "dashboard"
                  ? btnBgColor
                  : "text-f-dark font-medium"
              }
              ${
                isCollapsed
                  ? "xl:justify-center xl:px-2 py-2"
                  : "xl:py-3 xl:px-4"
              } `}
            onClick={() => setSelected("dashboard")}
            to="dashboard"
          >
            <FiGrid
              className={`${
                isCollapsed ? "h-[26px] w-[26px]" : "h-[26px] w-[26px] xl:mr-3"
              }`}
            />
            {!isCollapsed && (
              <span className="ml-2">{isCollapsed ? "" : "Dashboard"}</span>
            )}
          </NavLink>
          {role === "0" && (
            <NavLink
              className={`ml-4 xl:ml-0 flex items-center text-p-sm md:text-p-rg py-3 px-4 text-f-dark rounded-md 
              ${btnHoverColor}
              ${
                selected === "organization"
                  ? btnBgColor
                  : "text-f-dark font-medium"
              }
              ${
                isCollapsed
                  ? "xl:justify-center xl:px-2 py-2"
                  : "xl:py-3 xl:px-4"
              } `}
              onClick={() => setSelected("organization")}
              to="organization"
            >
              <FiUsers
                className={`${
                  isCollapsed
                    ? " h-[26px] w-[26px]"
                    : " h-[26px] w-[26px] xl:mr-3"
                }`}
              />
              {!isCollapsed && <span className="ml-2">Organization</span>}
            </NavLink>
          )}
          {role === "2" && (
            <NavLink
              className={`ml-4 xl:ml-0 flex items-center text-p-sm md:text-p-rg py-3 px-4 text-f-dark rounded-md 
             ${btnHoverColor}
              ${selected === "scribe" ? btnBgColor : "text-f-dark font-medium"}
              ${
                isCollapsed
                  ? "xl:justify-center xl:px-2 py-2"
                  : "xl:py-3 xl:px-4"
              } `}
              onClick={() => setSelected("scribe")}
              to="scribe"
            >
              <FiClipboard
                className={`${
                  isCollapsed
                    ? " h-[26px] w-[26px]"
                    : " h-[26px] w-[26px] xl:mr-3"
                }`}
              />
              {!isCollapsed && <span className="ml-2">Scribe</span>}
            </NavLink>
          )}
          {role === "3" && (
            <NavLink
              className={`ml-4 xl:ml-0 flex items-center text-p-sm md:text-p-rg py-3 px-4 text-f-dark rounded-md 
            ${btnHoverColor}
              ${
                selected === "add-patient"
                  ? btnBgColor
                  : "text-f-dark font-medium"
              }
              ${
                isCollapsed
                  ? "xl:justify-center xl:px-2 py-2"
                  : "xl:py-3 xl:px-4"
              } `}
              onClick={() => setSelected("add-patient")}
              to="add-patient"
            >
              <FiUserPlus
                className={`${
                  isCollapsed
                    ? " h-[26px] w-[26px]  justify-center "
                    : " h-[26px] w-[26px] xl:mr-3 "
                }`}
              />
              {!isCollapsed && <span className=" ml-2 ">Add Patient</span>}
            </NavLink>
          )}
          <NavLink
            className={`ml-4 xl:ml-0 flex items-center text-p-sm md:text-p-rg py-3 px-4 text-f-dark rounded-md 
             ${btnHoverColor}
              ${selected === "patient" ? btnBgColor : "text-f-dark font-medium"}
              ${
                isCollapsed
                  ? "xl:justify-center xl:px-2 py-2"
                  : "xl:py-3 xl:px-4"
              } `}
            onClick={() => setSelected("patient")}
            to="patient"
          >
            <FiUser
              className={`${
                isCollapsed
                  ? " h-[26px] w-[26px]"
                  : " h-[26px] w-[26px] xl:mr-3"
              }`}
            />
            {!isCollapsed && <span className="ml-2">Patients</span>}
          </NavLink>
          <NavLink
            className={`ml-4 xl:ml-0 flex items-center text-p-sm md:text-p-rg py-3 px-4 text-f-dark rounded-md 
             ${btnHoverColor}
              ${
                selected === "appointment"
                  ? btnBgColor
                  : "text-f-dark font-medium"
              }
              ${
                isCollapsed
                  ? "xl:justify-center xl:px-2 py-2"
                  : "xl:py-3 xl:px-4"
              } `}
            onClick={() => setSelected("appointment")}
            to="appointment"
          >
            <FiCalendar
              className={`${
                isCollapsed
                  ? " h-[26px] w-[26px]"
                  : " h-[26px] w-[26px] xl:mr-3"
              }`}
            />
            {!isCollapsed && <span className="ml-2">Appointment</span>}
          </NavLink>
          {role != 2 && (
            <div className="flex flex-col gap-2 mr-4 xl:mr-0 mt-4">
              <hr className="mb-4 border-f-gray" />
              {isCollapsed ? (
                ""
              ) : (
                <h1 className=" text-p-sc md:text-p-sm font-medium text-c-gray3 mt-5 xl:mt-0 ml-5">
                  Other
                </h1>
              )}
              {role != 3 && (
                <NavLink
                  className={`ml-4 xl:ml-0 flex items-center text-p-sm md:text-p-rg py-3 px-4 text-f-dark rounded-md 
            ${btnHoverColor}
              ${selected === "report" ? btnBgColor : "text-f-dark font-medium"}
              ${
                isCollapsed
                  ? "xl:justify-center xl:px-2 py-2"
                  : "xl:py-3 xl:px-4"
              } `}
                  onClick={() => setSelected("report")}
                  to="report"
                >
                  <FiFileText
                    className={`${
                      isCollapsed
                        ? " h-[26px] w-[26px]"
                        : " h-[26px] w-[26px] xl:mr-3"
                    }`}
                  />
                  {!isCollapsed && <span className="ml-2">Reports</span>}
                </NavLink>
              )}
              <NavLink
                className={`ml-4 xl:ml-0 flex items-center text-p-sm md:text-p-rg py-3 px-4 text-f-dark rounded-md 
              ${btnHoverColor}
              ${
                selected === "inventory"
                  ? btnBgColor
                  : "text-f-dark font-medium"
              }
              ${
                isCollapsed
                  ? "xl:justify-center xl:px-2 py-2"
                  : "xl:py-3 xl:px-4"
              } `}
                onClick={() => setSelected("inventory")}
                to="inventory"
              >
                <FiBox
                  className={`${
                    isCollapsed
                      ? " h-[26px] w-[26px]"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Inventory</span>}
              </NavLink>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 mr-4 xl:mr-0">
          <NavLink
            className={`ml-4 xl:ml-0 flex items-center text-p-sm md:text-p-rg py-3 px-4 text-f-dark rounded-md 
             ${btnHoverColor}
              ${
                selected === "manage-profile/:section"
                  ? btnBgColor
                  : "text-f-dark font-medium"
              }
              ${
                isCollapsed
                  ? "xl:justify-center xl:px-2 py-2"
                  : "xl:py-3 xl:px-4"
              } `}
            onClick={() => setSelected("manage-profile/:section")}
            to="manage-profile/:section"
          >
            <FiSettings
              className={`${
                isCollapsed
                  ? " h-[26px] w-[26px]"
                  : " h-[26px] w-[26px] xl:mr-3"
              }`}
            />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </NavLink>
          <NavLink
            className={`ml-4 xl:ml-0 flex items-center text-p-sm md:text-p-rg py-3 px-4 text-f-dark rounded-md 
            ${btnHoverColor}
              ${selected === "help" ? btnBgColor : "text-f-dark font-medium"}
              ${
                isCollapsed
                  ? "xl:justify-center xl:px-2 py-2"
                  : "xl:py-3 xl:px-4"
              } `}
            onClick={() => setSelected("help")}
            to="help"
          >
            <FiHelpCircle
              className={`${
                isCollapsed
                  ? " h-[26px] w-[26px]"
                  : " h-[26px] w-[26px] xl:mr-3"
              }`}
            />
            {!isCollapsed && <span className="ml-2">Help</span>}
          </NavLink>
          <div className="px-4 xl:hidden w-full py-6 flex justify-center ml-2 border-t border-f-gray">
            <TopbarButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
