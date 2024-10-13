import React, { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import useLogout from "../../Hooks/useLogout";
import { useNavigate } from "react-router-dom";
import Notification from "../../Component/ui/Notification";

const TopbarButton = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
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

  const screenSize =
    screenWidth >= 1280 ? "xl" : screenWidth >= 1024 ? "lg" : "md";

  const navigate = useNavigate();

  const profile = () => {
    navigate(`profile`);
  };

  const sampleData = [
    {
      name: "John Doe",
      reason: "liked your post",
      timedate: "10 minutes ago",
    },
    {
      name: "Jane Smith",
      reason: "commented on your photo",
      timedate: "1 hour ago",
    },
    {
      name: "Alex Johnson",
      reason: "sent you a friend request",
      timedate: "2 days ago",
    },
    {
      name: "Alex Johnson",
      reason: "sent you a friend request",
      timedate: "2 days ago",
    },
    {
      name: "Alex Johnson",
      reason: "sent you a friend request",
      timedate: "2 days ago",
    },
  ];

  return (
    <div className="relative inline-block text-left w-full">
      <div className="flex items-center gap-4 xl:justify-end">
        <div className="flex w-fit">
          <section className="hidden xl:flex items-center gap-4">
            <IoChevronBackCircleOutline
              className="h-12 w-12 rounded-full"
              onClick={toggleNotification}
            />
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
                <h1 className="text-p-rg font-medium">Albert Bautista</h1>
                <p className="text-p-sm">role</p>
              </div>
            </section>
            <button
              className="text-f-dark text-2xl focus:outline-none"
              aria-expanded={isMenuOpen}
              onClick={toggleDropdown}
            >
              <GiHamburgerMenu />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className={`absolute right-0 w-full xl:w-3/5 rounded-md shadow-lg bg-white ring-1 ring-f-gray 
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
              className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-gray-100"
              role="menuitem"
              onClick={profile}
            >
              Profile
            </a>
            {screenSize === "xl" ? (
              ""
            ) : (
              <a
                className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-gray-100"
                role="menuitem"
              >
                Notification
              </a>
            )}
            <a
              className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-gray-100"
              role="menuitem"
              onClick={logout}
            >
              Logout
            </a>
          </div>
        </div>
      )}
      {notifOpen && <Notification data={sampleData} />}
    </div>
  );
};

export default TopbarButton;
