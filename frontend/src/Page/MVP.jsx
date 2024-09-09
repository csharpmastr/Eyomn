import React from "react";
import SideBar from "./Main Page/SideBar";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

const MVP = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getCurrentTab = () => {
    if (currentPath.startsWith("/dashboard")) {
      return "Dashboard";
    } else if (currentPath.startsWith("/scan")) {
      return "Scan Fundus";
    } else if (currentPath.startsWith("/scribe")) {
      return "Scribe";
    } else if (currentPath.startsWith("/patient")) {
      return "Patients";
    } else if (currentPath.startsWith("/staff")) {
      return "Staffs";
    } else if (currentPath.startsWith("/organization")) {
      return "Organization";
    } else if (currentPath.startsWith("/add-patient")) {
      return "Add Patient";
    } else {
      return "";
    }
  };

  const currentTab = getCurrentTab();

  return (
    <div className="flex xl:flex-row flex-col h-screen overflow-hidden">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="hidden xl:h-[8vh] w-full bg-[#1ABC9C] font-Poppins text-white xl:flex items-center xl:pl-5 text-[22px]">
          {currentTab}
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MVP;
