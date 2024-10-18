import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FiPhone } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import ReasonVisitCard from "./ReasonVisitCard";
import { getPatientVisit } from "../../Service/PatientService";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { addVisit } from "../../Slice/VisitSlice";
const StaffViewPatientProfile = ({ patient, visits }) => {
  const reduxDispatch = useDispatch();
  const formattedDate = patient.createdAt
    ? new Date(patient.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="w-full flex flex-col gap-8 flex-1 md:flex-row font-poppins">
      <div className="w-full h-auto">
        <header className="w-full h-fit flex justify-between items-center p-5 rounded-lg bg-bg-sb border border-c-primary mb-8 md:flex-row md:gap-0">
          <section>
            <p className="text-f-dark font-medium text-p-lg">
              {patient.first_name + " " + patient.last_name}
            </p>
            <div className="flex gap-1">
              <p className="text-c-gray3 font-medium text-p-sm">Admitted: </p>
              <p className="text-f-dark font-medium text-p-sm">
                {formattedDate}
              </p>
            </div>
          </section>
          <button className="flex w-1/6 justify-end">
            <FiEdit className="h-6 w-6 md:mr-2 text-c-secondary" />
            <p className="text-c-secondary font-regular text-p-rg">Edit</p>
          </button>
        </header>
        <div className="w-full flex flex-col gap-8 mb-8">
          <div className="w-full bg-white p-5 rounded-lg border border-f-gray">
            <h1 className="text-p-rg font-medium text-c-primary mb-5">
              | Personal Information
            </h1>
            <div className="flex justify-between pr-10">
              <section>
                <p className="text-c-gray3 font-medium text-p-sm">Birthdate</p>
                <p className="text-f-dark font-medium text-p-rg">
                  {patient.birthdate}
                </p>
              </section>
              <section>
                <p className="text-c-gray3 font-medium text-p-sm">Age</p>
                <p className="text-f-dark font-medium text-p-rg">
                  {patient.age} Years Old
                </p>
              </section>
              <section>
                <p className="text-c-gray3 font-medium text-p-sm">Sex</p>
                <p className="text-f-dark font-medium text-p-rg">
                  {patient.sex}
                </p>
              </section>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-8 mb-8">
          <div className="w-full bg-white p-5 rounded-lg border border-f-gray">
            <h1 className="text-p-rg font-medium text-c-primary mb-5">
              | Status Information
            </h1>
            <div className="flex justify-between">
              <section>
                <p className="text-c-gray3 font-medium text-p-sm">
                  Civil Status
                </p>
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
              <section></section>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-8">
          <div className="w-full bg-white p-5 rounded-lg border border-f-gray">
            <h1 className="text-p-rg font-medium text-c-primary mb-5">
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
                  {patient.contact_number || patient.contact}
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
        </div>
      </div>
      <div className="md:w-[600px] h-auto">
        <div className="w-full h-full bg-white rounded-lg font-poppins p-4">
          <header className="flex w-full h-auto justify-between pt-4 mb-5">
            <h1 className="text-p-rg font-medium text-c-gray3">
              | Recent Visit
            </h1>
            <button>
              <IoIosAddCircleOutline className="h-6 w-6 md:mr-2 text-c-gray3]" />
            </button>
          </header>
          {visits.length > 0 ? (
            visits.map((visit, index) => (
              <ReasonVisitCard key={index} reasonData={visit} />
            ))
          ) : (
            <p>No visit records found.</p>
          )}{" "}
        </div>
      </div>
    </div>
  );
};

export default StaffViewPatientProfile;
