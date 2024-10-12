import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";
import { TbScan } from "react-icons/tb";
import { FaRegStickyNote } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { IoAddCircle, IoLogOutOutline } from "react-icons/io5";
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
      className={`h-auto w-full xl:h-screen z-50 font-Poppins ${
        isCollapsed ? "xl:w-24" : "xl:w-64"
      } bg-c-primary xl:bg-[#EEF1F1] border-r-2 border-f-gray transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8">
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
        className={`xl:flex xl:flex-col px-4 xl:space-y-3 xl:px-6 xl:pt-10 xl:pb-5 transition-transform duration-300 ease-in-out overflow-hidden xl:h-full ${
          isMenuOpen
            ? "translate-x-0 max-h-screen h-full bg-[#EEF1F1] fixed xl:static w-3/4 md:w-1/3 lg:w-1/4 xl:w-auto"
            : "hidden xl:block"
        }`}
      >
        {isCollapsed ? (
          ""
        ) : (
          <h1 className="ml-5 text-[14px] text-c-gray3 mt-5 xl:mt-0">
            MAIN MENU
          </h1>
        )}
        <div className="flex flex-col gap-2 xl:gap-2 mt-2">
          {(role === "0" || role === "1") && (
            <>
              <NavLink
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
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
                  className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
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
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
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
                      ? " h-[26px] w-[26px]"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Patients</span>}
              </NavLink>
              <NavLink
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "appointment"
                    ? "xl:bg-c-primary text-f-light font-semibold "
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
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "inventory"
                    ? "xl:bg-c-primary text-f-light font-semibold "
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
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
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
                      ? " h-[26px] w-[26px] "
                      : " h-[26px] w-[26px] xl:mr-3 "
                  }`}
                />
                {!isCollapsed && (
                  <span className="ml-2">{isCollapsed ? "" : "Dashboard"}</span>
                )}
              </NavLink>
              {/* <NavLink
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "scan"
                    ? "xl:bg-c-primary text-f-light font-semibold "
                    : "text-f-dark font-medium"
                }${
                  isCollapsed
                    ? "xl:px-2 py-2 justify-center"
                    : "xl:py-3 xl:px-4 "
                }`}
                onClick={() => setSelected("scan")}
                to="scan"
              >
                <TbScan
                  className={`${
                    isCollapsed
                      ? " h-[26px] w-[26px] "
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Scan Fundus</span>}
              </NavLink> */}
              <NavLink
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "scribe"
                    ? "xl:bg-c-primary text-f-light font-semibold "
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
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
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
                      ? " h-[26px] w-[26px]  justify-center"
                      : " h-[26px] w-[26px] xl:mr-3"
                  }`}
                />
                {!isCollapsed && <span className="ml-2">Patients</span>}
              </NavLink>
              <NavLink
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
                  selected === "appointment"
                    ? "xl:bg-c-primary text-f-light font-semibold "
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
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-secondary xl:active:bg-sb-pressed-secondary xl:focus:bg-c-secondary ${
                  selected === "dashboard"
                    ? "xl:bg-c-secondary text-f-light font-semibold "
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
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-secondary xl:active:bg-sb-pressed-secondary xl:focus:bg-c-secondary ${
                  selected === "add-patient"
                    ? "xl:bg-c-secondary text-f-light font-semibold "
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
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-secondary xl:active:bg-sb-pressed-secondary xl:focus:bg-c-secondary ${
                  selected === "patient"
                    ? "xl:bg-c-secondary text-f-light font-semibold "
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
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-secondary xl:active:bg-sb-pressed-secondary xl:focus:bg-c-secondary ${
                  selected === "appointment"
                    ? "xl:bg-c-secondary text-f-light font-semibold "
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
                className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-secondary xl:active:bg-sb-pressed-secondary xl:focus:bg-c-secondary ${
                  selected === "inventory"
                    ? "xl:bg-c-secondary text-f-light font-semibold "
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
        <div className="flex flex-col xl:gap-2 h-auto">
          <hr className="my-5  border-f-gray" />
          {isCollapsed ? (
            ""
          ) : (
            <h1 className="ml-5 text-[14px] text-c-gray3 ">OTHER</h1>
          )}

          <NavLink
            className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
              selected === "profile"
                ? "xl:bg-c-primary text-f-light font-semibold "
                : "text-f-dark font-medium"
            }${
              isCollapsed ? "xl:px-2 py-2 justify-center" : "xl:py-3 xl:px-4 "
            }`}
            onClick={() => setSelected("profile")}
            to="profile"
          >
            <FaRegStickyNote
              className={`${
                isCollapsed
                  ? " h-[26px] w-[26px]"
                  : " h-[26px] w-[26px] xl:mr-3"
              }`}
            />
            {!isCollapsed && <span className="ml-2">Profile</span>}
          </NavLink>
          <NavLink
            className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary ${
              selected === "help"
                ? "xl:bg-c-primary text-f-light font-semibold "
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
            {!isCollapsed && <span className="ml-2">Help Center</span>}
          </NavLink>
        </div>
        <NavLink
          className={` flex items-center text-p-rg py-3 px-4 text-f-dark rounded-md xl:hover:bg-sb-hover-prime xl:active:bg-sb-pressed-prime xl:focus:bg-c-primary mt-5 ${
            isCollapsed ? "xl:px-2 py-2 justify-center" : "xl:py-3 xl:px-4 "
          }`}
          onClick={logout}
          to={"/login"}
        >
          <IoLogOutOutline
            className={`${
              isCollapsed
                ? " xl:h-[25px] xl:w-[25px] h-[30px] w-[30px] "
                : " h-[26px] w-[26px]  xl:h-[30px] xl:w-[30px] xl:mr-3 "
            }`}
          />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
