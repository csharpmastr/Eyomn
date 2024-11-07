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
    "/dashboard": {
      main: "Dashboard",
      sub: "Overview of clinic activities, patient stats, and key metrics.",
    },
    "/scribe": {
      main: "Scribe",
      sub: "Efficiently record patient encounters and clinical notes.",
    },
    "/patient": {
      main: "Patients",
      sub: "Access and manage detailed patient profiles and history.",
    },
    "/staff": {
      main: "Staffs",
      sub: "Manage staff profiles, roles, and responsibilities.",
    },
    "/organization": {
      main: "Organization",
      sub: "Configure your clinic’s structure and operational settings.",
    },
    "/add-patient": {
      main: "Add Patient",
      sub: "Easily add new patient information to your records.",
    },
    "/appointment": {
      main: "Appointment Schedule",
      sub: "View, schedule, and manage patient appointments.",
    },
    "/inventory": {
      main: "Inventory",
      sub: "Track medical supplies and control inventory levels.",
    },
    "/report": {
      main: "Reports",
      sub: "Generate and view reports on patient flow, finances, and more.",
    },
    "/stock_checkout": {
      main: "Stock Checkout",
      sub: "Process payments, issue receipts, and track sales history.",
    },
    "/help": {
      main: "Help Center",
      sub: "Access guides, FAQs, and support for your questions.",
    },
    "/profile": {
      main: "Profile",
      sub: "Manage personal settings and account details.",
    },
    "/manage-profile": {
      main: "Settings",
      sub: "Customize your account preferences and notifications.",
    },
    "/notification": {
      main: "Notification",
      sub: "dasdasdasd",
    },
  };

  const getCurrentTab = () => {
    for (const path in tabMapping) {
      if (currentPath.startsWith(path)) return tabMapping[path];
    }
    return null;
  };

  // const getCurrentTab = () => {
  //   for (const [path, name] of Object.entries(tabMapping)) {
  //     if (currentPath.startsWith(path)) {
  //       return name;
  //     }
  //   }
  //   return "";
  // };

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
            <div>
              <h1 className="font-helvetica-rounded font-bold">
                {currentTab?.main}
              </h1>
              <p className="text-p-sm font-normal">{currentTab?.sub}</p>
            </div>
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
