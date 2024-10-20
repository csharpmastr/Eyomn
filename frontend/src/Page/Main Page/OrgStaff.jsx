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

  const filteredStaffs = staffs.filter((staff) =>
    staff.branches.some((branch) => branch.branchId === branchId)
  );
  console.log(filteredStaffs);

  const handleOpenStaffModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseStaffModal = () => {
    setIsModalOpen(false);
  };

  const handleBackBranch = () => {
    navigate("/organization", { state: { resetSelected: true } });
  };
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex justify-between">
        <div
          className="flex justify-center items-center font-Poppins cursor-pointer gap-2"
          onClick={handleBackBranch}
        >
          <IoIosAddCircleOutline className="h-6 w-6" />
          <h1>Go back</h1>
        </div>
        <div
          className="px-4 py-2 flex gap-2 justify-center items-center border border-c-gray3 rounded-md font-Poppins cursor-pointer"
          onClick={handleOpenStaffModal}
        >
          <IoIosAddCircleOutline className="h-6 w-6" />
          <h1>Add Staff</h1>
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
