import React, { useState } from "react";
import StaffCard from "../../Component/ui/StaffCard";
import AddStaffModal from "../../Component/ui/AddStaffModal";
import { useSelector } from "react-redux";
import { IoIosAddCircleOutline } from "react-icons/io";

const Organization = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const staffs = useSelector((state) => state.reducer.staff.staffs);

  const handleOpenStaffModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseStaffModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div
        className="h-12 w-40 flex justify-center items-center border-2 border-[#222222] rounded-md py-2 px-2 md:px-4 font-Poppins cursor-pointer"
        onClick={handleOpenStaffModal} // Open the modal on click
      >
        <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
        <h1 className="hidden md:block">Add Staff</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {staffs.map((staff, index) => (
          <StaffCard
            key={index}
            name={
              `${staff.first_name || ""} ${staff.last_name || ""}`.trim() ||
              staff.name
            }
            email={staff.email}
            position={staff.specialty}
          />
        ))}
      </div>
      {isModalOpen && <AddStaffModal onClose={handleCloseStaffModal} />}
    </div>
  );
};

export default Organization;
