import React, { useState, useEffect, useRef } from "react";

import { IoMdSearch } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";

import PatientScribeCard from "../../Component/ui/PatientScribeCard";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPatient } from "../../Slice/PatientSlice";

// Function to group patients by initial letter
const groupPatientsByInitial = (patients) => {
  return patients.reduce((acc, patient) => {
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
  const clinicId = useSelector((state) => state.reducer.user.user.clinicId);
  const doctorId = useSelector((state) => state.reducer.user.user.userId);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const navigate = useNavigate();
  const location = useLocation();
  const ws = useRef(null);
  const reduxDispatch = useDispatch();
  useEffect(() => {
    if (location.state && location.state.resetSelected) {
      setHasSelected(false);
    }
  }, [location.state]);

  // useEffect(() => {
  //   ws.current = new WebSocket("ws://localhost:8080");
  //   ws.current.onopen = () => {
  //     console.log("WebSocket connected");
  //     ws.current.send(JSON.stringify({ clinicId, doctorId }));
  //   };

  //   ws.current.onmessage = (event) => {
  //     const updatedPatients = JSON.parse(event.data);

  //     reduxDispatch(addPatient(updatedPatients));
  //   };

  //   ws.current.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };
  //   ws.current.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   return () => {
  //     if (ws.current) {
  //       ws.current.close();
  //     }
  //   };
  // }, [clinicId, doctorId, reduxDispatch]);

  const handleClickPatient = (id) => {
    const clickedPatient = patients.find((patient) => patient.id === id);
    setHasSelected(true);
    if (clickedPatient) {
      sessionStorage.setItem("currentPatientId", id);
      sessionStorage.setItem(
        "currentPatientName",
        `${clickedPatient.first_name} ${clickedPatient.last_name}`
      );
      navigate(`/scribe/${id}`);
    } else {
      console.error("Patient not found");
    }
  };

  const groupedPatients = groupPatientsByInitial(patients);
  const sortedInitials = Object.keys(groupedPatients).sort();

  return (
    <>
      <div className="h-full w-full">
        {hasSelected ? (
          <Outlet />
        ) : (
          <div className="px-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <p className="font-Poppins text-p-lg font-semibold text-f-dark">
                0 <span className="text-f-gray2">Total patient</span>
              </p>
              <div className="mt-8 md:mt-0 flex flex-row">
                <div className="w-full flex flex-row border border-c-gray3 px-4 rounded-md justify-center items-center md:w-80">
                  <IoMdSearch className="h-8 w-8 text-c-secondary" />
                  <input
                    type="text"
                    placeholder="Search patient..."
                    className="w-full text-f-dark font-Poppins focus:outline-none placeholder-f-gray2 bg-bg-mc text-p-rg"
                  />
                </div>
                <div className="ml-2 h-auto flex justify-center items-center rounded-md px-4 py-3 font-Poppins border border-c-gray3 text-f-dark font-medium font-md hover:cursor-pointer">
                  <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
                  <select className="md:block hover:cursor-pointer focus:outline-none bg-bg-mc">
                    <option value="" disabled selected>
                      Filter
                    </option>
                    <option value="filter1">A to Z</option>
                    <option value="filter2">Newest to Oldest</option>
                    <option value="filter3">Highest to Lowest</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="w-auto h-auto mt-8">
              {sortedInitials.length > 0 ? (
                sortedInitials.map((initial) => (
                  <div key={initial} className="mb-8">
                    <h2 className="font-Poppins text-p-lg text-f-gray2 mb-4">
                      {initial}
                    </h2>
                    <div className="grid grid-cols-5 gap-8 px-4">
                      {groupedPatients[initial].map((patient, index) => (
                        <PatientScribeCard
                          key={index}
                          name={`${patient.first_name} ${patient.last_name}`}
                          onClick={() => handleClickPatient(patient.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No patients found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Scribe;
