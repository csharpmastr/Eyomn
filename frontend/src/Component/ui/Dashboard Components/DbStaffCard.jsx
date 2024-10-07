import React from "react";

const DbStaffCard = () => {
  return (
    <div className="bg-blue-200 rounded-lg flex items-center text-c-secondary font-Poppins gap-3 w-72 pl-3 py-3">
      <img
        className="w-14 h-14 rounded-full object-cover bg-f-gray"
        src="profile-pic.jpg"
        alt="Profile Image"
      />
      <h3 className="font-medium text-p-rg">Staff Name</h3>
    </div>
  );
};

export default DbStaffCard;
