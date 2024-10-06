import React from "react";

const StaffCard = ({ name, email, position }) => {
  return (
    <div className="min-w-[350px] rounded-lg overflow-hidden shadow-lg font-poppins">
      <div className="bg-[#4FC8CF] px-6 h-5 font-bold "></div>
      <div className="border-b-2">
        <h1 className=" text-[20px] px-4 py-1 font-semibold text-[#222222]">
          {position}
        </h1>
      </div>
      <div className="p-6 flex items-center space-x-4">
        <img
          className="w-20 h-20 rounded-full object-cover"
          src="profile-pic.jpg"
          alt="Profile Image0"
        />
        <div>
          <h3 className="text-xl font-semibold  text-[#222222]">{name}</h3>
          <p className="text-[#222222]  mt-2">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
