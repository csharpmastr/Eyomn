import React from "react";
import { useSelector } from "react-redux";

const RequestDetails = ({ onClose, details }) => {
  const products = useSelector((state) => state.reducer.inventory.products);
  const branches = useSelector((state) => state.reducer.branch.branch);
  const normalize = (str) => str?.toLowerCase().trim();

  const branchOptions = products
    .filter(
      (product) =>
        normalize(product.product_name) === normalize(details.product_name) &&
        normalize(product.brand) === normalize(details.brand) &&
        normalize(product.category) === normalize(details.category) &&
        product.branchId !== details.branchId
    )
    .map((product) => {
      const branch = branches.find((b) => b.branchId === product.branchId);
      return {
        branchName: branch?.name || "Unknown Branch",
        branchId: product.branchId,
        quantity: product.quantity,
      };
    });
  return (
    <div className="fixed px-5 top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-15 z-50 font-Poppins  text-f-dark">
      <div className="w-[400px] bg-white rounded-lg">
        <header className="p-4 border-b flex justify-between items-center">
          <h1 className="text-p-rg md:text-p-lg font-medium">
            Request Details
          </h1>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-md border hover:bg-zinc-50"
          >
            &times;
          </button>
        </header>
        <div className="p-4">
          <section className="flex text-p-sm text-c-gray3 mb-4">
            <p className="w-5/6">
              Branch{" "}
              <span className="font-medium px-3 rounded-full bg-c-primary text-f-light">
                {details.branchName}
              </span>
            </p>
            <p className="w-2/6">
              {new Date(details.createdAt).toLocaleDateString()}
            </p>
          </section>
          <section className="text-p-sm text-c-gray3 mb-4">
            <p>Requested Product</p>
            <p className="text-p-rg font-medium text-f-dark">
              {`${details.product_name} (${details.brand}) - ${details.quantity} pcs`}
            </p>
          </section>
          <section className="text-p-sm text-c-gray3 mb-4">
            <p>Remarks</p>
            <div className="border rounded-md p-2">
              <p className="font-medium text-f-dark">{details.remark}</p>
            </div>
          </section>
          <section className="text-p-sm text-c-gray3">
            <p>Request To</p>
            <select
              name="branches"
              className="mt-1 w-full p-2 border rounded-md text-f-dark focus:outline-c-primary"
            >
              <option value="" disabled className="text-c-gray3">
                Select Branch
              </option>
              {branchOptions.length > 0 ? (
                branchOptions.map((branch) => (
                  <option key={branch.branchId} value={branch.branchId}>
                    {`${branch.branchName} (${branch.quantity} pcs)`}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No available stock in all branches
                </option>
              )}
            </select>
          </section>
          <footer className="flex gap-4 mt-12 font-medium text-f-light justify-end">
            <button className="rounded-full border shadow-sm hover:bg-sb-org px-6 py-1 text-f-dark">
              Reject
            </button>
            <button className="rounded-full bg-bg-con hover:bg-opacity-75 active:bg-pressed-branch px-6 py-1">
              Approve
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
