import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../../Hooks/useFetchData";
import { FiArrowRight } from "react-icons/fi";

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const DbTable = ({ role }) => {
  const { loading } = useFetchData();
  const patients = useSelector((state) => state.reducer.patient.patients);

  const sortedPatients =
    !loading && patients?.length > 0
      ? [...patients].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      : [];

  const currentData = sortedPatients.slice(0, 5);
  const navigate = useNavigate();

  const viewAll = () => {
    navigate(`/patient`);
  };

  return (
    <div
      className={`text-p-sm md:text-p-rg rounded-lg bg-white p-4 overflow-auto shadow-sm text-f-dark font-Poppins ${
        role === "2" ? "h-[440px]" : "h-[400px]"
      }`}
    >
      <header className="flex justify-between items-center text-c-secondary">
        <h1 className="font-medium text-nowrap text-c-secondary">
          Recent Patients
        </h1>
        <button
          onClick={viewAll}
          className="flex items-center gap-1 font-medium text-p-sm hover:font-semibold text-c-gray3"
        >
          View all <FiArrowRight />
        </button>
      </header>
      <table className="min-w-full mt-6 table-auto border-collapse text-f-dark text-p-sm md:text-p-rg">
        <thead>
          <tr className="text-c-gray3 h-16">
            <th className="pl-4 flex-1 text-start font-medium bg-bg-mc rounded-l-md">
              Patient Name
            </th>
            <th className="pl-4 flex-1 text-start font-medium bg-bg-mc">
              Birthday
            </th>
            <th className="pl-4 flex-1 text-start font-medium bg-bg-mc rounded-r-md">
              Last Visit
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((patientData, index) => (
            <tr className="h-14" key={index}>
              <td
                className={`pl-4 flex-1 ${
                  index % 2 === 0 ? "bg-none" : "bg-bg-mc rounded-l-md"
                }`}
              >
                {patientData.first_name + " " + patientData.last_name}
              </td>
              <td
                className={`pl-4 flex-1 ${
                  index % 2 === 0 ? "bg-none" : "bg-bg-mc"
                }`}
              >
                {formatDate(patientData.birthdate)}
              </td>
              <td
                className={`pl-4 flex-1 ${
                  index % 2 === 0 ? "bg-none" : "bg-bg-mc rounded-r-md"
                }`}
              >
                {formatDate(patientData.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DbTable;
