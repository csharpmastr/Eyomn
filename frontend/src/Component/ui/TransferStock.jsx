import React, { useEffect, useState } from "react";
import RequestDetails from "./RequestDetails";
import { useSelector } from "react-redux";
import { getProductStockRequest } from "../../Service/InventoryService";

const TransferStock = ({ onClose }) => {
  const branches = useSelector((state) => state.reducer.branch.branch);
  const products = useSelector((state) => state.reducer.inventory.products);
  const user = useSelector((state) => state.reducer.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const branchId = branches.map((branch) => branch.branchId);

  useEffect(() => {
    const fetchRequests = async (branchIds, firebaseUid) => {
      try {
        const response = await getProductStockRequest(branchIds, firebaseUid);
        if (response) {
          setRequests(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRequests(branchId, user.firebaseUid);
  }, [user, user.firebaseUid]);

  const handleRequestClick = (request) => {
    const branch = branches.find((b) => b.branchId === request.branchId);
    const branchName = branch ? branch.name : "Unknown Branch";
    setSelectedRequest({ ...request, branchName });
  };

  const groupedRequests = {
    pending: requests.filter((req) => req.status === "pending"),
    onProcess: requests.filter((req) => req.status === "on process"),
    completed: requests.filter((req) => req.status === "completed"),
    rejected: requests.filter((req) => req.status === "rejected"),
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center p-5 h-screen w-screen bg-zinc-800 bg-opacity-50 z-50 font-Poppins">
      <div className="w-4/5 bg-bg-mc rounded-lg">
        <header className="px-5 py-4 border-b flex justify-between items-center">
          <h1 className="text-p-rg md:text-p-lg font-medium">
            Stock Transfer Monitoring
          </h1>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-md border hover:bg-zinc-50"
          >
            &times;
          </button>
        </header>
        <div className="flex p-5 gap-5 h-[750px]">
          {isLoading ? (
            <div className="flex justify-center items-center w-full">
              <h1 className="text-p-rg md:text-p-lg font-medium">
                Getting requests...
              </h1>
            </div>
          ) : (
            <>
              <section className="w-1/3 overflow-auto">
                <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
                  <h6>Pending</h6>
                  <div className="flex items-center justify-center px-6 h-6 rounded-full bg-orange-300 text-p-sm">
                    {groupedRequests.pending.length}
                  </div>
                </header>
                <div className="pt-5 overflow-y-auto h-[650px]">
                  {groupedRequests.pending.map((req, index) => {
                    const branch = branches.find(
                      (b) => b.branchId === req.branchId
                    );
                    const branchName = branch ? branch.name : "Unknown Branch";

                    return (
                      <div
                        key={index}
                        className="w-full rounded-md p-4 bg-white mb-5 shadow-sm cursor-pointer"
                        onClick={() => handleRequestClick(req)}
                      >
                        <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                          <p>
                            Branch{" "}
                            <span className="font-medium px-3 rounded-full bg-c-primary text-f-light">
                              {branchName}
                            </span>
                          </p>
                          <p>
                            {new Date(req.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </section>
                        <section className="flex justify-between mb-4">
                          <article className="text-c-gray3 text-p-sm">
                            <p>Requested Product</p>
                            <p className="font-medium text-f-dark text-p-rg">
                              {`${req.product_name} (${req.brand})`}
                            </p>
                          </article>
                          <article className="text-c-gray3 text-p-sm">
                            <p>Quantity</p>
                            <p className="font-medium text-f-dark text-p-rg">
                              {req.quantity} pcs
                            </p>
                          </article>
                        </section>
                        <section className="text-p-sm text-c-gray3 mb-4">
                          <p>Remarks</p>
                          <div className="border rounded-md p-2 h-20 overflow-auto">
                            <p className="font-medium text-f-dark">
                              {req.remark}
                            </p>
                          </div>
                        </section>
                      </div>
                    );
                  })}
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
                  {groupedRequests.onProcess.map((req, index) => {
                    const branch = branches.find(
                      (b) => b.branchId === req.branchId
                    );
                    const branchName = branch ? branch.name : "Unknown Branch";

                    return (
                      <div
                        key={index}
                        className="w-full rounded-md p-4 bg-white mb-5 shadow-sm cursor-pointer"
                        onClick={() => handleRequestClick(req)}
                      >
                        <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                          <p>
                            Branch{" "}
                            <span className="text-f-dark font-medium">
                              {branchName}
                            </span>
                          </p>
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
                  <div className="h-[300px] overflow-y-auto">
                    {groupedRequests.completed.map((req, index) => {
                      const branch = branches.find(
                        (b) => b.branchId === req.branchId
                      );
                      const branchName = branch
                        ? branch.name
                        : "Unknown Branch";

                      return (
                        <div
                          key={index}
                          className="w-full rounded-md p-4 bg-white mb-5 shadow-sm cursor-pointer"
                          onClick={() => handleRequestClick(req)}
                        >
                          <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                            <p>
                              Branch{" "}
                              <span className="text-f-dark font-medium">
                                {branchName}
                              </span>
                            </p>
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
                  </div>
                </section>
                <section className="h-1/2">
                  <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
                    <h6>Rejected</h6>
                    <div className="flex items-center justify-center px-6 h-6 rounded-full bg-red-300 text-p-sm">
                      {groupedRequests.rejected.length}
                    </div>
                  </header>{" "}
                  <div className="h-[300px] overflow-y-auto">
                    {groupedRequests.rejected.map((req, index) => {
                      const branch = branches.find(
                        (b) => b.branchId === req.branchId
                      );
                      const branchName = branch
                        ? branch.name
                        : "Unknown Branch";

                      return (
                        <div
                          key={index}
                          className="w-full rounded-md p-4 bg-white mb-5 shadow-sm cursor-pointer"
                          onClick={() => handleRequestClick(req)}
                        >
                          <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                            <p>
                              Branch{" "}
                              <span className="text-f-dark font-medium">
                                {branchName}
                              </span>
                            </p>
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
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
      {selectedRequest && (
        <RequestDetails
          details={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default TransferStock;
