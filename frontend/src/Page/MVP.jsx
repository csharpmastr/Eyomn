import React, { useContext, useEffect, useState } from "react";
import SideBar from "./Main Page/Sidebar";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { WebSocketProvider } from "../Context/WebSocketContext";
import { useDispatch, useSelector } from "react-redux";
import { useFetchData } from "../Hooks/useFetchData";
import Cookies from "universal-cookie";

const MVP = () => {
  const { fetchData } = useFetchData();

  const location = useLocation();
  const currentPath = location.pathname;

  const [hasFetched, setHasFetched] = useState(false);

  const tabMapping = {
    "/dashboard": "Dashboard",
    "/scan": "Scan Fundus",
    "/scribe": "Scribe",
    "/patient": "Patients",
    "/staff": "Staffs",
    "/organization": "Organization",
    "/add-patient": "Add Patient",
    "/appointment": "Appointment",
    "/inventory": "Inventory",
    "/help": "Help Center",
    "/profile": "Profile",
  };

  const getCurrentTab = () => {
    for (const [path, name] of Object.entries(tabMapping)) {
      if (currentPath.startsWith(path)) {
        return name;
      }
    }
    return "";
  };

  if (!currentPath.startsWith("/scribe")) {
    sessionStorage.removeItem("currentPatientId");
  }

  useEffect(() => {
    if (!hasFetched) {
      fetchData();
      setHasFetched(true);
    }
  }, [hasFetched]);

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
