import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FiPhone } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import ReasonVisitCard from "./ReasonVisitCard";
import VisitReasonModal from "./VisitReasonModal";
import AddEditPatient from "./AddEditPatient";
import { getPatientVisit } from "../../Service/PatientService";
import Cookies from "universal-cookie";

const DocViewPatientProfile = ({ patient, visits }) => {
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedDate = patient.createdAt
    ? new Date(patient.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const toggleModal = () => setIsVisitOpen(!isVisitOpen);
  const handleOpenModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="w-full h-auto font-poppins">
      <header className="flex flex-wrap gap-3 justify-between items-center p-4 rounded-lg bg-bg-sb border border-c-primary mb-3 md:mb-6 md:flex-row md:gap-0">
        <section>
          <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
            {patient.first_name + " " + patient.last_name}
          </p>
          <div className="flex gap-1">
            <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
              {patient.age} Yrs Old <span>|</span>
            </p>
            <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
              {patient.sex}
            </p>
          </div>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
            Birthdate
          </p>
          <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
            {patient.birthdate}
          </p>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
            Civil Status
          </p>
          <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
            {patient.civil_status}
          </p>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
            Occupation
          </p>
          <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
            {patient.occupation ? patient.occupation : "None"}
          </p>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
            Admitted
          </p>
          <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
            {formattedDate}
          </p>
        </section>
        <button className="flex w-1/6 justify-end" onClick={handleOpenModal}>
          <FiEdit className="h-6 w-6 md:mr-2 text-c-secondary" />
          <p className="text-c-secondary font-medium text-p-sm md:text-p-rg">
            Edit
          </p>
        </button>
      </header>
      <div className="flex flex-col gap-3 md:gap-6 justify-between lg:flex-row">
        <div className="w-full h-full flex flex-col gap-3 md:gap-6">
          <div className="w-full bg-white p-5 rounded-lg shadow-sm border overflow-x-hidden">
            <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary mb-5">
              | Contact Information
            </h1>
            <section>
              <div className="flex gap-1 mb-3">
                <MdOutlineEmail className="h-6 w-6 md:mr-2 text-c-gray3" />
                <p className="text-f-dark text-p-sm md:text-p-rg">
                  {patient.email}
                </p>
              </div>
              <div className="flex gap-1 mb-3">
                <FiPhone className="h-6 w-6 md:mr-2 text-c-gray3" />
                <p className="text-f-dark text-p-sm md:text-p-rg">
                  {patient.contact_number}
                </p>
              </div>
              <div className="flex gap-1">
                <FiMapPin className="h-6 w-6 md:mr-2 text-c-gray3" />
                <p className="text-f-dark text-p-sm md:text-p-rg">
                  {patient.municipality + ", " + patient.province}
                </p>
              </div>
            </section>
          </div>
          <div className="w-full bg-white p-5 rounded-lg shadow-sm border h-fit overflow-y-scroll">
            <section className="mb-8 flex justify-center">
              <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary mb-5">
                Patient Medical Records
              </h1>
            </section>
            <section className="bg-white border rounded-md">
              <div className="p-3 rounded-t-md bg-bg-sub border-b">
                <h1 className="w-full text-center">Subjective</h1>
              </div>
              <div className="p-5 gap-3 flex flex-col">
                <div className="flex gap-3">
                  <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                    <h6 className="font-medium mb-3">| Initial Obeservation</h6>
                    <article>
                      <p>Content</p>
                    </article>
                  </div>
                  <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                    <h6 className="font-medium mb-3">| General Health Hx</h6>
                    <article>
                      <p>Content</p>
                    </article>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                    <h6 className="font-medium mb-3">
                      | Occular Condition/History
                    </h6>
                    <article>
                      <p>Content</p>
                    </article>
                  </div>
                  <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                    <h6 className="font-medium mb-3">
                      | Family Occular Conditon
                    </h6>
                    <article>
                      <p>Content</p>
                    </article>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                    <h6 className="font-medium mb-3">| Current Medication</h6>
                    <article>
                      <p>Content</p>
                    </article>
                  </div>
                  <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                    <h6 className="font-medium mb-3">| Lifestyle</h6>
                    <article>
                      <p>Content</p>
                    </article>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="w-full h-auto lg:w-[600px]">
          <div className="w-full h-full shadow-sm border bg-white rounded-lg font-poppins p-4">
            <header className="flex w-full h-auto justify-between pt-4 mb-4">
              <h1 className="text-p-sm md:text-p-rg font-medium text-c-gray3">
                Recent Visit
              </h1>
              <button>
                <IoIosAddCircleOutline
                  className="h-6 w-6 md:mr-2 text-c-gray3]"
                  onClick={toggleModal}
                />
              </button>
            </header>
            <div className="flex flex-col gap-4">
              {visits.length > 0 ? (
                visits.map((visit, index) => (
                  <ReasonVisitCard key={index} reasonData={visit} />
                ))
              ) : (
                <p>No visit records found.</p>
              )}
            </div>
          </div>
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
export default DocViewPatientProfile;
