import React from "react";

const PatientScribeCard = ({ name, tab, onClick }) => {
  return (
    <div
      className="group z-0 relative w-32 h-24 xl:w-44 xl:h-24 bg-[#FFE9B2] rounded-lg flex justify-center items-center cursor-pointer hover:bg-[#ffe299] transition-colors mt-4 shadow-md"
      onClick={onClick}
    >
      <div className="absolute -top-5 left-0 w-28 h-6 bg-[#FFE9B2] rounded-t-lg transition-colors  group-hover:bg-[#ffe299]"></div>
      <span className="text-f-dark font-Poppins text-p-sm md:text-p-rg text-center font-medium px-4">
        {name}
      </span>
    </div>
  );
};

export default PatientScribeCard;
