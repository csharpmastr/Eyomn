import React, { useEffect, useState } from "react";
import AddBranchModel from "../../Component/ui/AddBranchModal";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import StaffCard from "../../Component/ui/StaffCard";
import BranchCard from "../../Component/ui/BranchCard";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Organization = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const branch = useSelector((state) => state.reducer.branch.branch);
  const location = useLocation();
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
  useEffect(() => {
    if (location.state && location.state.resetSelected) {
      setHasSelectedBranch(false);
    }
  }, [location.state]);

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-6">
      {!hasSelectedBranch ? (
        <>
          <div className="w-full flex flex-row-reverse">
            <div
              className="px-4 py-2 flex justify-center items-center border border-c-gray3 rounded-md font-Poppins cursor-pointer mb-8 md:mb-0"
              onClick={handleOpenStaffModal}
            >
              <IoIosAddCircleOutline className="h-6 w-6 mr-2" />
              <h1>Add Branch</h1>
            </div>
          </div>
          {branch && branch.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 md:items-center w-full md:h-full">
              {branch.map((branchItem) => (
                <div
                  key={branchItem.branchId}
                  onClick={() => handleBranchClick(branchItem.branchId)}
                >
                  <BranchCard name={branchItem.name} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-center w-full h-full">
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
