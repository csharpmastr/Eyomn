import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import SoapCard from "../../Component/ui/SoapCard";

const Soap = () => {
  return (
    <div className="flex p-6 gap-8 font-Poppins bg-bg-mc">
      <div className="w-3/4 gap-8 flex flex-col">
        <div className="flex px-5 py-6 rounded-lg bg-white border border-f-gray justify-between">
          <div className="ml-2 h-auto flex justify-center items-center rounded-md text-c-secondary font-md">
            <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
            <h1 className="hidden md:block">Go Back</h1>
          </div>
          <h1 className="text-p-lg font-semibold text-c-secondary mx-auto">
            S.O.A.P Method
          </h1>
        </div>
        <SoapCard />
      </div>
      <div className="w-1/4 p-5 rounded-lg bg-white border border-f-gray">
        <h1>Info kung ano ano ex. Name etc</h1>
      </div>
    </div>
  );
};

export default Soap;
