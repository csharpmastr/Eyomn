import React from "react";

const PatientScribeCard = ({ name, tab, onClick }) => {
  return (
    <div
      className="group z-0 relative w-32 h-24 xl:w-44 xl:h-24 bg-gray-300 rounded-b-lg flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-colors mt-4"
      onClick={onClick}
    >
      <div className="absolute -top-5 left-0 w-16 h-6 bg-gray-300 rounded-tl-lg transition-colors  group-hover:bg-gray-400"></div>
      <span className="text-black font-Poppins text-[14px] text-center">
        {name}
      </span>
    </div>
  );
};

export default PatientScribeCard;
