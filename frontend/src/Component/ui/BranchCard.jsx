import React from "react";

const BranchCard = ({ name, municipality }) => {
  return (
    <div className="min-w-[350px] rounded-lg overflow-hidden shadow-sm hover:cursor-pointer font-Poppins">
      <div className="p-3 bg-[#BBD8C5] rounded-t-lg">
        <p className="text-p-sm text-f-dark font-medium">{municipality}</p>
      </div>
      <div className="text-center py-10 bg-white">
        <h3 className="text-p-lg font-medium text-f-dark">{name}</h3>
      </div>
    </div>
  );
};

export default BranchCard;
