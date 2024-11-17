import React, { useState } from "react";
import SuccessModal from "./SuccessModal";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";

const ConfirmationModal = ({
  title,
  handleDelete,
  isSuccessModalOpen,
  onClose,
  actionText = "Delete",
  successMessage = "This can't be undone",
  actionSuccessMessage = "The action was successfully completed.",
  isLoading,
}) => {
  const [localSuccessMessage, setLocalSuccessMessage] =
    useState(actionSuccessMessage);

  const handleSuccessModalClose = () => {
    onClose();
  };

  return (
    <>
      {isLoading && <Loader description={"Deleting Product. Please wait..."} />}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-10">
        <div className="bg-white rounded-lg shadow-lg font-Poppins w-[400px]">
          <header className="p-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
            <h3 className="text-p-sm md:text-p-rg font-medium">{title}</h3>
            <button onClick={onClose}>&times;</button>
          </header>
          <p className="my-8 ml-4">{successMessage}</p>
          <div className="flex border-t p-4 justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 md:px-6 lg:px-12 py-2 ring-1 ring-f-gray rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 md:px-6 lg:px-12 py-2 bg-red-500 text-f-light rounded-md"
            >
              {actionText}
            </button>
          </div>
        </div>
      </div>
      {isSuccessModalOpen && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          title={"Deletion Confirmed"}
          description={localSuccessMessage}
          onClose={handleSuccessModalClose}
        />
      )}
    </>
  );
};

export default ConfirmationModal;
