import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InfoPassModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/manage-profile/Account`);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-800 bg-opacity-50 z-50 font-Poppins">
      <div className="bg-f-light rounded-lg shadow-lg w-[440px] p-6">
        <header className="flex justify-between items-center">
          <h1 className="text-p-rg md:text-p-lg text-f-dark font-medium">
            Update Your Password
          </h1>
          <button onClick={onClose}>&times;</button>
        </header>
        <p className="text-c-gray3 text-p-sm md:text-p-rg mt-4 mb-10">
          We recommend updating your password to ensure your account's security.
          Click the button below to set a new password.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleNavigate("Account")}
            className="px-4 py-2 bg-bg-con text-f-light text-p-sm md:text-p-rg font-medium rounded-md hover:bg-opacity-75 active:bg-pressed-branch"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPassModal;
