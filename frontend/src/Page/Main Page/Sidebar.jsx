import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";
import TopbarButton from "./TopbarButton";
import { TbScan } from "react-icons/tb";
import { FaRegStickyNote } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { IoAddCircle, IoLogOutOutline } from "react-icons/io5";
import { SlOrganization } from "react-icons/sl";
import SidebarLogo from "../../assets/Image/sidebar_logo.png";
import Cookies from "universal-cookie";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { useSelector } from "react-redux";

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

  return (
    <div
      className={`h-16 w-full xl:h-screen z-50 font-Poppins bg-c-primary xl:bg-bg-sb  transition-all duration-300 ease-in-out ${
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
            <GiHamburgerMenu className="text-f-dark mt-5 hidden xl:block " />
          ) : (
            <IoMdClose className="text-f-dark hidden xl:block" />
          )}
        </button>
      </div>

      <div
        className={`flex flex-col h-full justify-between xl:space-y-3 xl:px-6 xl:pt-10 xl:pb-5 transition-transform duration-300 ease-in-out border-r border-f-gray  ${
          isMenuOpen
            ? "translate-x-0 max-h-screen h-full bg-bg-sb fixed xl:static w-3/4 md:w-1/3 lg:w-1/4 xl:w-auto"
            : "hidden xl:flex"
        }`}
        style={{ maxHeight: "calc(100vh - 64px)" }}
      >
        <div className="flex flex-col gap-2 mr-4 xl:mr-0">
          {isCollapsed ? (
            ""
          ) : (
            <h1 className="ml-5 text-p-sm text-c-primary mt-5 xl:mt-0">
              MAIN MENU
            </h1>
          )}
          {(role === "0" || role === "1") && (
            <>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "dashboard"
                    ? "bg-c-primary text-f-light font-semibold "
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
                      ? " h-[26px] w-[26px] "
                      : " h-[26px] w-[26px] xl:mr-3 "
                  }`}
                />
                {!isCollapsed && (
                  <span className="ml-2">{isCollapsed ? "" : "Dashboard"}</span>
                )}
              </NavLink>
              {role === "0" ? (
                <NavLink
                  className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                    selected === "organization"
                      ? "bg-c-primary text-f-light font-semibold "
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
                        ? " h-[26px] w-[26px]"
                        : " h-[26px] w-[26px] xl:mr-3"
                    }`}
                  />
                  {!isCollapsed && <span className="ml-2">Organization</span>}
                </NavLink>
              ) : (
                ""
              )}
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "patient"
                    ? "bg-c-primary text-f-light font-semibold "
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
                      ? " h-[26px] w-[26px]"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Patients</span>}
              </NavLink>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "appointment"
                    ? "bg-c-primary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? "xl:px-2 py-2 justify-center"
                    : "xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("appointment")}
                to="appointment"
              >
                <FaRegStickyNote
                  className={`${
                    isCollapsed
                      ? " h-[26px] w-[26px]"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Appointment</span>}
              </NavLink>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "inventory"
                    ? "bg-c-primary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? "xl:px-2 py-2 justify-center"
                    : "xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("inventory")}
                to="inventory"
              >
                <FaRegStickyNote
                  className={`${
                    isCollapsed
                      ? " h-[26px] w-[26px]"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Inventory</span>}
              </NavLink>
            </>
          )}
          {role === "2" && (
            <>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "dashboard"
                    ? "bg-c-primary text-f-light font-semibold "
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
                      ? " h-[26px] w-[26px] "
                      : " h-[26px] w-[26px] xl:mr-3 "
                  }`}
                />
                {!isCollapsed && (
                  <span className="ml-2">{isCollapsed ? "" : "Dashboard"}</span>
                )}
              </NavLink>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "scribe"
                    ? "bg-c-primary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? "xl:px-2 py-2 justify-center"
                    : "xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("scribe")}
                to="scribe"
              >
                <FaRegStickyNote
                  className={`${
                    isCollapsed
                      ? " h-[26px] w-[26px]"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Scribe</span>}
              </NavLink>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "patient"
                    ? "bg-c-primary text-f-light font-semibold "
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
                      ? " h-[26px] w-[26px]  justify-center"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Patients</span>}
              </NavLink>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "appointment"
                    ? "bg-c-primary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? "xl:px-2 py-2 justify-center"
                    : "xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("appointment")}
                to="appointment"
              >
                <FaRegStickyNote
                  className={`${
                    isCollapsed
                      ? " h-[26px] w-[26px]"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Appointment</span>}
              </NavLink>
            </>
          )}
          {role === "3" && (
            <>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-secondary xl:active:bg-sb-pressed-secondary xl:focus:bg-c-secondary ${
                  selected === "dashboard"
                    ? "bg-c-secondary text-f-light font-semibold "
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
                      ? " h-[26px] w-[26px] "
                      : " h-[26px] w-[26px] xl:mr-3 "
                  }`}
                />
                {!isCollapsed && (
                  <span className="ml-2">{isCollapsed ? "" : "Dashboard"}</span>
                )}
              </NavLink>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-secondary xl:active:bg-sb-pressed-secondary xl:focus:bg-c-secondary ${
                  selected === "add-patient"
                    ? "bg-c-secondary text-f-light font-semibold "
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
                      ? " h-[26px] w-[26px]  justify-center "
                      : " h-[26px] w-[26px] xl:mr-3 "
                  }`}
                />
                {!isCollapsed && <span className=" ml-2 ">Add Patient</span>}
              </NavLink>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-secondary xl:active:bg-sb-pressed-secondary xl:focus:bg-c-secondary ${
                  selected === "patient"
                    ? "bg-c-secondary text-f-light font-semibold "
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
                      ? " h-[26px] w-[26px]"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Patients</span>}
              </NavLink>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-secondary xl:active:bg-sb-pressed-secondary xl:focus:bg-c-secondary ${
                  selected === "appointment"
                    ? "bg-c-secondary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? "xl:px-2 py-2 justify-center"
                    : "xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("appointment")}
                to="appointment"
              >
                <FaRegStickyNote
                  className={`${
                    isCollapsed
                      ? " h-[26px] w-[26px]"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Appointment</span>}
              </NavLink>
              <NavLink
                className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-secondary xl:active:bg-sb-pressed-secondary xl:focus:bg-c-secondary ${
                  selected === "inventory"
                    ? "bg-c-secondary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? "xl:px-2 py-2 justify-center"
                    : "xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("inventory")}
                to="inventory"
              >
                <FaRegStickyNote
                  className={`${
                    isCollapsed
                      ? " h-[26px] w-[26px]"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Inventory</span>}
              </NavLink>
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 mr-4 xl:mr-0">
          <hr class="border-0 xl:border-t border-f-gray" />
          <NavLink
            className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
              selected === "manage-profile/:section"
                ? "bg-c-secondary text-f-light font-semibold "
                : "text-f-dark font-medium"
            }${
              isCollapsed ? "xl:px-2 py-2 justify-center" : "xl:py-3 xl:px-4 "
            }`}
            onClick={() => setSelected("manage-profile/:section")}
            to="manage-profile/:section"
          >
            <FaRegStickyNote
              className={`${
                isCollapsed
                  ? " h-[26px] w-[26px]"
                  : " h-[26px] w-[26px] xl:mr-3"
              }`}
            />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </NavLink>
          <NavLink
            className={` ml-4 xl:ml-0 flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
              selected === "help"
                ? "bg-c-secondary text-f-light font-semibold "
                : "text-f-dark font-medium"
            }${
              isCollapsed ? "xl:px-2 py-2 justify-center" : "xl:py-3 xl:px-4 "
            }`}
            onClick={() => setSelected("help")}
            to="help"
          >
            <FaRegStickyNote
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
