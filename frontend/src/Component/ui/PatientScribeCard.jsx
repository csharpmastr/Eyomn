import React from "react";

const PatientScribeCard = ({ name, tab, onClick }) => {
  return (
    <div
      className="group z-0 relative w-32 h-24 xl:w-44 xl:h-24 bg-[#FFF8DF] rounded-lg flex justify-center items-center cursor-pointer hover:bg-[#FCEFC0] transition-colors mt-4 shadow-md"
      onClick={onClick}
    >
      <div className="absolute -top-5 left-0 w-28 h-6 bg-[#FFF8DF] rounded-t-lg transition-colors  group-hover:bg-[#FCEFC0]"></div>
      <span className="text-f-dark font-Poppins text-p-rg text-center">
        {name}
      </span>
    </div>
  );
};

export default PatientScribeCard;
