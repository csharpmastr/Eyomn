import React from "react";
import { FiUser } from "react-icons/fi";

const StaffCard = ({ staffData, showImage = true, onClick }) => {
  return (
    <div
      className="w-[300px] rounded-lg overflow-hidden shadow-sm hover:cursor-pointer font-Poppins text-f-dark"
      onClick={onClick}
    >
      <div
        className={` h-fit p-3 ${
          staffData.position !== "Staff" ? "bg-c-primary" : "bg-c-staff"
        }`}
      >
        <h1 className="text-p-sc md:text-p-sm text-f-light font-medium">
          {staffData.position}
        </h1>
      </div>
      <div
        className={`p-6 flex bg-white ${
          showImage ? "items-center space-x-4" : "flex-col items-center"
        }`}
      >
        {showImage ? (
          <FiUser className="text-white w-16 h-16 bg-gray-300 rounded-xl p-2" />
        ) : (
          <img
            className="w-16 h-16 rounded-xl object-cover bg-gray-100"
            src="profile-pic.jpg"
            alt="Profile Image"
          />
        )}
        <div>
          <h3 className="text-p-rg md:text-p-lg font-semibold text-f-dark">
            {staffData.first_name + " " + staffData.last_name}
          </h3>
          <p className="text-p-sm md:text-p-rg">{staffData.email}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
