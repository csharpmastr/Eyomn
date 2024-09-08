import React, { useState, useEffect } from "react";
import PatientScribeCard from "../../Component/ui/PatientScribeCard";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

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
  const patients = useSelector((state) => state.reducer.patient.patients);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.resetSelected) {
      setHasSelected(false);
    }
  }, [location.state]);

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
  const sortedInitials = Object.keys(groupedPatients).sort(); // Sort the initials alphabetically

  return (
    <>
      <div className="h-full w-full">
        {hasSelected ? (
          <Outlet />
        ) : (
          <div className="px-8 pt-4">
            <h1 className="font-Poppins text-[24px]">Scribe History</h1>
            <div className="w-auto h-auto mt-10">
              {sortedInitials.length > 0 ? (
                sortedInitials.map((initial) => (
                  <div key={initial} className="mb-8">
                    <h2 className="font-Poppins text-[20px] mb-4">{initial}</h2>
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
