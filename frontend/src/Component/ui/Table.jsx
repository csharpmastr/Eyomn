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
    <table className="w-full font-Poppins rounded-lg table-fixed">
      <thead className="w-full">
        <tr className="text-left bg-[#EDECEC] font-semibold text-[#A7A7A7]">
          <th className="p-6 rounded-tl-md rounded-bl-md w-1/5">
            Patient Name
          </th>
          <th className="w-1/6">Contact</th>
          <th className="w-1/5">Email</th>
          <th className="w-1/5">Address</th>
          <th className="p-6 rounded-tr-md rounded-br-md w-1/5">Registered</th>
        </tr>
      </thead>
      <tbody>
        {data.map((patientData, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-white" : "bg-[#F9F9FF]"}
          >
            <td className="px-4 py-4 h-16">
              {patientData.first_name + " " + patientData.last_name}
            </td>
            <td className="py-4 h-12">{patientData.contact_number}</td>
            <td className="max-w-[15vw] truncate pr-4 py-4 h-16">
              {patientData.email}
            </td>
            <td className="py-4 h-12">
              {capitalizeFirstLetter(patientData.municipality) +
                ", " +
                capitalizeFirstLetter(patientData.province)}
            </td>
            <td className="py-4 h-12">{formatDate(patientData.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
