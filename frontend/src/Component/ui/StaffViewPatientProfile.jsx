import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import ReasonVisitCard from "./ReasonVisitCard";
import { useDispatch } from "react-redux";
import VisitReasonModal from "./VisitReasonModal";
import { useSelector } from "react-redux";
import AddEditPatient from "./AddEditPatient";

const StaffViewPatientProfile = ({ patient, visits }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const toggleModal = () => setIsVisitOpen(!isVisitOpen);
  const handleOpenModal = () => setIsModalOpen(!isModalOpen);

  const reduxDispatch = useDispatch();
  const formattedDate = patient.createdAt
    ? new Date(patient.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  const role = useSelector((state) => state.reducer.user.user.role);

  return (
    <div className="w-full h-full flex flex-col gap-4 md:gap-8 md:flex-row font-poppins">
      <div className="w-full h-full">
        <header className="w-full h-fit flex justify-between items-center bg-bg-sb border border-c-primary rounded-md px-4 py-6 mb-6">
          <div className="text-f-dark font-medium text-p-sm md:text-p-rg">
            <p className="text-c-gray3 text-p-sc md:text-p-sm font-normal">
              Patient Name
            </p>
            <p>{patient.first_name + " " + patient.last_name}</p>
          </div>
          <div className="text-f-dark font-medium text-p-sm md:text-p-rg">
            <p className="text-c-gray3 text-p-sc md:text-p-sm font-normal">
              Admitted:
            </p>
            <p>{formattedDate}</p>
          </div>
          <div>
            {role === "3" && (
              <button
                className="flex w-fit justify-end"
                onClick={handleOpenModal}
              >
                <FiEdit className="h-6 w-6 md:mr-2 text-c-secondary" />
                <p className="text-c-secondary font-regular text-p-sm md:text-p-rg">
                  Edit
                </p>
              </button>
            )}
          </div>
        </header>
        <div className="w-full h-fit flex flex-col justify-between gap-6">
          <div className="w-full flex-1 text-f-dark rounded-md border shadow-sm bg-white">
            <header>
              <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary mt-4 ml-4">
                | Personal Information
              </h1>
            </header>
            <div className="w-full flex flex-wrap p-8 gap-8 md:gap-0 md:flex-none">
              <section className="flex-1 text-p-sm md:text-p-rg font-medium">
                <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                  Birthdate
                </p>
                <p>{patient.birthdate}</p>
              </section>
              <section className="flex-1 text-p-sm md:text-p-rg font-medium">
                <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                  Age
                </p>
                <p>{patient.age} Years Old</p>
              </section>
              <section className="flex-1 text-p-sm md:text-p-rg font-medium">
                <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                  Sex
                </p>
                <p>{patient.sex || "Not Indicated"}</p>
              </section>
            </div>
          </div>
          <div className="w-full flex-1 text-f-dark rounded-md border shadow-sm bg-white">
            <header>
              <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary mt-4 ml-4">
                | Status Information
              </h1>
            </header>
            <div className="w-full flex flex-wrap p-8 gap-8 md:gap-0 md:flex-none">
              <section className="flex-1 text-p-sm md:text-p-rg font-medium">
                <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                  Civil Status
                </p>
                <p>{patient.civil_status}</p>
              </section>
              <section className="flex-1 text-p-sm md:text-p-rg font-medium">
                <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                  Occupation
                </p>
                <p>{patient.occupation ? patient.occupation : "None"}</p>
              </section>
              <section className="flex-1 text-p-sm md:text-p-rg font-medium"></section>
            </div>
          </div>
          <div className="w-full flex-1 text-f-dark rounded-md border shadow-sm bg-white">
            <header>
              <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary mt-4 ml-4">
                | Contact Information
              </h1>
            </header>
            <div className="w-full flex flex-wrap p-8 gap-8 md:gap-4 md:flex-none">
              <section className="flex-1 text-p-sm md:text-p-rg font-medium">
                <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                  Email Address
                </p>
                <p>{patient.email}</p>
              </section>
              <section className="flex-1 text-p-sm md:text-p-rg font-medium">
                <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                  Contact Number
                </p>
                <p>{patient.contact_number || patient.contact}</p>
              </section>
              <section className="flex-1 text-p-sm md:text-p-rg font-medium">
                <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                  Address
                </p>
                <p>{patient.municipality + ", " + patient.province}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-3/5 h-full shadow-sm border bg-white p-6 rounded-lg">
        <header className="flex w-full h-fit justify-between mb-4">
          <h1 className="text-p-sm md:text-p-rg font-medium text-c-gray3">
            | Recent Visit
          </h1>
          {role === "3" ? (
            <button>
              <IoIosAddCircleOutline
                className="h-6 w-6 md:mr-2 text-c-gray3"
                onClick={toggleModal}
              />
            </button>
          ) : (
            ""
          )}
        </header>
        <div className="flex flex-col gap-6 w-full h-full">
          {visits.length > 0 ? (
            visits.map((visit, index) => (
              <ReasonVisitCard key={index} reasonData={visit} />
            ))
          ) : (
            <p>No visit records found.</p>
          )}
        </div>
      </div>
      {isVisitOpen && <VisitReasonModal onClose={toggleModal} />}
      {isModalOpen && (
        <AddEditPatient
          onClose={handleOpenModal}
          title={"Edit Patient Information"}
        />
      )}
    </div>
  );
};

export default StaffViewPatientProfile;
