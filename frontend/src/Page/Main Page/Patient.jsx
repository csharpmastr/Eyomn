import React, { useContext, useState } from "react";
import { FiUser } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import Modal from "../../Component/ui/Modal";
import Form from "../../Component/ui/Form";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { addPatient } from "../../Service/PatientService";
import Cookies from "universal-cookie";
const Patient = () => {
  const { user } = useAuthContext();
  const cookies = new Cookies();
  const clinicId = user.id;
  const accessToken = cookies.get("accessToken", { path: "/" });
  const refreshToken = cookies.get("accessToken", { path: "/" });
  const [patientsCount, setPatientsCount] = useState(82);
  const [isAddPatientModalOpen, setisAddPatientModalOpen] = useState(false);

  const openAddPatient = () => setisAddPatientModalOpen(true);
  const closeAddPatient = () => setisAddPatientModalOpen(false);

  const formFields = [
    {
      name: "first_name",
      type: "text",
      placeholder: "Patient first name",
      pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    },
    {
      name: "last_name",
      type: "text",
      placeholder: "Patient last name",
      pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    },
    {
      name: "address",
      type: "text",
      placeholder: "Patient address",
      pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    },
  ];

  const handlePatientSubmit = (formData) => {
    const patientData = { ...formData, clinicId: clinicId };
    console.log(patientData);
  };
  return (
    <div className="h-full w-full">
      <div>
        <div className="w-full flex justify-between mx-auto items-center px-8 pt-4">
          <div className="flex gap-2">
            <div className="bg-[#CFCFCF] w-14 h-auto flex items-center justify-center p-2 rounded-md">
              <FiUser className="h-8 w-8" />
            </div>
            <div className="flex gap-1">
              <p className="text-center flex justify-center items-center font-Poppins font-semibold text-[20px]">
                {patientsCount}
              </p>
              <p className="text-center flex justify-center items-center font-Poppins text-[#A7A7A7]">
                total patient
              </p>
            </div>
          </div>
          <div className="flex h-auto w-auto gap-2 justify-end">
            <div className="w-1/2 flex flex-row border-2 border-[#C8C8C8] p-1  rounded-xl bg-[#A7A7A7">
              <IoMdSearch className="h-10 w-10 text-[#A7A7A7]" />
              <input
                type="text"
                className="w-full text-black px-2 font-Poppins focus:outline-none placeholder-[#A7A7A7] placeholder:font-bold"
                placeholder="Search patient... "
              />
            </div>
            <span className="h-[55px] w-[2px] bg-[#C8C8C8]"></span>
            <div
              className="h-auto flex justify-center items-center rounded-md py-2 px-3 font-Poppins bg-[#1ABC9C] text-white font-semibold hover:cursor-pointer hover:bg-[#16A085]
            "
              onClick={openAddPatient}
            >
              <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
              <h1 className="hidden md:block">Add Patient</h1>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isAddPatientModalOpen}
        onClose={closeAddPatient}
        title="Add Patient"
        className="w-[600px] h-auto p-4"
        overlayDescriptionClassName={
          "text-center font-Poppins pt-5 text-black text-[18px]"
        }
      >
        <Form formFields={formFields} handleSubmit={handlePatientSubmit} />
      </Modal>
    </div>
  );
};

export default Patient;
