import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FiPhone } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import ReasonVisitCard from "./ReasonVisitCard";
import VisitReasonModal from "./VisitReasonModal";
import { getPatientVisit } from "../../Service/PatientService";
import Cookies from "universal-cookie";

const DocViewPatientProfile = ({ patient, visits }) => {
  const [isVisitOpen, setIsVisitOpen] = useState(false);

  const formattedDate = patient.createdAt
    ? new Date(patient.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const toggleModal = () => setIsVisitOpen(!isVisitOpen);

  return (
    <div className="w-full h-auto font-poppins">
      <header className="flex flex-wrap gap-3 justify-between items-center p-4 rounded-lg bg-bg-sb border border-c-primary mb-3 md:mb-6 md:flex-row md:gap-0">
        <section>
          <p className="text-f-dark font-medium text-p-rg">
            {patient.first_name + " " + patient.last_name}
          </p>
          <div className="flex gap-1">
            <p className="text-f-dark font-medium text-p-rg">
              {patient.age} Yrs Old <span>|</span>
            </p>
            <p className="text-f-dark font-medium text-p-rg">{patient.sex}</p>
          </div>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sm">Birthdate</p>
          <p className="text-f-dark font-medium text-p-rg">
            {patient.birthdate}
          </p>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sm">Civil Status</p>
          <p className="text-f-dark font-medium text-p-rg">
            {patient.civil_status}
          </p>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sm">Occupation</p>
          <p className="text-f-dark font-medium text-p-rg">
            {patient.occupation ? patient.occupation : "None"}
          </p>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sm">Admitted</p>
          <p className="text-f-dark font-medium text-p-rg">{formattedDate}</p>
        </section>
        <button className="flex w-1/6 justify-end">
          <FiEdit className="h-6 w-6 md:mr-2 text-c-secondary" />
          <p className="text-c-secondary font-medium text-p-rg">Edit</p>
        </button>
      </header>
      <div className="flex flex-col gap-3 md:gap-6 justify-between lg:flex-row">
        <div className="w-full h-auto flex flex-col gap-3 md:gap-6">
          <div className="w-full bg-white p-5 rounded-lg border border-f-gray overflow-x-hidden">
            <h1 className="text-p-rg font-medium text-c-secondary mb-5">
              | Contact Information
            </h1>
            <section>
              <div className="flex gap-1 mb-3">
                <MdOutlineEmail className="h-6 w-6 md:mr-2 text-c-gray3" />
                <p className="text-f-dark text-p-rg">{patient.email}</p>
              </div>
              <div className="flex gap-1 mb-3">
                <FiPhone className="h-6 w-6 md:mr-2 text-c-gray3" />
                <p className="text-f-dark text-p-rg">
                  {patient.contact_number}
                </p>
              </div>
              <div className="flex gap-1">
                <FiMapPin className="h-6 w-6 md:mr-2 text-c-gray3" />
                <p className="text-f-dark text-p-rg">
                  {patient.municipality + ", " + patient.province}
                </p>
              </div>
            </section>
          </div>
          <div className="w-full bg-white p-5 rounded-lg border border-f-gray lg:mb-8">
            <section className="mb-8">
              <h1 className="text-p-rg font-medium text-c-secondary mb-5">
                | Initial Observation
              </h1>
              <p className="text-f-dark text-p-rg">
                lorem lorem lorem dasdasd hbashdb
              </p>
            </section>
            <h1 className="text-p-rg font-medium text-c-secondary mb-5">
              | Case History
            </h1>
            <section className="p-3 rounded-lg border border-f-gray mb-5">
              <div className="mb-4">
                <p className="text-c-gray3 font-medium text-p-sm">
                  Reason for visit:
                </p>
                <p className="text-f-dark text-p-rg">
                  lorem lorem lorem dasdasd hbashdb
                </p>
              </div>
              <div>
                <p className="text-c-gray3 font-medium text-p-sm">
                  Chief Complaint:
                </p>
                <p className="text-f-dark text-p-rg">
                  lorem lorem lorem dasdasd hbashdb
                </p>
              </div>
            </section>
            <section className="p-3 rounded-lg border border-f-gray flex justify-between mb-5">
              <div className="mb-4">
                <p className="text-c-gray3 font-medium text-p-sm">
                  Occular History:
                </p>
                <p className="text-f-dark text-p-rg">
                  lorem lorem lorem dasdasd hbashdb
                </p>
              </div>
              <div>
                <p className="text-c-gray3 font-medium text-p-sm">
                  Date of last Eye Exam:
                </p>
                <p className="text-f-dark text-p-rg text-end">June 2024</p>
              </div>
            </section>
            <section className="p-3 rounded-lg border border-f-gray flex justify-between">
              <div className="mb-4">
                <p className="text-c-gray3 font-medium text-p-sm">
                  General Health Hx:
                </p>
                <p className="text-f-dark text-p-rg">
                  lorem lorem lorem dasdasd hbashdb
                </p>
              </div>
              <div>
                <p className="text-c-gray3 font-medium text-p-sm">
                  Date of last Medical Exam:
                </p>
                <p className="text-f-dark text-p-rg text-end">June 2024</p>
              </div>
            </section>
          </div>
        </div>
        <div className="w-full h-auto lg:w-[600px]">
          <div className="w-full h-full bg-white rounded-lg font-poppins p-4">
            <header className="flex w-full h-auto justify-between pt-4 mb-4">
              <h1 className="text-p-rg font-medium text-c-gray3">
                Recent Visit
              </h1>
              <button>
                <IoIosAddCircleOutline
                  className="h-6 w-6 md:mr-2 text-c-gray3]"
                  onClick={toggleModal}
                />
              </button>
            </header>
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
      {isVisitOpen && <VisitReasonModal onClose={toggleModal} />}
    </div>
  );
};
export default DocViewPatientProfile;
