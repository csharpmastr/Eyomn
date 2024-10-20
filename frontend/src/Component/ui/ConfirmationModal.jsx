import React, { useState } from "react";
import SuccessModal from "./SuccessModal";
import Loader from "./Loader";
import { deleteProduct } from "../../Service/InventoryService";
import { useDispatch, useSelector } from "react-redux";
import { removeProduct } from "../../Slice/ProductSlice";

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
          <div className="bg-white px-10 p-6 rounded-lg shadow-lg text-center font-Poppins">
            <h3 className="text-lg font-semibold mb-4">Delete Product</h3>
            <p className="mb-6">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
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
