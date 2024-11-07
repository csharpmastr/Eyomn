import React, { useState, useMemo, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { IoMdSearch, IoIosAddCircleOutline } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { useSelector } from "react-redux";
import Loader from "../../Component/ui/Loader";
import AddEditPatient from "../../Component/ui/AddEditPatient";
import Table from "../../Component/ui/Table";
import { FiPlus } from "react-icons/fi";

const Patient = () => {
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSelected, setHasSelected] = useState(false);
  const [sortOption, setSortOption] = useState("");
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

    // Search filter
    let filtered = patients.filter((patient) =>
      `${patient.first_name} ${patient.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    // Sort filter
    if (sortOption === "ascending") {
      filtered = filtered.sort((a, b) =>
        `${a.first_name} ${a.last_name}`.localeCompare(
          `${b.first_name} ${b.last_name}`
        )
      );
    } else if (sortOption === "descending") {
      filtered = filtered.sort((b, a) =>
        `${a.first_name} ${a.last_name}`.localeCompare(
          `${b.first_name} ${b.last_name}`
        )
      );
    } else if (sortOption === "newest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.last_visit) - new Date(a.last_visit)
      );
    } else if (sortOption === "oldest") {
      filtered = filtered.sort(
        (a, b) => new Date(a.last_visit) - new Date(b.last_visit)
      );
    }

    return filtered;
  }, [searchTerm, patients, sortOption]);

  const openAddPatient = () => setIsAddPatientModalOpen(true);
  const closeAddPatient = () => setIsAddPatientModalOpen(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePatientClick = (patientId) => {
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
          <div className="p-4 md:p-6 2xl:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between text-p-rg">
              <p className="font-semibold text-c-secondary text-p-lg">
                {totalPatient}{" "}
                <span className="text-f-gray2 font-medium">Total patient</span>
              </p>
              <div className="mt-2 md:mt-0 flex flex-row gap-3">
                <div className="flex justify-center items-center rounded-md px-4 py-3 border border-f-gray bg-bg-sub text-c-gray3 font-normal hover:cursor-pointer">
                  <select
                    className="hover:cursor-pointer focus:outline-none bg-f-light w-fit"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="" disabled selected>
                      Sort by
                    </option>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                    <option value="oldest">Oldest</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
                <div
                  className={`flex flex-row gap-2 border border-gray-300 bg-bg-sub px-4 rounded-md justify-center items-center w-full ${
                    role === "0" ? `` : `md:w-80`
                  }`}
                >
                  <IoMdSearch className="h-6 w-6 text-c-secondary" />
                  <input
                    type="text"
                    className="w-full text-f-dark focus:outline-none placeholder-f-gray2 bg-bg-sub"
                    placeholder="Search patient name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                {role === "0" || role === "1" ? (
                  ""
                ) : (
                  <div
                    className="h-fit flex justify-center items-center rounded-md px-4 py-3 bg-c-secondary text-f-light hover:cursor-pointer"
                    onClick={openAddPatient}
                  >
                    <FiPlus className="h-5 w-5 md:mr-2" />
                    <h1 className="hidden md:block">Add patient</h1>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-6">
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
