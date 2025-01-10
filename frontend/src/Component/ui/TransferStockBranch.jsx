import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import {
  getBranchRequests,
  getProductStockRequest,
} from "../../Service/InventoryService";
import ConfirmationShareStock from "./ConfirmationShareStock";

const TransferStockBranch = ({ onClose }) => {
  const products = useSelector((state) => state.reducer.inventory.products);
  const user = useSelector((state) => state.reducer.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [requests, setRequests] = useState([]);
  const [branchRequests, setBranchRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const normalize = (str) => str?.toLowerCase().trim();
  const [selectType, setSelectType] = useState("My Request");
  console.log(products);

  useEffect(() => {
    const fetchRequests = async (branchIds, firebaseUid) => {
      try {
        const response = await getProductStockRequest(branchIds, firebaseUid);
        if (response) {
          console.log(response);

          setRequests(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRequests([user.userId], user.firebaseUid);
  }, [user, user.firebaseUid]);

  const groupedRequests = {
    pending: requests.filter((req) => req.status === "pending"),
    onProcess: requests.filter((req) => req.status === "on process"),
    completed: requests.filter((req) => req.status === "completed"),
    rejected: requests.filter((req) => req.status === "rejected"),
  };
  useEffect(() => {
    if (selectType === "Branch Request") {
      const fetchBranchRequests = async (branchId, firebaseUid) => {
        try {
          const response = await getBranchRequests(branchId, firebaseUid);
          if (response) {
            console.log(response);
            setBranchRequests(response);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchBranchRequests(user.userId, user.firebaseUid);
    }
  }, [selectType, user.userId, user.firebaseUid]);

  const toggleConfirmationModal = () => setConfirmationModal(null);

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center p-5 h-screen w-screen bg-zinc-800 bg-opacity-50 z-50 font-Poppins">
      <div className="w-4/5 bg-bg-mc rounded-lg">
        <header className="px-5 py-4 border-b flex justify-between items-center">
          <div className="flex gap-2 bg-white shadow-md shadow-gray-200 p-2 text-p-sm md:text-p-rg rounded-full w-fit border">
            <button
              className={`px-2 py-1 rounded-l-full ${
                selectType === "My Request"
                  ? "bg-c-primary text-f-light"
                  : "bg-none text-p-sc md:text-p-sm text-f-gray"
              }`}
              onClick={() => setSelectType("My Request")}
            >
              My Request
            </button>
            <button
              className={`px-2 py-1 rounded-r-full ${
                selectType === "Branch Request"
                  ? "bg-c-primary text-f-light"
                  : "bg-none text-p-sc md:text-p-sm text-f-gray"
              }`}
              onClick={() => setSelectType("Branch Request")}
            >
              Branch Request
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-md border hover:bg-zinc-50"
          >
            &times;
          </button>
        </header>
        <div className="flex p-5 gap-5 h-[750px]">
          {selectType === "My Request" && (
            <>
              <section className="w-1/3 ">
                <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
                  <h6>Pending</h6>
                  <div className="flex items-center justify-center px-6 h-6 rounded-full bg-orange-300 text-p-sm">
                    {groupedRequests.pending.length}
                  </div>
                </header>
                <div className="pt-5 overflow-y-auto h-[650px]">
                  {groupedRequests.pending.length > 0 ? (
                    <>
                      {" "}
                      {groupedRequests.pending.map((req, index) => {
                        // const branch = branches.find(
                        //   (b) => b.branchId === req.branchId
                        // );
                        // const branchName = branch ? branch.name : "Unknown Branch";

                        return (
                          <div
                            key={index}
                            className="w-full rounded-md p-4 bg-white mb-5 shadow-sm cursor-pointer"
                            // onClick={() => handleRequestClick(req)}
                          >
                            <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                              <p>
                                {new Date(req.createdAt).toLocaleDateString()}
                              </p>
                            </section>
                            <section className="flex justify-between">
                              <article className="text-c-gray3 text-p-sm">
                                <p>Requested Product</p>
                                <p className="font-medium text-f-dark text-p-rg">
                                  {`${req.product_name} (${req.brand})`}
                                </p>
                              </article>
                              <article className="text-c-gray3 text-p-sm">
                                <p>Quantity</p>
                                <p className="font-medium text-f-dark text-p-rg">
                                  {req.quantity}
                                </p>
                              </article>
                            </section>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center items-center w-full">
                        <h1 className="text-center text-f-dark text-lg font-medium">
                          No Pending Requests
                        </h1>
                      </div>
                    </>
                  )}
                </div>
              </section>
              <section className="w-1/3 border-x border-f-gray px-5">
                <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
                  <h6>On Process</h6>
                  <div className="flex items-center justify-center px-6 h-6 rounded-full bg-blue-300 text-p-sm">
                    {groupedRequests.onProcess.length}
                  </div>
                </header>
                <div className="pt-5 overflow-y-auto h-[650px]">
                  {groupedRequests.onProcess.length > 0 ? (
                    <>
                      {groupedRequests.onProcess.map((req, index) => {
                        // const branch = branches.find(
                        //   (b) => b.branchId === req.branchId
                        // );
                        // const branchName = branch ? branch.name : "Unknown Branch";

                        return (
                          <div
                            key={index}
                            className="w-full rounded-md p-4 bg-white mb-5 shadow-sm cursor-pointer"
                            // onClick={() => handleRequestClick(req)}
                          >
                            <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                              <p>
                                {new Date(req.createdAt).toLocaleDateString()}
                              </p>
                            </section>
                            <section className="flex justify-between">
                              <article className="text-c-gray3 text-p-sm">
                                <p>Requested Product</p>
                                <p className="font-medium text-f-dark text-p-rg">
                                  {`${req.product_name} (${req.brand})`}
                                </p>
                              </article>
                              <article className="text-c-gray3 text-p-sm">
                                <p>Quantity</p>
                                <p className="font-medium text-f-dark text-p-rg">
                                  {req.quantity}
                                </p>
                              </article>
                            </section>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center items-center w-full">
                        <h1 className="text-center text-f-dark text-lg font-medium">
                          No On process Requests
                        </h1>
                      </div>
                    </>
                  )}
                </div>
              </section>
              <div className="w-1/3">
                <section className="h-1/2">
                  <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
                    <h6>Completed</h6>
                    <div className="flex items-center justify-center px-6 h-6 rounded-full bg-green-300 text-p-sm">
                      {groupedRequests.completed.length}
                    </div>
                  </header>
                  {groupedRequests.completed.map((req, index) => {
                    // const branch = branches.find(
                    //   (b) => b.branchId === req.branchId
                    // );
                    // const branchName = branch ? branch.name : "Unknown Branch";

                    return (
                      <div
                        key={index}
                        className="w-full rounded-md p-4 bg-white mb-5 shadow-sm cursor-pointer"
                        // onClick={() => handleRequestClick(req)}
                      >
                        <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                          <p>{new Date(req.createdAt).toLocaleDateString()}</p>
                        </section>
                        <section className="flex justify-between">
                          <article className="text-c-gray3 text-p-sm">
                            <p>Requested Product</p>
                            <p className="font-medium text-f-dark text-p-rg">
                              {`${req.product_name} (${req.brand})`}
                            </p>
                          </article>
                          <article className="text-c-gray3 text-p-sm">
                            <p>Quantity</p>
                            <p className="font-medium text-f-dark text-p-rg">
                              {req.quantity}
                            </p>
                          </article>
                        </section>
                      </div>
                    );
                  })}
                </section>
                <section className="h-1/2">
                  <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
                    <h6>Rejected</h6>
                    <div className="flex items-center justify-center px-6 h-6 rounded-full bg-red-300 text-p-sm">
                      {groupedRequests.rejected.length}
                    </div>
                  </header>
                  {groupedRequests.rejected.map((req, index) => {
                    // const branch = branches.find(
                    //   (b) => b.branchId === req.branchId
                    // );
                    // const branchName = branch ? branch.name : "Unknown Branch";

                    return (
                      <div
                        key={index}
                        className="w-full rounded-md p-4 bg-white mb-5 shadow-sm cursor-pointer"
                        // onClick={() => handleRequestClick(req)}
                      >
                        <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                          <p>{new Date(req.createdAt).toLocaleDateString()}</p>
                        </section>
                        <section className="flex justify-between">
                          <article className="text-c-gray3 text-p-sm">
                            <p>Requested Product</p>
                            <p className="font-medium text-f-dark text-p-rg">
                              {`${req.product_name} (${req.brand})`}
                            </p>
                          </article>
                          <article className="text-c-gray3 text-p-sm">
                            <p>Quantity</p>
                            <p className="font-medium text-f-dark text-p-rg">
                              {req.quantity}
                            </p>
                          </article>
                        </section>
                      </div>
                    );
                  })}
                </section>
              </div>
            </>
          )}
          {selectType === "Branch Request" && (
            <>
              <div className="w-full  overflow-auto">
                <header className="border-f-gray pb-3 font-medium text-p-rg flex gap-5">
                  <h6>Pending Request</h6>
                  <div className="flex items-center justify-center px-6 h-6 rounded-full bg-orange-300 text-p-sm">
                    {
                      branchRequests.filter(
                        (dets) =>
                          dets.status !== "rejected" &&
                          dets.status !== "approved"
                      ).length
                    }
                  </div>
                </header>
                <div className="py-5 grid grid-cols-3">
                  {branchRequests
                    .filter(
                      (dets) =>
                        dets.status !== "rejected" && dets.status !== "approved"
                    )
                    .map((dets, index) => {
                      const availableStock = products
                        .filter(
                          (dets) =>
                            dets.status !== "rejected" &&
                            dets.status !== "completed"
                        )
                        .filter(
                          (product) =>
                            normalize(product.product_name) ===
                              normalize(dets.product_name) &&
                            normalize(product.brand) ===
                              normalize(dets.brand) &&
                            normalize(product.category) ===
                              normalize(dets.category)
                        )
                        .reduce(
                          (total, product) => total + product.quantity,
                          0
                        );

                      return (
                        <div key={index} className="w-[400px] mb-10">
                          <div className="w-full rounded-md p-4 bg-white mb-3 shadow-sm cursor-pointer">
                            <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                              <p>
                                Branch{" "}
                                <span className="font-medium px-3 rounded-full bg-c-primary text-f-light">
                                  {dets.branchName}
                                </span>
                              </p>
                              <p>{dets.date}</p>
                            </section>
                            <section className="flex justify-between mb-4">
                              <article className="text-c-gray3 text-p-sm">
                                <p>Requested Product</p>
                                <p className="font-medium text-f-dark text-p-rg">
                                  {dets.product_name} ({dets.brand})
                                </p>
                              </article>
                              <article className="text-c-gray3 text-p-sm">
                                <p>Quantity</p>
                                <p className="font-medium text-f-dark text-p-rg">
                                  {dets.quantity} pcs
                                </p>
                              </article>
                            </section>
                            <section className="text-p-sm text-c-gray3 mb-4">
                              <p>Remarks</p>
                              <div className="border rounded-md p-2 h-20 overflow-auto">
                                <p className="font-medium text-f-dark">
                                  {dets.remark}
                                </p>
                              </div>
                            </section>
                            <section className="text-p-sm text-c-gray3">
                              <p>Requested To</p>
                              <p className="font-medium text-f-dark text-p-rg">
                                {user.name}
                              </p>
                            </section>
                          </div>
                          <div className="rounded-md w-full bg-bg-sb border border-c-primary p-4 text-p-sm text-c-gray3 shadow-sm">
                            <section className="mb-4">
                              <p>
                                Transfer Stock{" "}
                                <span className="text-blue-500">*</span>
                              </p>
                              <div className="flex items-center justify-between mb-4">
                                <p className="w-1/3 text-f-dark font-medium">
                                  Available Stock <br />
                                  {availableStock}
                                </p>
                                <FiArrowRight className="text-f-dark text-p-lg w-1/3" />
                                <input
                                  type="number"
                                  name={`stock_transfer_${index}`}
                                  min={0}
                                  value={dets.quantity || 0}
                                  className="mt-1 w-1/3 px-4 py-3 border rounded-md text-f-dark focus:outline-c-primary"
                                  placeholder="0"
                                />
                              </div>
                            </section>
                            <footer className="flex gap-4 font-medium text-f-light justify-end">
                              <button
                                className="rounded-full border shadow-sm hover:bg-sb-org px-6 py-1 text-f-dark"
                                onClick={() => (
                                  setConfirmationModal("Reject"),
                                  setSelectedRequest(dets)
                                )}
                              >
                                Reject
                              </button>
                              <button
                                className="rounded-full bg-bg-con hover:bg-opacity-75 active:bg-pressed-branch px-6 py-1"
                                onClick={() => (
                                  setConfirmationModal("Approve"),
                                  setSelectedRequest(dets)
                                )}
                              >
                                Approve
                              </button>
                            </footer>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </div>
        {confirmationModal && (
          <ConfirmationShareStock
            onClose={toggleConfirmationModal}
            title={
              confirmationModal === "Reject"
                ? "Reject Request"
                : "Approve Request"
            }
            message={
              confirmationModal === "Reject"
                ? "This can't be undone."
                : "This will transfer the stock to requesting branch."
            }
            requestDetails={selectedRequest}
          />
        )}
      </div>
    </div>
  );
};

export default TransferStockBranch;
