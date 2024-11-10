import React, { useState } from "react";
import Nodatafound from "../../assets/Image/nodatafound.png";
import RoleColor from "../../assets/Util/RoleColor";

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

  const { btnContentColor } = RoleColor();

  return (
    <>
      {currentData.length > 0 ? (
        <>
          <div className="w-fit md:w-full text-f-dark overflow-x-auto font-Poppins rounded-t-lg text-p-sm md:text-p-rg">
            <header className="w-full py-5 rounded-md flex border-b bg-white text-f-gray2">
              <h1 className="pl-8 w-1/4">Patient Name</h1>
              <h1 className="w-1/4">Contact</h1>
              <h1 className="w-1/4">Email</h1>
              <h1 className="w-1/4">Last Visit</h1>
            </header>
            <div>
              {currentData.map((patientData, index) => (
                <section
                  key={index}
                  className={`py-5 cursor-pointer flex w-full rounded-md ${
                    index % 2 === 0
                      ? "bg-none border-none"
                      : `bg-white border-b`
                  }`}
                  onClick={() => handlePatientClick(patientData.patientId)}
                >
                  <h1 className="pl-8 w-1/4">
                    {patientData.first_name + " " + patientData.last_name}
                  </h1>
                  <h1 className="w-1/4">{patientData.contact_number}</h1>
                  <h1 className="w-1/4 truncate">{patientData.email}</h1>
                  <h1 className="w-1/4">{formatDate(patientData.createdAt)}</h1>
                </section>
              ))}
            </div>
          </div>
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
                    ? `${btnContentColor} text-f-light`
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
        </>
      ) : (
        <div className="w-full mt-40 flex flex-col items-center justify-center text-center text-[#96B4B4] text-p-rg md:text-p-lg font-medium gap-4">
          <img src={Nodatafound} alt="no data image" className="w-80" />
          <p>
            We couldn't find any patients. Check your spelling
            <br />
            or try different keywords.
          </p>
        </div>
      )}
    </>
  );
};

export default Table;
