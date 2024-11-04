import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiPlus } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import { useParams } from "react-router-dom";
import StaffCard from "../../Component/ui/StaffCard";
import AddStaff from "../../Component/ui/AddStaff";
import { useNavigate } from "react-router-dom";

const OrgStaff = () => {
  const staffs = useSelector((state) => state.reducer.staff.staffs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [staffDetails, setStaffDetails] = useState(null);

  // Filter staff based on the current branchId
  const filteredStaffs = staffs.filter((staff) =>
    staff.branches.some((branch) => branch.branchId === branchId)
  );

  const handleOpenStaffModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseStaffModal = () => {
    setIsModalOpen(false);
    setStaffDetails(null); // Reset staff details when closing the modal
  };

  const handleBackBranch = () => {
    navigate("/organization", { state: { resetSelected: true } });
  };

  // Handle staff click for editing
  const handleClickStaff = (staffId) => {
    const staffToEdit = filteredStaffs.find(
      (staff) => staff.staffId === staffId
    );
    setStaffDetails(staffToEdit);
    setIsModalOpen(true); // Open modal in edit mode
  };

  return (
    <>
      <div className="w-full h-full flex flex-col items-center font-Poppins text-f-dark">
        <div className="w-full flex justify-between">
          <div>
            <div
              className="flex items-center cursor-pointer gap-1 text-p-sm"
              onClick={handleBackBranch}
            >
              <FiArrowLeft className="h-5 w-5" />
              <h1>Go back</h1>
            </div>
            <h1 className="font-medium text-p-lg text-c-secondary">
              Branch Staffs
            </h1>
          </div>
          <div
            className="h-auto flex justify-center items-center rounded-md px-4 py-3 bg-c-secondary text-f-light hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
            onClick={handleOpenStaffModal}
          >
            <FiPlus className="h-5 w-5 mr-2" />
            <h1>Add staff</h1>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4 items-center w-full h-full">
          {filteredStaffs.length > 0 ? (
            filteredStaffs.map((staff) => (
              <div
                key={staff.staffId}
                onClick={() => handleClickStaff(staff.staffId)}
              >
                <StaffCard staffData={staff} />
              </div>
            ))
          ) : (
            <p className="font-medium text-xl text-f-gray2">
              No Active Staff found!
            </p>
          )}
        </div>
        {isModalOpen && (
          <AddStaff onClose={handleCloseStaffModal} staffData={staffDetails} />
        )}
      </div>
    </>
  );
};

export default OrgStaff;
