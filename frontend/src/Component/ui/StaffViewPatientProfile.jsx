import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import ReasonVisitCard from "./ReasonVisitCard";

const StaffViewPatientProfile = ({
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
      <div className="w-full flex flex-col gap-8 flex-1 md:flex-row">
        <div className="w-full">
          <header className="w-full h-fit flex justify-between items-center p-5 rounded-lg bg-bg-sb border border-c-primary mb-8 md:flex-row md:gap-0">
            <section>
              <p className="text-f-dark font-medium text-p-rg">{name}</p>
              <div className="flex gap-1">
                <p className="text-c-gray3 font-medium text-p-sm">Admitted: </p>
                <p className="text-f-dark font-medium text-p-sm">{admitted}</p>
              </div>
            </section>
            <button className="flex w-1/6 justify-end">
              <IoIosAddCircleOutline className="h-6 w-6 md:mr-2 text-c-secondary" />
              <p className="text-c-secondary font-medium text-p-rg">Edit</p>
            </button>
          </header>
          <div className="w-full flex flex-col gap-8 mb-8">
            <div className="w-full bg-white p-5 rounded-lg border border-f-gray">
              <h1 className="text-p-rg font-medium text-c-primary mb-5">
                | Personal Information
              </h1>
              <div className="flex justify-between">
                <section>
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Birthdate
                  </p>
                  <p className="text-f-dark font-medium text-p-rg">{bday}</p>
                </section>
                <section>
                  <p className="text-c-gray3 font-medium text-p-sm">Age</p>
                  <p className="text-f-dark font-medium text-p-rg">
                    {age} Years Old
                  </p>
                </section>
                <section>
                  <p className="text-c-gray3 font-medium text-p-sm">Sex</p>
                  <p className="text-f-dark font-medium text-p-rg">{sex}</p>
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
                  <p className="text-f-dark font-medium text-p-rg">{status}</p>
                </section>
                <section>
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Occupation
                  </p>
                  <p className="text-f-dark font-medium text-p-rg">
                    {occupation}
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
          </div>
        </div>
        <div className="md:w-[600px] h-auto">
          <ReasonVisitCard />
        </div>
      </div>
    </div>
  );
};

export default StaffViewPatientProfile;
