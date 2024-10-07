import React from "react";
import DbCard from "../../Component/ui/Dashboard Components/DbCard";
import DbStaffCard from "../../Component/ui/Dashboard Components/DbStaffCard";
import DbGraph from "../../Component/ui/Dashboard Components/DbGraph";
import DbAppointment from "../../Component/ui/Dashboard Components/DbAppointment";
import DbTable from "../../Component/ui/Dashboard Components/DbTable";
import { IoIosAddCircleOutline } from "react-icons/io";

const Dashboard = () => {
  return (
    <div className="w-full h-full flex flex-col items-center p-8 font-Poppins gap-6">
      <div className="flex items-center w-full justify-between">
        <div className="flex gap-8">
          <DbCard />
          <DbCard />
          <DbCard />
          <DbCard />
        </div>
        <div className="flex justify-center items-center rounded-md h-fit px-4 py-3 border border-c-gray3 text-f-dark font-medium font-md hover:cursor-pointer">
          <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
          <select className="md:block hover:cursor-pointer focus:outline-none bg-bg-mc">
            <option value="" disabled selected>
              All Branch
            </option>
            <option value="filter1">Filter 1</option>
            <option value="filter2">Filter 2</option>
            <option value="filter3">Filter 3</option>
          </select>
        </div>
      </div>
      <div className="flex w-full h-1/2 overflow-hidden gap-6">
        <div>
          <h1 className="text-p-lg text-c-secondary font-semibold mb-3">
            | Staff List
          </h1>
          <div className="bg-white h-full p-3 rounded-lg overflow-y-scroll flex flex-col gap-3">
            <DbStaffCard />
            <DbStaffCard />
            <DbStaffCard />
          </div>
        </div>
        <div className="w-full h-full">
          <header className="flex w-full justify-between">
            <h1 className="text-p-lg text-c-secondary font-semibold mb-3">
              | Inventory / Patient Graph
            </h1>
            <div className="flex gap-4 text-p-rg font-medium">
              <a href="">Today</a>
              <a href="">This Month</a>
              <a href="">This Year</a>
            </div>
          </header>
          <div className="w-full bg-red-200 rounded-lg h-full pb-10">
            <DbGraph />
          </div>
        </div>
      </div>

      <div className="flex bg-gray-300 w-full h-1/2 gap-6">
        <div className="w-1/2">
          <h1 className="text-p-lg text-c-secondary font-semibold mb-3">
            | Recent Patient
          </h1>
          <div className="h-auto">
            <DbTable />
          </div>
        </div>
        <div className="bg-blue-100 w-1/3">
          <h1 className="text-p-lg text-c-secondary font-semibold mb-3">
            | Upcoming Appointment
          </h1>
        </div>
        <div className="w-1/2 bg-red-400">asdas</div>
      </div>
    </div>
  );
};

export default Dashboard;
