import React from "react";
import { FiUser } from "react-icons/fi";

const DbCard = ({ title, value, percentageChange, color }) => {
  return (
    <>
      <div
        className="p-4 w-full rounded-xl text-f-dark font-Poppins border border-white text-p-rg shadow-sm"
        style={{
          background: `linear-gradient(to top, ${color})`,
        }}
      >
        <div className="flex items-center w-full justify-between">
          <section>
            <p className="text-p-sm">{title}</p>
            <p className="font-semibold text-p-lg">{value}</p>
          </section>
          <div className="p-4 bg-bg-sub rounded-full">
            <FiUser />
          </div>
        </div>
        <p className="text-p-sm mt-6">
          <span className="text-[#3FB59D]">{percentageChange}</span> vs last
          month
        </p>
      </div>
    </>
  );
};

export default DbCard;
