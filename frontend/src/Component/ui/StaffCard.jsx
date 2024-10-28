import React from "react";

const StaffCard = ({ staffData, showImage = true, onClick }) => {
  return (
    <div
      className="min-w-[350px] rounded-lg overflow-hidden shadow-lg hover:cursor-pointer font-Poppins"
      onClick={onClick}
    >
      <div className="bg-[#41a6ac] h-fit font-bold px-4 py-4">
        <h1 className="text-p-lg font-semibold text-f-light">
          {staffData.position}
        </h1>
      </div>
      <div
        className={`p-6 flex bg-white ${
          showImage ? "items-center space-x-4" : "flex-col items-center"
        }`}
      >
        {showImage && (
          <img
            className="w-20 h-20 rounded-full object-cover bg-gray-100"
            src="profile-pic.jpg"
            alt="Profile Image"
          />
        )}
        <div>
          <h3 className="text-p-lg font-semibold text-f-dark">
            {staffData.first_name + " " + staffData.last_name}
          </h3>
          <p className="text-p-rg text-f-dark">{staffData.email}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
