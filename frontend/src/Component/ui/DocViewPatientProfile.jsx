import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import ReasonVisitCard from "./ReasonVisitCard";

const DocViewPatientProfile = ({
  name,
  age,
  sex,
  bday,
  status,
  occupation,
  admitted,
  gmail,
  contact,
  address,
}) => {
  return (
    <div className="w-full font-poppins">
      <header className="flex flex-wrap gap-3 justify-between items-center p-5 rounded-lg bg-bg-sb border border-c-primary mb-8 md:flex-row md:gap-0">
        <section>
          <p className="text-f-dark font-medium text-p-rg">{name}</p>
          <div className="flex gap-1">
            <p className="text-f-dark font-medium text-p-rg">
              {age} Yrs Old <span>|</span>
            </p>
            <p className="text-f-dark font-medium text-p-rg">{sex}</p>
          </div>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sm">Birthdate</p>
          <p className="text-f-dark font-medium text-p-rg">{bday}</p>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sm">Civil Status</p>
          <p className="text-f-dark font-medium text-p-rg">{status}</p>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sm">Occupation</p>
          <p className="text-f-dark font-medium text-p-rg">{occupation}</p>
        </section>
        <section>
          <p className="text-c-gray3 font-medium text-p-sm">Admitted</p>
          <p className="text-f-dark font-medium text-p-rg">{admitted}</p>
        </section>
        <button className="flex w-1/6 justify-end">
          <IoIosAddCircleOutline className="h-6 w-6 md:mr-2 text-c-secondary" />
          <p className="text-c-secondary font-medium text-p-rg">Edit</p>
        </button>
      </header>
      <div className="flex flex-col gap-8 justify-between lg:flex-row">
        <div className="w-full flex flex-col gap-8">
          <div className="w-full bg-white p-5 rounded-lg border border-f-gray">
            <h1 className="text-p-rg font-medium text-c-secondary mb-5">
              | Contact Information
            </h1>
            <section>
              <div className="flex gap-1 mb-2">
                <IoIosAddCircleOutline className="h-6 w-6 md:mr-2 text-[#696969]" />
                <p className="text-f-dark text-p-rg">{gmail}</p>
              </div>
              <div className="flex gap-1 mb-2">
                <IoIosAddCircleOutline className="h-6 w-6 md:mr-2 text-[#696969]" />
                <p className="text-f-dark text-p-rg">{contact}</p>
              </div>
              <div className="flex gap-1 mb-2">
                <IoIosAddCircleOutline className="h-6 w-6 md:mr-2 text-[#696969]" />
                <p className="text-f-dark text-p-rg">{address}</p>
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
        <div className="w-full h-full mb-8 lg:w-[800px]">
          <ReasonVisitCard />
        </div>
      </div>
    </div>
  );
};
export default DocViewPatientProfile;
