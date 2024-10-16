import React, { useState } from "react";

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const Table = ({ data, handlePatientClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPageButtons = 4;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  return (
    <div>
      <table className="w-full font-Poppins rounded-t-lg table-fixed bg-white">
        <thead className="w-full h-20">
          <tr className="text-left font-semibold text-c-secondary">
            <th className="pl-8 w-1/4">Patient Name</th>
            <th className="w-1/4">Contact</th>
            <th className="w-1/4">Email</th>
            <th className="w-1/4">Last Visit</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((patientData, index) => (
            <tr
              key={index}
              className={`border-b border-f-gray h-20 text-c-secondary text-p-rg cursor-pointer ${
                index % 2 === 0 ? "bg-bg-mc" : `bg-white`
              }`}
              onClick={() => handlePatientClick(patientData.patientId)}
            >
              <td className="pl-8">
                {patientData.first_name + " " + patientData.last_name}
              </td>
              <td>{patientData.contact_number}</td>
              <td className="max-w-[15vw] truncate">{patientData.email}</td>
              <td>{formatDate(patientData.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === 1
              ? "bg-gray-400 text-f-light"
              : "bg-gray-200 text-f-gray2"
          }`}
        >
          &lt;
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(startPage + index)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === startPage + index
                ? "bg-c-secondary text-f-light"
                : "bg-gray-200 text-f-gray2"
            }`}
          >
            {startPage + index}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-400 text-f-light"
              : "bg-gray-200 text-f-gray2"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Table;
