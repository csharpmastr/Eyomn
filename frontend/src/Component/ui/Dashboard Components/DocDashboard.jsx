import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";

// Use lazy loading for the components
const DbCard = lazy(() => import("./DbCard"));
const DbGraph = lazy(() => import("./DbGraph"));
const DbAppointment = lazy(() => import("./DbAppointment"));
const DbTable = lazy(() => import("./DbTable"));

const DocDashboard = () => {
  const patients = useSelector((state) => state.reducer.patient.patients);
  const patientCount = patients.length;

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

  return (
    <>
      <div className="flex w-full gap-6">
        {dummyData.map((data) =>
          data.title === "Number of Staffs" && user.role === "3" ? null : (
            <Suspense fallback={<div>Loading cards...</div>} key={data.title}>
              <DbCard
                title={data.title}
                value={data.value}
                percentageChange={data.percentageChange}
              />
            </Suspense>
          )
        )}
      </div>
      <div className="w-full flex gap-6">
        <div className="w-2/3">
          <Suspense fallback={<div>Loading graph...</div>}>
            <DbGraph patients={patients} />
          </Suspense>
        </div>
        <div className="w-1/3">
          <Suspense fallback={<div>Loading appointments...</div>}>
            <DbAppointment />
          </Suspense>
        </div>
      </div>
      <div className="w-full">
        <Suspense fallback={<div>Loading table...</div>}>
          <DbTable />
        </Suspense>
      </div>
    </>
  );
};

export default DocDashboard;
