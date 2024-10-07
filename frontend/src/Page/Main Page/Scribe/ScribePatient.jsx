import React, { useState, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ScribePatient = () => {
  const { patientId } = useParams();
  const [isSelected, setIsSelected] = useState("Medical Scribe");

  const patients = useSelector((state) => state.reducer.patient.patients);
  const [currentPatient, setCurrentPatient] = useState(null);

  useEffect(() => {
    if (patients.length > 0) {
      const patient = patients.find((p) => p.patientId === patientId);
      setCurrentPatient(patient);
    }
  }, [patients, patientId]);

  const handleSelection = (scribeType) => {
    setIsSelected(scribeType);
  };

  return (
    <div className="h-full w-full flex flex-col px-4 md:p-8 pb-4 font-Poppins">
      <div className="flex justify-between font-Poppins py-3 px-3 mt-4 lg:mt-0 rounded-md">
        <h1 className="flex justify-center items-center font-semibold text-[24px]">
          {currentPatient
            ? `${currentPatient.first_name} ${currentPatient.last_name}`
            : "Loading..."}
        </h1>
        <div className="flex ">
          <IoIosAddCircleOutline className="h-8 w-8 md:mr-2" />
          <h1 className="justify-center items-center font-semibold hidden lg:flex">
            New raw record
          </h1>
        </div>
      </div>

      <div className="mt-2">
        <div className="hidden md:flex h-14 md:items-end">
          <div
            className={`flex items-end cursor-pointer transition-all duration-300 ease-in-out rounded-t-md ${
              isSelected === "Medical Scribe"
                ? "bg-[#FFF8DF] h-12 px-5"
                : "bg-[#D2D2D2] h-8 px-3"
            }`}
            onClick={() => handleSelection("Medical Scribe")}
          >
            Medical Scribe
          </div>
          <div
            className={`flex items-end cursor-pointer transition-all duration-300 ease-in-out rounded-t-md ${
              isSelected === "Raw Scribe"
                ? "bg-[#FFF8DF] h-12 px-5"
                : "bg-[#D2D2D2] h-8 px-3"
            }`}
            onClick={() => handleSelection("Raw Scribe")}
          >
            Raw Scribe
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center bg-white rounded-b-lg shadow-md h-full ">
        <h1>
          {isSelected === "Medical Scribe"
            ? currentPatient
              ? "No Medical Scribe Record"
              : "Loading..."
            : currentPatient
            ? "No Raw Scribe Record"
            : "Loading..."}
        </h1>
      </div>
    </div>
  );
};

export default ScribePatient;
