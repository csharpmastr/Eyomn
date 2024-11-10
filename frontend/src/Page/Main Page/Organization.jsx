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
    <div className="w-full h-full flex flex-col items-center p-4 md:p-6 2xl:p-8 font-Poppins">
      {!hasSelectedBranch ? (
        <>
          <div className="w-full flex items-center justify-between">
            <h1 className="text-c-secondary font-medium text-p-rg md:text-p-lg">
              Organization Branches
            </h1>
            <div
              className="h-fit flex justify-center text-p-sm md:text-p-rg items-center rounded-md px-4 py-3 bg-c-secondary text-f-light hover:cursor-pointer hover:bg-opacity-75"
              onClick={handleOpenStaffModal}
            >
              <FiPlus className="h-5 w-5 mr-2" />
              <h1>Add branch</h1>
            </div>
          </div>
          {branch && branch.length > 0 ? (
            <>
              <div className="flex flex-wrap justify-center gap-4 mt-4 md:items-center w-full md:h-full">
                {branch.map((branchItem) => (
                  <div
                    key={branchItem.branchId}
                    onClick={() => handleBranchClick(branchItem.branchId)}
                  >
                    <BranchCard
                      name={branchItem.name}
                      municipality={branchItem.municipality}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-wrap justify-center items-center w-full h-full">
              <p className="font-medium text-xl text-f-gray2">
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
