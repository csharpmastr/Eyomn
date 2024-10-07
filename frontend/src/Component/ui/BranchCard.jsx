import React from "react";

const BranchCard = ({ name }) => {
  return (
    <div className="min-w-[350px] rounded-lg overflow-hidden shadow-lg hover:cursor-pointer font-Poppins">
      <div className="bg-[#4FC8CF] h-12 font-bold"></div>
      <div className="text-center py-10 bg-white">
        <h3 className="text-p-lg font-semibold text-f-dark">{name}</h3>
        <p className="text-p-rg text-f-dark mt-2">Branch Location</p>
      </div>
    </div>
  );
};

export default BranchCard;
