import React, { useState } from "react";
import SuccessModal from "./SuccessModal";
import Loader from "./Loader";
import { deleteProduct } from "../../Service/InventoryService";
import { useDispatch, useSelector } from "react-redux";
import { removeProduct } from "../../Slice/InventorySlice";

const ConfirmationModal = ({ productId, onClose }) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();
  let branchId =
    (user.branches && user.branches.length > 0 && user.branches[0].branchId) ||
    user.userId;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteProduct(
        branchId,
        productId,
        { isDeleted: true },
        user.firebaseUid
      );
      if (response) {
        setSuccessMessage("Product has been successfully deleted.");
        reduxDispatch(removeProduct(productId));
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    onClose();
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-10">
          <div className="bg-white rounded-lg shadow-lg font-Poppins w-[400px]">
            <header className="p-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
              <h3 className="text-p-rg font-medium">Delete Product</h3>
              <button onClick={onClose}>&times;</button>
            </header>
            <p className="my-8 ml-4">This can't be undone</p>
            <div className="flex border-t p-4 justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 ring-1 ring-f-gray rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-f-light rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isSuccessModalOpen && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          title={"Deletion Confirmed"}
          description={successMessage}
          onClose={handleSuccessModalClose}
        />
      )}
    </>
  );
};

export default ConfirmationModal;
