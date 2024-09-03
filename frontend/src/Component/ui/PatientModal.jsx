import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import PatientCard from "./PatientCard";
import { useNavigate } from "react-router-dom";
import AddPatientModal from "./AddPatientModal";
import Cookies from "universal-cookie";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { addPatient } from "../../Service/PatientService";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";
import Modal from "./Modal";

const PatientModal = ({ onClose, tab }) => {
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const patientData = [
    { id: "1", name: "Sarah D. Uterte" },
    { id: "2", name: "John Doe" },
    { id: "3", name: "Jane Smith" },
    { id: "4", name: "Alice Johnson" },
    { id: "5", name: "Bob Brown" },
    { id: "6", name: "Carol Davis" },
    { id: "7", name: "Daniel Evans" },
    { id: "8", name: "Emily Foster" },
    { id: "9", name: "Frank Green" },
  ];

  const navigate = useNavigate();

  const handleClickPatient = (id) => {
    navigate(`/${tab}/${id}`);
    onClose();
  };

  const openAddPatientModal = () => setIsAddPatientModalOpen(true);
  const closeAddPatientModal = () => setIsAddPatientModalOpen(false);

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-[85vw] h-[60vh] md:h-[55vh] md:w-[60vw] lg:w-[50vw] lg:h-[50vh] xl:h-[70vh] xl:w-[40vw] p-4 border-2 border-[#C8C8C8] rounded-lg">
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
          />
        </div>
        <div className="mt-2 h-[calc(100%_-_110px)] overflow-y-auto">
          {patientData.map((patient) => (
            <PatientCard
              key={patient.id}
              name={patient.name}
              onClick={() => handleClickPatient(patient.id)}
            />
          ))}
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
