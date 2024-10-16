import React, { useState, useMemo, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { IoMdSearch, IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import Loader from "../../Component/ui/Loader";
import AddEditPatient from "../../Component/ui/AddEditPatient";
import Table from "../../Component/ui/Table";
import PatientProfile from "./PatientProfile";

const Patient = () => {
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSelected, setHasSelected] = useState(false);
  const role = useSelector((state) => state.reducer.user.user.role);
  const [isLoading, setIsLoading] = useState(false);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const totalPatient = patients.length;
  const navigate = useNavigate();
  const location = useLocation();
  const filteredPatients = useMemo(() => {
    if (!Array.isArray(patients) || patients.length === 0) {
      return [];
    }
    return patients.filter((patient) =>
      `${patient.first_name} ${patient.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, patients]);

  const openAddPatient = () => setIsAddPatientModalOpen(true);
  const closeAddPatient = () => setIsAddPatientModalOpen(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePatientClick = (patientId) => {
    console.log(patientId);

    setHasSelected(true);
    sessionStorage.setItem("currentPatient", patientId);
    navigate(`/patient/${patientId}`);
  };

  useEffect(() => {
    if (location.pathname === "/patient") {
      setHasSelected(false);
    }
    if (location.state && location.state.resetSelected) {
      setHasSelected(false);
    }
  }, [location]);

  useEffect(() => {
    const storedPatientId = sessionStorage.getItem("currentPatient");

    if (storedPatientId) {
      setHasSelected(true);
      navigate(`/patient/${storedPatientId}`);
    }
  }, [navigate]);
  return (
    <div className="h-screen w-full font-Poppins">
      {hasSelected ? (
        <Outlet />
      ) : (
        <>
          {isLoading && <Loader />}
          <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <p className="text-p-lg font-semibold text-f-dark">
                {totalPatient}{" "}
                <span className="text-f-gray2">Total patient</span>
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
                    className="w-full text-f-dark focus:outline-none placeholder-f-gray2 bg-bg-mc text-p-rg"
                    placeholder="Search patient... "
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="ml-2 h-auto flex justify-center items-center rounded-md px-4 py-3 border border-c-gray3 text-f-dark font-medium font-md hover:cursor-pointer">
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
                {role === "0" || role === "1" ? (
                  ""
                ) : (
                  <div
                    className="ml-2 h-auto flex justify-center items-center rounded-md px-4 py-3 bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
                    onClick={openAddPatient}
                  >
                    <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
                    <h1 className="hidden md:block">Add patient</h1>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8">
              <Table
                data={filteredPatients}
                handlePatientClick={handlePatientClick}
              />
            </div>
          </div>
        </>
      )}
      {isAddPatientModalOpen && <AddEditPatient onClose={closeAddPatient} />}
    </div>
  );
};

export default Patient;
