import React, { useState, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
import Nodatafound from "../../assets/Image/nodatafound.png";
import RoleColor from "../../assets/Util/RoleColor";
import SharePatientModal from "./SharePatientModal";

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const Table = ({
  data,
  handlePatientClick,
  handleSharePatientClick,
  userRole,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState({});
  const [collapsedRows, setCollapsedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPageButtons = 4;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const toggleMenu = (patientId, doctorId) => {
    setIsMenuOpen((prev) => ({
      ...prev,
      [patientId]: !prev[patientId],
    }));
    setSelectedPatient({ patientId, doctorId });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuElements = document.querySelectorAll(".menu-dropdown");
      if (isMenuOpen) {
        for (let i = 0; i < menuElements.length; i++) {
          if (menuElements[i] && !menuElements[i].contains(event.target)) {
            setIsMenuOpen({});
          }
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const { btnContentColor } = RoleColor();

  return (
    <>
      {currentData.length > 0 ? (
        <>
          <table className="min-w-full table-auto border-collapse text-f-dark overflow-x-auto font-Poppins text-p-sm md:text-p-rg ">
            <thead>
              <tr className="text-c-gray3 h-16">
                <th className="pl-4 flex-1 text-start font-medium bg-white rounded-l-md border-b">
                  Patient Name
                </th>
                <th className="pl-4 flex-1 text-start font-medium bg-white border-b">
                  Contact
                </th>
                <th className="pl-4 flex-1 text-start font-medium bg-white border-b">
                  Birthdate
                </th>
                <th className="pl-4 flex-1 text-start font-medium bg-white border-b">
                  Last Visit
                </th>
                <th className="pl-4 w-20 bg-white rounded-r-md border-b"></th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((patientData, index) => {
                const isCollapsed =
                  collapsedRows[patientData.patientId] !== false;
                return (
                  <tr key={index} className="h-16">
                    <td
                      className={`pl-4 flex-1 ${
                        index % 2 === 0
                          ? "bg-none"
                          : "bg-white border-b rounded-l-md"
                      }`}
                    >
                      {patientData.first_name + " " + patientData.last_name}
                    </td>
                    <td
                      className={`pl-4 flex-1 ${
                        index % 2 === 0 ? "bg-none" : "bg-white border-b"
                      }`}
                    >
                      {patientData.contact_number}
                    </td>
                    <td
                      className={`pl-4 flex-1 ${
                        index % 2 === 0 ? "bg-none" : "bg-white border-b"
                      }`}
                    >
                      {formatDate(patientData.birthdate)}
                    </td>
                    <td
                      className={`pl-4 flex-1 ${
                        index % 2 === 0 ? "bg-none" : "bg-white border-b"
                      }`}
                    >
                      {formatDate(patientData.createdAt)}
                    </td>
                    <td
                      className={`pl-4 w-20 ${
                        index % 2 === 0
                          ? "bg-none"
                          : "bg-white border-b rounded-r-md"
                      }`}
                    >
                      <FaEllipsisV
                        onClick={() =>
                          toggleMenu(
                            patientData.patientId,
                            patientData.doctorId
                          )
                        }
                        className="text-f-gray2 cursor-pointer"
                      />
                      {isMenuOpen[patientData.patientId] && (
                        <div className="menu-dropdown absolute right-10 -mt-6 w-40 rounded-md shadow-lg bg-white ring-1 ring-f-gray z-50">
                          <div
                            className="p-2"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <a
                              onClick={() =>
                                handlePatientClick(patientData.patientId)
                              }
                              className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-gray-100 rounded-md cursor-pointer"
                            >
                              View Details
                            </a>
                            {userRole !== "0" &&
                              userRole !== "1" &&
                              userRole !== "3" && (
                                <a
                                  className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-gray-100 rounded-md cursor-pointer"
                                  onClick={() => {
                                    handleSharePatientClick(
                                      patientData.patientId,
                                      patientData.doctorId
                                    );
                                  }}
                                >
                                  Share Patient
                                </a>
                              )}
                          </div>
                        </div>
                      )}
                    </td>
                    {!isCollapsed && (
                      <div className="p-4 bg-gray-50 border-t">
                        <p>
                          Additional information or actions for{" "}
                          {patientData.first_name}.
                        </p>
                      </div>
                    )}
                  </tr>
                );
              })}
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
