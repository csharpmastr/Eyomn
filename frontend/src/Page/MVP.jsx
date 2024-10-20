import React, { useContext, useEffect, useState } from "react";
import SideBar from "./Main Page/Sidebar";
import TopbarButton from "./Main Page/TopbarButton";
import LLMChatbot from "../Component/ui/LLMChatbot";
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
  const hasFetched = localStorage.getItem("hasFetched");
  const [isFetched, setIsFetched] = useState(hasFetched === "true");

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
    "/report": "Reports",
    "/pos": "Point of Sale",
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
    sessionStorage.removeItem("currentPath");
  }
  if (!currentPath.startsWith("/patient")) {
    sessionStorage.removeItem("currentPatient");
  }

  useEffect(() => {
    if (!isFetched) {
      console.log("Testing");
      fetchData();
      setIsFetched(true);
      localStorage.setItem("hasFetched", true);
    }
  }, [isFetched, fetchData]);

  const currentTab = getCurrentTab();

  return (
    <WebSocketProvider>
      <div className="flex xl:flex-row flex-col h-screen overflow-hidden">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="hidden xl:h-20 w-full bg-white font-Poppins text-f-dark border-b border-f-gray xl:flex items-center xl:px-6 text-h-h6 font-bold justify-between">
            <h1>{currentTab}</h1>
            <div className="xl:w-2/6 w-full h-full flex items-center xl:justify-end">
              <TopbarButton />
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-bg-mc">
            <Outlet />
            {currentTab != "Dashboard" && <LLMChatbot />}
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default MVP;
