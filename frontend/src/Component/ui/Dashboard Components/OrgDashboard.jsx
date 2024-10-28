import React, { useState, useEffect, Suspense, lazy } from "react";
import { useSelector } from "react-redux";

const DbCard = lazy(() => import("./DbCard"));
const DbGraph = lazy(() => import("./DbGraph"));
const DbAppointment = lazy(() => import("./DbAppointment"));
const DbTable = lazy(() => import("./DbTable"));
const DbProduct = lazy(() => import("./DbProduct"));

const OrgDashboard = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const products = useSelector((state) => state.reducer.product.products);
  const staffs = useSelector((state) => state.reducer.staff.staffs);

  const patientCount = patients.length;
  const productCount = products.length;
  const staffCount = staffs.length;

  const dummyData = [
    { title: "Gross Income", value: "Php. 20,000", percentageChange: "+4.3%" },
    { title: "Total Patients", value: patientCount, percentageChange: "+4.3%" },
    { title: "Total Product", value: productCount, percentageChange: "+4.3%" },
    { title: "Number of Staffs", value: staffCount, percentageChange: "+4.3%" },
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
        <div className="w-1/3">
          <Suspense fallback={<div>Loading products...</div>}>
            <DbProduct />
          </Suspense>
        </div>
        <div className="w-2/3">
          <Suspense fallback={<div>Loading graph...</div>}>
            <DbGraph patients={patients} />
          </Suspense>
        </div>
      </div>
      <div className="flex w-full gap-6">
        <div className="w-2/3">
          <Suspense fallback={<div>Loading table...</div>}>
            <DbTable />
          </Suspense>
        </div>
        <div className="w-1/3">
          <Suspense fallback={<div>Loading appointments...</div>}>
            <DbAppointment />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default OrgDashboard;
