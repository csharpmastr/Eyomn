import React, { useMemo, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import PatientCard from "./PatientCard";
import { useNavigate } from "react-router-dom";
import AddPatientModal from "./AddPatientModal";
import Loader from "./Loader";
import { useSelector } from "react-redux";

const PatientModal = ({ onClose, tab }) => {
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const patients = useSelector((state) => state.reducer.patient.patients);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickPatient = (id) => {
    const clickedPatient = patients.find((patient) => patient.id === id);

    if (clickedPatient) {
      sessionStorage.setItem("currentPatientId", id);
      sessionStorage.setItem(
        "currentPatientName",
        `${clickedPatient.first_name} ${clickedPatient.last_name}`
      );
      navigate(`/${tab}/${id}`);
      onClose();
    } else {
      console.error("Patient not found");
    }
  };
  const filteredPatients = useMemo(
    () =>
      patients.filter((patient) =>
        `${patient.first_name} ${patient.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [searchTerm, patients]
  );

  const openAddPatientModal = () => setIsAddPatientModalOpen(true);
  const closeAddPatientModal = () => setIsAddPatientModalOpen(false);

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-[85vw] h-[60vh] md:h-[55vh] md:w-[60vw] lg:w-[50vw] lg:h-[50vh] xl:h-[70vh] xl:w-[40vw] p-4 border-2 border-[#C8C8C8] rounded-lg shadow-lg">
        <div className="flex flex-row justify-between mx-auto h-auto">
          <h1 className="flex justify-center items-center font-Poppins text-black pl-2">
            Patient List
          </h1>
          <div
            className="h-12 flex justify-center items-center border-2 border-[#222222] rounded-md py-2 px-2 md:px-4 font-Poppins cursor-pointer"
            onClick={openAddPatientModal}
          >
            <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
            <h1 className="hidden md:block">Add Patient</h1>
          </div>
        </div>
        <div className="w-full flex flex-row mt-2 border-2 border-[#C8C8C8] px-3 py-1 rounded-md">
          <IoMdSearch className="h-10 w-10 text-[#A7A7A7]" />
          <input
            type="text"
            className="w-full text-black px-2 font-Poppins"
            placeholder="Search patient... "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-2 h-[calc(100%_-_110px)] overflow-y-auto">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => (
              <PatientCard
                key={index}
                name={patient.first_name + " " + patient.last_name}
                onClick={() => handleClickPatient(patient.id)}
              />
            ))
          ) : (
            <p>No patients found</p>
          )}
        </div>
      </div>
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={closeAddPatientModal}
      />
    </>
  );
};

export default PatientModal;
