import React from "react";
import DbCard from "./DbCard";
import DbGraph from "./DbGraph";
import DbAppointment from "./DbAppointment";
import DbTable from "./DbTable";

const DocDashboard = () => {
  const dummyData = [
    {
      title: "Number of Visit Today",
      value: "8",
      percentageChange: "+4.3%",
    },

    {
      title: "Total Patients this Month",
      value: "22",
      percentageChange: "+4.3%",
    },
    { title: "Total Patients", value: "500", percentageChange: "+4.3%" },
  ];

  return (
    <>
      <div className="flex w-full gap-6">
        <DbCard data={dummyData} />
      </div>
      <div className="w-full flex gap-6">
        <div className="w-2/3">
          <DbGraph />
        </div>
        <div className="w-1/3">
          <DbAppointment />
        </div>
      </div>
      <div className="w-full">
        <DbTable />
      </div>
    </>
  );
};

export default DocDashboard;
