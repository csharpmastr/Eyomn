import React, { useState, useEffect } from "react";
import useLogout from "../../Hooks/useLogout";
import { useNavigate } from "react-router-dom";
import Notification from "../../Component/ui/Notification";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiBell } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";

import { useSelector } from "react-redux";
const TopbarButton = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const user = useSelector((state) => state.reducer.user.user);
  const role = user.role;
  const notification = useSelector(
    (state) => state.reducer.notification.notifications
  );
  const { logout } = useLogout();

  const toggleDropdown = () => setIsMenuOpen(!isMenuOpen);
  const toggleNotification = () => setNotifOpen(!notifOpen);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(".absolute");
      if (dropdown && !dropdown.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const screenSize =
    screenWidth >= 1280 ? "xl" : screenWidth >= 1024 ? "lg" : "md";

  const navigate = useNavigate();

  const profile = () => {
    navigate(`profile`);
  };

  return (
    <div className="relative inline-block text-left w-full">
      <div className="flex items-center gap-4 xl:justify-end">
        <div className="flex w-fit">
          <section className="hidden xl:flex items-center gap-4 cursor-pointer">
            {notifOpen ? (
              <>
                <IoMdNotifications
                  className="h-6 w-6 rounded-full"
                  onClick={toggleNotification}
                />
              </>
            ) : (
              <>
                <FiBell
                  className="h-6 w-6 rounded-full"
                  onClick={toggleNotification}
                />
              </>
            )}
            <div className="h-10 border-l border-f-gray"></div>
          </section>
          <div className="flex justify-between w-full gap-4">
            <section className="flex items-center gap-4 xl:ml-4">
              <img
                //src={image}
                alt="Profile"
                className="rounded-full w-11 h-11 object-cover hover:cursor-pointer bg-gray-400"
              />
              <div className="flex flex-col">
                {role === "2" || role === "3" ? (
                  <>
                    <h1 className="text-p-rg font-medium">
                      {user.first_name + " " + user.last_name}
                    </h1>
                    <p className="text-p-sm font-normal">{user.position}</p>
                  </>
                ) : role === "0" ? (
                  <>
                    <h1 className="text-p-rg font-medium">
                      {user.organization}
                    </h1>
                    <p className="text-p-sm font-normal">
                      {"Organizational Account"}
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-p-rg font-medium">{user.name}</h1>
                    <p className="text-p-sm font-normal">{"Branch Account"}</p>
                  </>
                )}
              </div>
            </section>
            <button
              className={`text-f-dark text-2xl focus:outline-none transition-all ${
                isMenuOpen ? `rotate-180` : `rotate-0`
              }`}
              aria-expanded={isMenuOpen}
              onClick={toggleDropdown}
            >
              <MdKeyboardArrowDown />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className={`absolute right-0 w-full xl:w-3/5 rounded-md shadow-lg bg-white ring-1 ring-f-gray z-50
        ${
          screenSize === "xl"
            ? "origin-top-right mt-2"
            : "origin-bottom-right mb-2 bottom-12"
        }`}
        >
          <div
            className="p-2"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a
              className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-gray-100 cursor-pointer"
              role="menuitem"
              onClick={profile}
            >
              Profile
            </a>
            {screenSize === "xl" ? (
              ""
            ) : (
              <a
                className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-gray-100 cursor-pointer"
                role="menuitem"
              >
                Notification
              </a>
            )}
            <a
              className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-gray-100 cursor-pointer"
              role="menuitem"
              onClick={logout}
            >
              Logout
            </a>
          </div>
        </div>
      )}
      {notifOpen && <Notification data={notification} />}
    </div>
  );
};

export default TopbarButton;
