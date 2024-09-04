import React, { useContext, useState } from "react";
import { FiUser } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import Form from "../../Component/ui/Form";
import Cookies from "universal-cookie";
import Loader from "../../Component/ui/Loader";
import AddPatientModal from "../../Component/ui/AddPatientModal";
import { useSelector } from "react-redux";
import Table from "../../Component/ui/Table";
const Patient = () => {
  const [isAddPatientModalOpen, setisAddPatientModalOpen] = useState(false);
  const cookies = new Cookies();
  const role = cookies.get("role");
  const [isLoading, setIsLoading] = useState(false);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const totalPatient = patients.length;
  console.log(patients);

  const openAddPatient = () => setisAddPatientModalOpen(true);
  const closeAddPatient = () => setisAddPatientModalOpen(false);

  return (
    <div className="h-full w-full">
      {isLoading && <Loader />}
      <div>
        <div className="w-full flex justify-between mx-auto items-center px-8 pt-4">
          <div className="flex gap-2">
            <div className="bg-[#CFCFCF] w-14 h-auto flex items-center justify-center p-2 rounded-md">
              <FiUser className="h-8 w-8" />
            </div>
            <div className="flex gap-1">
              <p className="text-center flex justify-center items-center font-Poppins font-semibold text-[20px]">
                {totalPatient}
              </p>
              <p className="text-center flex justify-center items-center font-Poppins text-[#A7A7A7]">
                total patient
              </p>
            </div>
          </div>
          <div className="flex h-auto w-auto gap-2 justify-end">
            <div
              className={` flex flex-row border-2 border-[#C8C8C8] p-1  rounded-xl bg-[#A7A7A7 ${
                role === 0 ? `` : `w-1/2`
              }`}
            >
              <IoMdSearch className="h-10 w-10 text-[#A7A7A7]" />
              <input
                type="text"
                className="w-full text-black px-2 font-Poppins focus:outline-none placeholder-[#A7A7A7] placeholder:font-bold"
                placeholder="Search patient... "
              />
            </div>
            {role === 0 ? (
              ""
            ) : (
              <>
                <span className="h-[55px] w-[2px] bg-[#C8C8C8]"></span>
                <div
                  className="h-auto flex justify-center items-center rounded-md py-2 px-3 font-Poppins bg-[#1ABC9C] text-white font-semibold hover:cursor-pointer hover:bg-[#16A085]
                        "
                  onClick={openAddPatient}
                >
                  <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
                  <h1 className="hidden md:block">Add Patient</h1>
                </div>
              </>
            )}
          </div>
        </div>
        <Table data={patients} />
      </div>
      {/* OVERLAYS */}
      <div>
        <AddPatientModal
          isOpen={isAddPatientModalOpen}
          onClose={closeAddPatient}
        >
          <Form />
        </AddPatientModal>
      </div>
    </div>
  );
};

export default Patient;
