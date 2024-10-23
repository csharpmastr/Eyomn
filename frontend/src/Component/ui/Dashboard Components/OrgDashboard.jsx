import React, { useState, useEffect } from "react";
import DbCard from "./DbCard";
import DbGraph from "./DbGraph";
import DbAppointment from "./DbAppointment";
import DbTable from "./DbTable";
import DbProduct from "./DbProduct";

const OrgDashboard = () => {
  const dummyData = [
    {
      title: "Gross Income",
      value: "Php. 20,000",
      percentageChange: "+4.3%",
    },
    { title: "Total Patients", value: "500", percentageChange: "+4.3%" },
    { title: "Total Product", value: "13, 200", percentageChange: "+4.3%" },
    { title: "Number of Staffs", value: "21", percentageChange: "+4.3%" },
  ];

  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });

  const formatDateTime = () => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0];
    setCurrentDateTime({ date: formattedDate, time: formattedTime });
  };

  useEffect(() => {
    formatDateTime();
    const intervalId = setInterval(formatDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="flex w-full gap-6">
        <DbCard data={dummyData} />
        <div className="flex flex-col justify-between bg-white p-4 rounded-lg">
          <div className="font-Poppins text-p-sm">
            <p>Date: {currentDateTime.date}</p>
            <p>Time: {currentDateTime.time}</p>
          </div>
          <select className="hover:cursor-pointer h-fit w-fit focus:outline-none bg-[#E0EAEA] border border-c-primary text-c-primary px-2 py-1 rounded-md">
            <option value="" disabled selected>
              All Branch
            </option>
            <option value="filter1">Filter 1</option>
            <option value="filter2">Filter 2</option>
            <option value="filter3">Filter 3</option>
          </select>
        </div>
      </div>
      <div className="flex w-full h-full gap-6">
        <div className=" w-1/3 ">
          <DbProduct />
        </div>
        <div className="w-2/3">
          <DbGraph />
        </div>
      </div>
      <div className="flex w-full gap-6">
        <div className="w-2/3">
          <DbTable />
        </div>
        <div className="w-1/3">
          <DbAppointment />
        </div>
      </div>
    </>
  );
};

export default OrgDashboard;
