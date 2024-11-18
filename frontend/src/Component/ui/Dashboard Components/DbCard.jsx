import React from "react";

const DbCard = ({ title, value, percentageChange, color, bg }) => {
  return (
    <>
      <div
        className={`py-3 px-3 2xl:px-6 w-full rounded-xl text-f-dark font-Poppins border border-white text-p-sm md:text-p-rg shadow-sm ${color}`}
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center w-full justify-between mb-5">
          <section>
            <p className="text-p-sc md:text-p-sm font-medium mb-1  text-nowrap truncate">
              {title}
            </p>
            <p className="font-semibold text-h-h6">{value}</p>
          </section>
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
