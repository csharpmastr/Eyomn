import React from "react";

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Helper function to format date as "Month Day, Year"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const Table = ({ data }) => {
  return (
    <table className="w-full font-Poppins rounded-t-lg table-fixed">
      <thead className="w-full h-20">
        <tr className="text-left bg-white font-semibold text-c-secondary">
          <th className="pl-8 w-1/4">Patient Name</th>
          <th className="w-1/4">Contact</th>
          <th className="w-1/4">Email</th>
          <th className="w-1/4">Last Visit</th>
        </tr>
      </thead>
      <tbody>
        {data.map((patientData, index) => (
          <tr
            key={index}
            className={`border-b-[1px] border-[#E1E1E1] h-20 text-c-secondary text-p-rg ${
              index % 2 === 0 ? "bg-none" : `bg-white`
            }`}
          >
            <td className="pl-8">
              {patientData.first_name + " " + patientData.last_name}
            </td>
            <td>{patientData.contact}</td>
            <td className="max-w-[15vw] truncate">{patientData.email}</td>
            <td>{formatDate(patientData.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
