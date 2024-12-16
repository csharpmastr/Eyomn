import React, { useState } from "react";
import RequestDetails from "./RequestDetails";

const TransferStock = ({ onClose }) => {
  const samplePending = [
    {
      bName: "Santa Cruz",
      date: "12/05/2024",
      reqP: "Apple Cider",
      qty: "20 pcs",
    },
    {
      bName: "Paete",
      date: "12/06/2024",
      reqP: "Dodo",
      qty: "10 pcs",
    },
  ];

  const [openDetails, setOpenDetails] = useState(false);

  const handleToggle = () => setOpenDetails(!openDetails);

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
          <section className="w-1/3">
            <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
              <h6>Pending</h6>
              <div className="flex items-center justify-center px-6 h-6 rounded-full bg-yellow-300 text-p-sm">
                {samplePending.length}
              </div>
            </header>
            <div className="py-5 overflow-auto">
              {samplePending.map((deepStrictEqual, index) => (
                <div
                  className="w-full rounded-md p-4 bg-white mb-5 shadow-sm cursor-pointer"
                  key={index}
                  onClick={handleToggle}
                >
                  <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                    <p>
                      Branch{" "}
                      <span className="text-f-dark font-medium">
                        {deepStrictEqual.bName}
                      </span>
                    </p>
                    <p>{deepStrictEqual.date}</p>
                  </section>
                  <section className="flex justify-between">
                    <article className="text-c-gray3 text-p-sm">
                      <p>Requested Product</p>
                      <p className="font-medium text-f-dark text-p-rg">
                        {deepStrictEqual.reqP}
                      </p>
                    </article>
                    <article className="text-c-gray3 text-p-sm">
                      <p>Quantity</p>
                      <p className="font-medium text-f-dark text-p-rg">
                        {deepStrictEqual.qty}
                      </p>
                    </article>
                  </section>
                </div>
              ))}
            </div>
          </section>
          <section className="w-1/3 border-x border-f-gray px-5">
            <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
              <h6>On Process</h6>
              <div className="flex items-center justify-center px-6 h-6 rounded-full bg-blue-300 text-p-sm">
                0
              </div>
            </header>
          </section>
          <div className="w-1/3">
            <section className="h-1/2">
              <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
                <h6>Completed</h6>
                <div className="flex items-center justify-center px-6 h-6 rounded-full bg-green-300 text-p-sm">
                  0
                </div>
              </header>
            </section>
            <section className="h-1/2">
              <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
                <h6>Rejected</h6>
                <div className="flex items-center justify-center px-6 h-6 rounded-full bg-red-300 text-p-sm">
                  0
                </div>
              </header>
            </section>
          </div>
        </div>
      </div>
      {openDetails && <RequestDetails onClose={handleToggle} />}
    </div>
  );
};

export default TransferStock;
