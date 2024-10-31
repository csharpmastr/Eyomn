import React, { useEffect, useState } from "react";
import AddBranchModel from "../../Component/ui/AddBranchModal";
import { useSelector } from "react-redux";
import BranchCard from "../../Component/ui/BranchCard";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

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
    <div className="w-full h-full flex flex-col items-center p-4 md:p-6 2xl:p-8">
      {!hasSelectedBranch ? (
        <>
          <div className="w-full flex flex-row-reverse">
            <div
              className="h-fit flex justify-center items-center rounded-md px-4 py-3 bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
              onClick={handleOpenStaffModal}
            >
              <FiPlus className="h-5 w-5 mr-2" />
              <h1>Add Branch</h1>
            </div>
          </div>
          {branch && branch.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 mt-4 md:items-center w-full md:h-full">
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
