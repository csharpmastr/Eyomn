import React, { useState, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
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

const Table = ({ data, handlePatientClick, handleSharePatientClick }) => {
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
        <div className="w-full text-f-dark overflow-x-auto font-Poppins rounded-t-lg text-p-rg">
          <header className="flex py-5 rounded-md border-b bg-white text-f-gray2">
            <div className="flex-1 pl-8">Patient Name</div>
            <div className="flex-1">Contact</div>
            <div className="flex-1">Email</div>
            <div className="flex-1">Last Visit</div>
            <div className="w-20"></div>
          </header>
          <main>
            {currentData.map((patientData, index) => {
              const isCollapsed =
                collapsedRows[patientData.patientId] !== false;
              return (
                <section
                  key={index}
                  className={`rounded-md ${
                    index % 2 === 0 ? "bg-none" : "bg-white border-b"
                  }`}
                >
                  <div className="flex items-center py-5 text-p-rg">
                    <div className="flex-1 pl-8">
                      {patientData.first_name + " " + patientData.last_name}
                    </div>
                    <div className="flex-1">{patientData.contact_number}</div>
                    <div className="flex-1 truncate">{patientData.email}</div>
                    <div className="flex-1">
                      {formatDate(patientData.createdAt)}
                    </div>
                    <div className="w-20 flex items-center gap-4">
                      <FaEllipsisV
                        onClick={() =>
                          toggleMenu(
                            patientData.patientId,
                            patientData.doctorId
                          )
                        } // Pass doctorId as well
                        className="text-f-gray2 cursor-pointer"
                      />
                    </div>
                    {isMenuOpen[patientData.patientId] && (
                      <div className="menu-dropdown absolute right-0 w-40 mt-2 rounded-md shadow-lg bg-white ring-1 ring-f-gray z-50">
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
                        </div>
                      </div>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="p-4 bg-gray-50 border-t">
                      <p>
                        Additional information or actions for{" "}
                        {patientData.first_name}.
                      </p>
                    </div>
                  )}
                </section>
              );
            })}
          </main>
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
        </div>
      ) : (
        <div className="w-full mt-40 flex flex-col items-center justify-center text-center text-[#96B4B4] text-p-lg font-medium gap-4">
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
