import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SalesBreakDownModal from "../SalesBreakDownModal";

const DbCard = ({ title, value, percentageChange, color, bg }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (title === "Gross Income") {
      setIsModalOpen(!isModalOpen);
    } else if (title === "Total Patients") {
      navigate("/patient");
      sessionStorage.setItem("selectedTab", "patient");
    } else if (title === "Total Product") {
      navigate("/inventory");
      sessionStorage.setItem("selectedTab", "inventory");
    }
  };

  return (
    <>
      <div
        className={`py-3 px-3 2xl:px-6 md:w-full rounded-xl text-f-dark font-Poppins border border-white text-p-sm md:text-p-rg shadow-sm ${color} cursor-pointer`}
        onClick={handleCardClick}
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center w-full justify-between mb-5">
          <section>
            <p className="text-p-sc md:text-p-sm font-medium mb-1 text-nowrap truncate">
              {title}
            </p>
            <p className="font-semibold text-h-h6 text-nowrap">{value}</p>
          </section>
        </div>
        <p className="text-p-sc md:text-p-sm mt-2 text-nowrap">
          <span className="text-[#3FB59D]">{percentageChange}</span> vs last
          month
        </p>
        {isModalOpen && (
          <SalesBreakDownModal onClose={handleCardClick} gross={value} />
        )}
      </div>
    </>
  );
};

export default DbCard;
