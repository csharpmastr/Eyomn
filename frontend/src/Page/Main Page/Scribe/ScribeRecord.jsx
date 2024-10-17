import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ScribeRecord = () => {
  const { patientId } = useParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const [currentPatient, setCurrentPatient] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const medicalRecords = [
    { id: 1, name: "Medical Scribe Record 1", date: "2024-01-01" },
    { id: 2, name: "Medical Scribe Record 2", date: "2024-01-02" },
  ];

  const rawRecords = [
    { id: 1, name: "Raw Record 1", date: "2024-01-01" },
    { id: 2, name: "Raw Record 2", date: "2024-01-02" },
  ];

  const handleNext = () => {
    if (currentCardIndex < 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleBack = () => {
    navigate("/scribe", { state: { resetSelected: true } });
    sessionStorage.removeItem("currentPath");
    sessionStorage.removeItem("currentPatientId");
  };

  const handleNewRecord = () => {
    navigate(`/scribe/new-record/${patientId}`);
  };

  useEffect(() => {
    sessionStorage.setItem("currentPath", location.pathname);
    if (patients.length > 0) {
      const patient = patients.find((p) => p.patientId === patientId);
      setCurrentPatient(patient);
    }
  }, [patients, patientId]);

  return (
    <>
      <div className="p-8 h-full font-Poppins">
        <div className="flex justify-between mb-8">
          <h1 className="text-p-lg font-semibold flex justify-center items-center">
            {currentPatient
              ? `${currentPatient.first_name} ${currentPatient.last_name}`
              : "Loading..."}
          </h1>
          <div
            className="ml-2 h-auto flex justify-center items-center rounded-md px-4 py-3 bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
            onClick={handleNewRecord}
          >
            <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
            <h1 className="hidden md:block">Create New Note</h1>
          </div>
        </div>

        <div className="w-full text-f-dark">
          <nav className="flex items-end h-14">
            <button
              className={`w-44 flex items-center justify-center rounded-t-lg transition-all duration-300 ease-in-out font-medium ${
                currentCardIndex === 0
                  ? `h-12 bg-[#FFF8DF] text-p-rg`
                  : `h-8 bg-[#D2D2D2] text-p-sm`
              }`}
              onClick={handleBack}
              disabled={currentCardIndex === 0}
            >
              Medical Scribe
            </button>
            <button
              className={`w-44 flex items-center justify-center rounded-t-lg transition-all duration-300 ease-in-out font-medium ${
                currentCardIndex === 0
                  ? `h-8 bg-[#D2D2D2] text-p-sm`
                  : `h-12 bg-[#FFF8DF] text-p-rg`
              }`}
              onClick={handleNext}
              disabled={currentCardIndex === 1}
            >
              Raw Form
            </button>
          </nav>

          {currentCardIndex === 0 ? (
            <div className="w-full rounded-b-lg shadow-xl">
              {medicalRecords.map((record, index) => (
                <div
                  key={record.id}
                  className={`px-8 flex h-20 border-b-[1px] items-center justify-between font-medium ${
                    index % 2 === 0 ? "bg-bg-mc" : `bg-white`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-6 h-6" />
                    <p>{record.name}</p>
                  </div>
                  <p>{record.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full rounded-lg shadow-xl">
              {rawRecords.map((record, index) => (
                <div
                  key={record.id}
                  className={`px-8 flex h-20 border-b-[1px] items-center justify-between font-medium ${
                    index % 2 === 0 ? "bg-bg-mc" : `bg-white`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-6 h-6" />
                    <p>{record.name}</p>
                  </div>
                  <p>{record.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={handleBack}>Back</button>
      </div>
    </>
  );
};

export default ScribeRecord;
