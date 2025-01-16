import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import ReasonVisitCard from "./ReasonVisitCard";
import { useDispatch } from "react-redux";
import VisitReasonModal from "./VisitReasonModal";
import { useSelector } from "react-redux";
import PaymentHistory from "./PaymentHistory";
import PaymentBreakdown from "./PaymentBreakdown";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const StaffViewPatientProfile = ({ patient, visits }) => {
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const toggleModal = () => setIsVisitOpen(!isVisitOpen);

  const reduxDispatch = useDispatch();
  const formattedDate = patient.createdAt
    ? new Date(patient.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  const role = useSelector((state) => state.reducer.user.user.role);
  const staffs = useSelector((state) => state.reducer.staff.staffs);
  const doctors = useSelector((state) => state.reducer.doctor.doctor);
  const doctor =
    role === "2"
      ? doctors.find((doc) => doc.staffId === patient.doctorId)
      : staffs.find((staff) => staff.staffId === patient.doctorId);

  return (
    <div className="w-full h-full flex gap-4">
      <div className="w-2/3 h-[800px] flex flex-col gap-5">
        <header className="w-full h-1/6 flex items-center bg-bg-sb border border-c-primary rounded-md px-8 justify-between">
          <div className="text-f-dark font-medium text-p-sm md:text-p-rg">
            <p className="text-c-gray3 text-p-sc md:text-p-sm font-normal">
              Patient Name
            </p>
            <p className="text-p-lg">
              {patient.first_name + " " + patient.last_name}
            </p>
          </div>
          <div className="text-f-dark font-medium text-p-sm md:text-p-rg">
            <p className="text-c-gray3 text-p-sc md:text-p-sm font-normal">
              Admitted:
            </p>
            <p>{formattedDate}</p>
          </div>
          <span> </span>
        </header>
        <div className="w-full h-5/6 bg-white p-8 rounded-lg shadow-sm border flex flex-col justify-between">
          <div>
            <h1 className="text-p-sm md:text-p-rg font-medium text-f-dark mb-4">
              | Personal Information
            </h1>
            <article className="flex w-full">
              <section className="flex-1 text-p-sm md:text-p-rg font-medium">
                <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                  Birthdate
                </p>
                <p>{formatDate(patient.birthdate)}</p>
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
            </article>
          </div>
          <hr />
          <div>
            <h1 className="text-p-sm md:text-p-rg font-medium text-f-dark mb-4">
              | Status Information
            </h1>
            <article className="flex w-full">
              <section className="flex-1">
                <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                  Civil Status
                </p>
                <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
                  {patient.civil_status}
                </p>
              </section>
              <section className="flex-1">
                <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                  Occupation
                </p>
                <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
                  {patient.occupation}
                </p>
              </section>
              <section className="flex-1"> </section>
            </article>
          </div>
          <hr />
          <div>
            <h1 className="text-p-sm md:text-p-rg font-medium text-f-dark mb-4">
              | Contact Information
            </h1>
            <article className="flex w-full">
              <section className="flex-1">
                <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                  Address
                </p>
                <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
                  {patient.municipality + ", " + patient.province}
                </p>
              </section>
              <section className="flex-1">
                <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                  Contact Number
                </p>
                <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
                  {patient.contact_number}
                </p>
              </section>
              <section className="flex-1">
                <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                  Email Address
                </p>
                <p className="text-f-dark font-medium text-p-sm md:text-p-rg truncate">
                  {patient.email}
                </p>
              </section>
            </article>
          </div>
          <hr />
          <div>
            <h1 className="text-p-sm md:text-p-rg font-medium text-f-dark mb-4">
              | Attending Doctor
            </h1>
            <article className="flex w-full">
              <section className="flex-1">
                <p className="text-c-gray3 font-medium text-p-sc md:text-h-h6 mb-2">
                  {`${doctor.first_name} ${doctor.last_name}`}
                </p>
              </section>
            </article>
          </div>
        </div>
      </div>
      <div className="w-1/3 h-[800px] flex flex-col gap-4">
        <div className="w-full h-1/2 shadow-sm border bg-white rounded-md font-poppins p-4 overflow-hidden pb-14">
          <header className="flex w-full h-fit justify-between items-center mb-4">
            <h1 className="text-p-sm md:text-p-rg font-medium text-f-dark">
              Recent Visit
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
          <div className="w-full h-full overflow-y-scroll flex flex-col gap-4">
            {visits.length > 0 ? (
              visits.map((visit, index) => (
                <ReasonVisitCard key={index} reasonData={visit} />
              ))
            ) : (
              <p>No visit records found.</p>
            )}
          </div>
        </div>
        {role !== "0" && (
          <div className="w-full h-1/2 shadow-sm border bg-white rounded-lg font-poppins p-4 overflow-auto">
            <PaymentHistory />
          </div>
        )}
      </div>
      {isVisitOpen && <VisitReasonModal onClose={toggleModal} />}
    </div>
  );
};

export default StaffViewPatientProfile;
