import React, { useState } from "react";
import AddBranchModel from "../../Component/ui/AddBranchModal";
import { IoIosAddCircleOutline } from "react-icons/io";

const Organization = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenStaffModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseStaffModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-8">
      <div className="w-full flex flex-row-reverse">
        <div
          className="h-12 px-2 w-fit flex justify-center items-center border-2 border-[#222222] rounded-md py-2 md:px-4 font-Poppins cursor-pointer"
          onClick={handleOpenStaffModal}
        >
          <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
          <h1 className="hidden md:block">Add Branch</h1>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-4 items-center w-full h-full">
        <p className="font-semibold text-3xl text-c-secondary">
          No Active Branch found!
        </p>
      </div>
      {isModalOpen && <AddBranchModel onClose={handleCloseStaffModal} />}
    </div>
  );
};

export default Organization;
