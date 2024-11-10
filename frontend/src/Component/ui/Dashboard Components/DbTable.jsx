import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../../Hooks/useFetchData";

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const DbTable = () => {
  const { loading } = useFetchData();
  const patients = useSelector((state) => state.reducer.patient.patients);

  const sortedPatients =
    !loading && patients?.length > 0
      ? [...patients].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      : [];

  const currentData = sortedPatients.slice(0, 10);
  const navigate = useNavigate();

  const viewAll = () => {
    navigate(`/patient`);
  };

  return (
    <div className="text-p-sm md:text-p-rg h-[500px] rounded-lg bg-white p-4 overflow-clip shadow-sm text-f-dark">
      <header className="flex justify-between items-center text-c-secondary">
        <h1 className="font-medium text-nowrap text-c-secondary">
          | Recent Patients
        </h1>
        <button
          onClick={viewAll}
          className="px-2 py-1 border border-c-primary text-c-primary rounded-md"
        >
          View All
        </button>
      </header>
      <div className="text-left flex py-4 bg-bg-mc rounded-md mt-6 mb-3 shadow-sm text-f-gray2">
        <div className="pl-8 w-1/4">Patient Name</div>
        <div className="w-1/4">Contact</div>
        <div className="w-1/4">Email</div>
        <div className="w-1/4 pl-2">Last Visit</div>
      </div>
      <div className="h-full overflow-auto pb-32 flex flex-col gap-3">
        {currentData.map((patientData, index) => (
          <div
            key={index}
            className="py-4 cursor-pointer flex bg-f-light rounded-md shadow-sm"
          >
            <div className="pl-8 w-1/4">
              {patientData.first_name + " " + patientData.last_name}
            </div>
            <div className="w-1/4">{patientData.contact_number}</div>
            <div className="w-1/4 truncate">{patientData.email}</div>
            <div className="w-1/4 pl-2">
              {formatDate(patientData.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DbTable;
