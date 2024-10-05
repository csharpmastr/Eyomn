
import React, { useContext } from "react";
import SideBar from "./Main Page/SideBar";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { WebSocketProvider } from "../Context/WebSocketContext";
import { AuthContext } from "../Context/AuthContext";

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
    <WebSocketProvider>
      <div className="flex xl:flex-row flex-col h-screen overflow-hidden">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="hidden xl:h-20 w-full bg-white font-Poppins text-f-dark border-b-[1px] border-f-gray xl:flex items-center xl:px-8 text-h6 font-medium">
            {currentTab}
          </div>
          <div className="flex-1 overflow-auto bg-bg-mc">
            <Outlet />
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default MVP;
