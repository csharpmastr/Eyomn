import React, { useState, useMemo } from "react";
import { FiUser } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import Form from "../../Component/ui/Form";

import Loader from "../../Component/ui/Loader";
import AddPatientModal from "../../Component/ui/AddPatientModal";
import Table from "../../Component/ui/Table";
import { useSelector } from "react-redux";

const Patient = () => {
  const [isAddPatientModalOpen, setisAddPatientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const role = useSelector((state) => state.reducer.user.user.role);
  const [isLoading, setIsLoading] = useState(false);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const totalPatient = patients.length;

  const filteredPatients = useMemo(
    () =>
      patients.filter((patient) =>
        `${patient.first_name} ${patient.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [searchTerm, patients]
  );

  const openAddPatient = () => setisAddPatientModalOpen(true);
  const closeAddPatient = () => setisAddPatientModalOpen(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="h-full w-full">
      {isLoading && <Loader />}
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <p className="font-Poppins text-p-lg font-semibold text-f-dark">
            {totalPatient} <span className="text-f-gray2">Total patient</span>
          </p>
          <div className="mt-8 md:mt-0 flex flex-row">
            <div
              className={` flex flex-row border border-c-gray3 px-4 rounded-md justify-center items-center w-full ${
                role === "0" ? `` : `md:w-80`
              }`}
            >
              <IoMdSearch className="h-8 w-8 text-c-secondary" />
              <input
                type="text"
                className="w-full text-f-dark font-Poppins focus:outline-none placeholder-f-gray2 bg-bg-mc text-p-rg"
                placeholder="Search patient... "
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="ml-2 h-auto flex justify-center items-center rounded-md px-4 py-3 font-Poppins border border-c-gray3 text-f-dark font-medium font-md hover:cursor-pointer">
              <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
              <select className="md:block hover:cursor-pointer focus:outline-none bg-bg-mc">
                <option value="" disabled selected>
                  Filter
                </option>
                <option value="filter1">Filter 1</option>
                <option value="filter2">Filter 2</option>
                <option value="filter3">Filter 3</option>
              </select>
            </div>
            {role === "0" ? (
              ""
            ) : (
              <>
                <div
                  className="ml-2 h-auto flex justify-center items-center rounded-md px-4 py-3 font-Poppins bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
                  onClick={openAddPatient}
                >
                  <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
                  <h1 className="hidden md:block">Add patient</h1>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-8">
          <Table data={filteredPatients} />
        </div>
      </div>
      <AddPatientModal isOpen={isAddPatientModalOpen} onClose={closeAddPatient}>
        <Form />
      </AddPatientModal>
    </div>
  );
};

export default Patient;
