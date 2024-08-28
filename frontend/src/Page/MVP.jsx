import React from "react";
import SideBar from "./Main Page/SideBar";
import { Outlet } from "react-router-dom";

const MVP = () => {
  return (
    <div className="h-[100vh] flex xl:flex-row flex-col">
      <SideBar />
      <div className="flex-1 ">
        <div className="hidden h-[8vh] bg-[#1ABC9C] xl:block ">hello</div>
        <Outlet />
      </div>
    </div>
  );
};

export default MVP;
