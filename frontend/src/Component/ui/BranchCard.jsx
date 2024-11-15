import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";

const BranchCard = ({ name, municipality, onClick, clickEdit }) => {
  return (
    <div
      className="min-w-[350px] rounded-lg overflow-hidden shadow-sm hover:cursor-pointer font-Poppins border group"
      onClick={onClick}
    >
      <div className="p-3 bg-c-branch rounded-t-lg flex justify-between">
        <p className="text-p-sc md:text-p-sm text-f-light font-medium">
          {municipality}
        </p>
        <div className="flex justify-between opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              clickEdit();
            }}
          >
            <FiEdit className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      <div className="text-center py-10 bg-white">
        <h3 className="text-p-rg md:text-p-lg font-medium text-f-dark">
          {name}
        </h3>
      </div>
    </div>
  );
};

export default BranchCard;
