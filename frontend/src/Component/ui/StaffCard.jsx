import React from "react";

const StaffCard = ({ name, email, position, showImage = true }) => {
  return (
    <div className="min-w-[350px] rounded-lg overflow-hidden shadow-lg hover:cursor-pointer">
      <div className="bg-[#4FC8CF] px-6 h-5 font-bold font-Poppins"></div>
      <div className="border-b-2">
        <h1 className="font-Poppins text-[20px] px-4 py-1 font-semibold text-[#222222]">
          {position}
        </h1>
      </div>
      <div
        className={`p-6 flex ${
          showImage ? "items-center space-x-4" : "flex-col items-center"
        }`}
      >
        {showImage && (
          <img
            className="w-20 h-20 rounded-full object-cover"
            src="profile-pic.jpg"
            alt="Profile Image"
          />
        )}
        <div className={`${!showImage && "text-center"}`}>
          <h3 className="text-xl font-semibold font-Poppins text-[#222222]">
            {name}
          </h3>
          <p className="text-[#222222] font-Poppins mt-2">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
