import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useParams } from "react-router-dom";
import StaffCard from "../../Component/ui/StaffCard";
import AddStaff from "../../Component/ui/AddStaff";
import { useNavigate } from "react-router-dom";

const OrgStaff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { branchId } = useParams();
  const navigate = useNavigate();

  const staffs = useSelector((state) => state.reducer.staff.staffs);

  const filteredStaffs = staffs.filter((staff) => staff.branchId === branchId);

  const handleOpenStaffModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseStaffModal = () => {
    setIsModalOpen(false);
  };

  const handleBackBranch = () => {
    navigate("/organization");
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex justify-between">
        <div
          className="flex justify-center items-center font-Poppins cursor-pointer"
          onClick={handleBackBranch}
        >
          <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
          <h1 className="hidden md:block">Go back</h1>
        </div>
        <div
          className="h-12 w-40 flex justify-center items-center border-2 border-[#222222] rounded-md py-2 px-2 md:px-4 font-Poppins cursor-pointer"
          onClick={handleOpenStaffModal}
        >
          <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
          <h1 className="hidden md:block">Add Staff</h1>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4 items-center w-full h-full">
        {filteredStaffs.length > 0 ? (
          filteredStaffs.map((staff, index) => (
            <StaffCard
              key={index}
              name={
                `${staff.first_name || ""} ${staff.last_name || ""}`.trim() ||
                staff.name
              }
              email={staff.email}
              position={staff.position}
            />
          ))
        ) : (
          <p className="font-semibold text-3xl text-c-secondary">
            No Active Staff found!
          </p>
        )}
      </div>
      {isModalOpen && <AddStaff onClose={handleCloseStaffModal} />}
    </div>
  );
};

export default OrgStaff;
