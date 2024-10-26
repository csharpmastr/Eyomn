import React, { Suspense } from "react";
import DbCard from "./DbCard";
import DbGraph from "./DbGraph";
import DbAppointment from "./DbAppointment";
import DbTable from "./DbTable";
import { useSelector } from "react-redux";

// Loader Component as fallback UI
const Loader = () => (
  <div className="flex justify-center items-center h-64 text-gray-500">
    Loading dashboard...
  </div>
);

const DocDashboard = () => {
  const patients = useSelector((state) => state.reducer.patient.patients || []);
  const patientCount = patients.length;

  // Dummy data for cards
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
    { title: "Total Patients", value: patientCount, percentageChange: "+4.3%" },
  ];

  // Conditionally render dashboard only if patients data is available
  return (
    <>
      {patients.length ? (
        <Suspense fallback={<Loader />}>
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
        </Suspense>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default DocDashboard;
