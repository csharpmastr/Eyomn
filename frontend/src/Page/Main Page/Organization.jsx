import React, { useState } from "react";
import AddBranchModel from "../../Component/ui/AddBranchModal";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import StaffCard from "../../Component/ui/StaffCard";
import { Outlet, useNavigate } from "react-router-dom";

const Organization = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const branch = useSelector((state) => state.reducer.branch.branch);

  const [hasSelectedBranch, setHasSelectedBranch] = useState(false);

  const navigate = useNavigate();

  const handleOpenStaffModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseStaffModal = () => {
    setIsModalOpen(false);
  };

  const handleBranchClick = (branchId) => {
    setHasSelectedBranch(true);

    navigate(`/organization/${branchId}`);
  };

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-8">
      {!hasSelectedBranch ? (
        <>
          <div className="w-full flex flex-row-reverse">
            <div
              className="h-12 px-2 w-fit flex justify-center items-center border-2 border-[#222222] rounded-md py-2 md:px-4 font-Poppins cursor-pointer"
              onClick={handleOpenStaffModal}
            >
              <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
              <h1 className="hidden md:block">Add Branch</h1>
            </div>
          </div>
          {branch && branch.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 mt-4 items-center w-full h-full">
              {branch.map((branchItem) => (
                <div
                  key={branchItem.branchId}
                  onClick={() => handleBranchClick(branchItem.branchId)}
                >
                  <StaffCard name={branchItem.name} showImage={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 mt-4 items-center w-full h-full">
              <p className="font-semibold text-3xl text-c-secondary">
                No Active Branch found!
              </p>
            </div>
          )}

          {isModalOpen && <AddBranchModel onClose={handleCloseStaffModal} />}
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Organization;
