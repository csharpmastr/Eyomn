import React from "react";
import { FiUser } from "react-icons/fi";

const DbCard = ({ title, value, percentageChange, color }) => {
  return (
    <>
      <div
        className="py-4 px-6 w-full rounded-xl text-f-dark font-Poppins border border-white text-p-sm md:text-p-rg shadow-sm"
        style={{
          background: `linear-gradient(to top, ${color})`,
        }}
      >
        <div className="flex items-center w-full justify-between">
          <section>
            <p className="text-p-sc md:text-p-sm font-medium mb-2">{title}</p>
            <p className="font-semibold text-h-h6">{value}</p>
          </section>
          <div className="p-8 rounded-xl bg-f-light shadow-md"></div>
        </div>
        <p className="text-p-sc md:text-p-sm mt-2">
          <span className="text-[#3FB59D]">{percentageChange}</span> vs last
          month
        </p>
      </div>
    </>
  );
};

export default DbCard;
