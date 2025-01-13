import React, { useState } from "react";
import {
  approveProductRequest,
  rejectProductRequest,
  updateRequestStatus,
} from "../../Service/InventoryService";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";

const ConfirmationShareStock = ({
  onClose,
  title,
  message,
  requestDetails,
}) => {
  const user = useSelector((state) => state.reducer.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDescription, setSuccessDescription] = useState("");
  const handleApproveRequest = async () => {
    try {
      setIsLoading(true);
      const response = await approveProductRequest(
        user.userId,
        requestDetails,
        user.firebaseUid
      );
      if (response) {
        setIsSuccess(true);
        setSuccessDescription("Request Approved");
        console.log("Request Approved");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRejectRequest = async () => {
    try {
      setIsLoading(true);
      const response = await rejectProductRequest(
        user.userId,
        requestDetails,
        user.firebaseUid
      );
      if (response) {
        setIsSuccess(true);
        setSuccessDescription("Request Rejected");
        console.log("Request Rejected");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className="fixed inset-0 flex items-center justify-center bg-zinc-800 bg-opacity-50 z-50 p-10">
        <div className="bg-white rounded-lg shadow-lg font-Poppins w-[420px]">
          <header className="px-4 py-5 border-b flex justify-between items-center">
            <h1 className="text-p-rg text-f-dark font-medium">{title}</h1>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-md border hover:bg-zinc-50"
            >
              &times;
            </button>
          </header>
          <div className="p-5">
            <p>{message}</p>
          </div>
          <footer className="flex gap-4 justify-end p-4 mt-4">
            <button
              className="px-4 lg:px-10 py-2 text-f-dark text-p-sm md:text-p-rg font-medium rounded-md border shadow-sm hover:bg-sb-org"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 lg:px-12 py-2 text-f-light text-p-sm md:text-p-rg font-medium rounded-md  hover:bg-opacity-75 ${
                title === "Approve Request" ? "bg-bg-con" : "bg-red-500"
              }`}
              onClick={
                title === "Approve Request"
                  ? handleApproveRequest
                  : handleRejectRequest
              }
            >
              {title === "Approve Request" ? "Transfer" : "Reject"}
            </button>
          </footer>
        </div>
      </div>
      {isSuccess && (
        <SuccessModal
          isOpen={isSuccess}
          onClose={onClose}
          description={successDescription}
          title={"Request Status Updated!"}
        />
      )}
    </>
  );
};

export default ConfirmationShareStock;
