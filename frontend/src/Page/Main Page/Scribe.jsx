import React, { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import PatientScribeCard from "../../Component/ui/PatientScribeCard";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Sample from "../../assets/Image/3.png";

const groupPatientsByInitial = (patients) => {
  if (!Array.isArray(patients) || patients.length === 0) {
    return {};
  }

  return patients.reduce((acc, patient) => {
    if (!patient || !patient.first_name) {
      return acc;
    }

    const initial = patient.first_name[0].toUpperCase();

    if (!acc[initial]) {
      acc[initial] = [];
    }
    acc[initial].push(patient);

    return acc;
  }, {});
};

const Scribe = () => {
  const [hasSelected, setHasSelected] = useState(false);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedPatientId = sessionStorage.getItem("currentPatientId");
    const storedLocation = sessionStorage.getItem("currentPath");

    if (storedPatientId && storedLocation) {
      setHasSelected(true);

      navigate(storedLocation);
    }
  }, [navigate]);

  const handleClickPatient = (id) => {
    const clickedPatient = patients.find((patient) => patient.patientId === id);
    setHasSelected(true);

    if (clickedPatient) {
      const newPath = `/scribe/${id}`;
      sessionStorage.setItem("currentPatientId", id);
      sessionStorage.setItem("currentPath", newPath);

      navigate(newPath);
    } else {
      console.error("Patient not found");
    }
  };

  useEffect(() => {
    if (location.pathname === "/scribe") {
      setHasSelected(false);
    }
    if (location.state && location.state.resetSelected) {
      setHasSelected(false);
    }
  }, [location]);

  const groupedPatients = groupPatientsByInitial(patients);
  const sortedInitials = Object.keys(groupedPatients).sort();

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const filteredGroupedPatients = groupPatientsByInitial(filteredPatients);
  const sortedFilteredInitials = Object.keys(filteredGroupedPatients).sort();

  return (
    <div className="h-full w-full">
      {hasSelected ? (
        <Outlet />
      ) : (
        <div className="p-4 md:p-6 xl:p-8 font-Poppins h-full overflow-clip">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <p className="text-p-lg font-semibold text-f-dark">
              {patients.length || 0}{" "}
              <span className="text-f-gray2">Total patient</span>
            </p>
            <div className="mt-8 md:mt-0 flex flex-row">
              <div className="w-full flex flex-row border border-c-gray3 px-4 rounded-md justify-center items-center md:w-80">
                <IoMdSearch className="h-8 w-8 text-c-secondary" />
                <input
                  type="text"
                  placeholder="Search patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-f-dark focus:outline-none placeholder-f-gray2 bg-bg-mc text-p-rg"
                />
              </div>
              <div className="ml-2 h-auto w- flex justify-center items-center rounded-md px-4 py-3 border border-c-gray3 text-f-dark font-medium font-md hover:cursor-pointer">
                <FiFilter className="h-6 w-6 md:mr-2" />
                <select className="hover:cursor-pointer focus:outline-none bg-bg-mc w-16">
                  <option value="" disabled selected>
                    Filter
                  </option>
                  <option value="-">-</option>
                  <option value="-">-</option>
                  <option value="-">-</option>
                </select>
              </div>
            </div>
          </div>
          <div className="w-auto h-full mt-8 overflow-y-scroll">
            {sortedFilteredInitials.length > 0 ? (
              sortedFilteredInitials.map((initial) => (
                <div key={initial} className="mb-8">
                  <h2 className="text-p-lg text-f-gray2 mb-4">{initial}</h2>
                  <div className="grid grid-cols-5 gap-8 px-4">
                    {filteredGroupedPatients[initial].map((patient, index) => (
                      <PatientScribeCard
                        key={index}
                        name={`${patient.first_name} ${patient.last_name}`}
                        onClick={() => handleClickPatient(patient.patientId)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center text-c-primary text-p-lg font-medium gap-4">
                <img src={Sample} alt="no data image" className="w-80" />
                <p>
                  We couldn't find any patients. Check your spelling
                  <br />
                  or try different keywords.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scribe;
