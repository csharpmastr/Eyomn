import React, { useState } from "react";

const TransferStockBranch = ({ onClose }) => {
  const samplePending = [
    {
      bName: "Santa Cruz",
      date: "December 12, 2024",
      reqP: "Apple Cider (Eye Glass)",
      qty: "20 pcs",
      remarks:
        "Yao Ming, an 8-time NBA All-Star. The Chinese basketball icon played for the Houston Rockets and was known for his dominant presence in the paint.",
    },
    {
      bName: "Paete",
      date: "December 06, 2024",
      reqP: "Dodo (Other)",
      qty: "10 pcs",
      remarks:
        "Yao Ming, an 8-time NBA All-Star. The Chinese basketball icon played for the Houston Rockets and was known for his dominant presence in the paint.",
    },
  ];

  const sampleOnprocess = [
    {
      bName: "Santa Cruz",
      date: "December 16, 2024",
      reqP: "Energen (Medecine)",
      qty: "20 pcs",
      remarks:
        "Yao Ming, an 8-time NBA All-Star. The Chinese basketball icon played for the Houston Rockets and was known for his dominant presence in the paint.",
    },
  ];

  const [selectType, setSelectType] = useState("My Request");

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
              <section className="w-1/3 overflow-auto">
                <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
                  <h6>Pending</h6>
                  <div className="flex items-center justify-center px-6 h-6 rounded-full bg-yellow-300 text-p-sm">
                    {samplePending.length}
                  </div>
                </header>
                <div className="py-5">
                  {samplePending.map((deepStrictEqual, index) => (
                    <div
                      className="w-full rounded-md p-4 bg-white mb-5 shadow-sm cursor-pointer"
                      key={index}
                    >
                      <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                        <p>
                          Branch{" "}
                          <span className="font-medium px-3 rounded-full bg-c-primary text-f-light">
                            {deepStrictEqual.bName}
                          </span>
                        </p>
                        <p>{deepStrictEqual.date}</p>
                      </section>
                      <section className="flex justify-between mb-4">
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
                      <section className="text-p-sm text-c-gray3 mb-4">
                        <p>Remarks</p>
                        <div className="border rounded-md p-2">
                          <p className="font-medium text-f-dark">
                            {deepStrictEqual.remarks}
                          </p>
                        </div>
                      </section>
                    </div>
                  ))}
                </div>
              </section>
              <section className="w-1/3 border-x border-f-gray px-5">
                <header className="w-full border-b border-f-gray pb-3 font-medium text-p-rg flex justify-between">
                  <h6>On Process</h6>
                  <div className="flex items-center justify-center px-6 h-6 rounded-full bg-blue-300 text-p-sm">
                    {sampleOnprocess.length}
                  </div>
                </header>
                <div className="py-5">
                  {sampleOnprocess.map((dets, index) => (
                    <div
                      className="w-full rounded-md p-4 bg-white mb-5 shadow-sm cursor-pointer"
                      key={index}
                    >
                      <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                        <p>
                          Branch{" "}
                          <span className="font-medium px-3 rounded-full bg-c-primary text-f-light">
                            {dets.bName}
                          </span>
                        </p>
                        <p>{dets.date}</p>
                      </section>
                      <section className="flex justify-between mb-4">
                        <article className="text-c-gray3 text-p-sm">
                          <p>Requested Product</p>
                          <p className="font-medium text-f-dark text-p-rg">
                            {dets.reqP}
                          </p>
                        </article>
                        <article className="text-c-gray3 text-p-sm">
                          <p>Quantity</p>
                          <p className="font-medium text-f-dark text-p-rg">
                            {dets.qty}
                          </p>
                        </article>
                      </section>
                      <section className="text-p-sm text-c-gray3 mb-4">
                        <p>Remarks</p>
                        <div className="border rounded-md p-2">
                          <p className="font-medium text-f-dark">
                            {dets.remarks}
                          </p>
                        </div>
                      </section>
                      <section className="text-p-sm text-c-gray3">
                        <p>Requested To</p>
                        <p className="font-medium text-f-dark text-p-rg">
                          {dets.bName} Branch
                        </p>
                      </section>
                    </div>
                  ))}
                </div>
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
            </>
          )}
          {selectType === "Branch Request" && (
            <>
              <div className="w-full">
                <header className="border-f-gray pb-3 font-medium text-p-rg flex gap-5">
                  <h6>Pending Request</h6>
                  <div className="flex items-center justify-center px-6 h-6 rounded-full bg-orange-300 text-p-sm">
                    0
                  </div>
                </header>
                <div className="py-5">
                  {sampleOnprocess.map((dets, index) => (
                    <div className="w-1/4">
                      <div
                        className="w-full rounded-md p-4 bg-white mb-3 shadow-sm cursor-pointer"
                        key={index}
                      >
                        <section className="flex justify-between text-c-gray3 text-p-sm pb-2 mb-2 border-b border-f-gray">
                          <p>
                            Branch{" "}
                            <span className="font-medium px-3 rounded-full bg-c-primary text-f-light">
                              {dets.bName}
                            </span>
                          </p>
                          <p>{dets.date}</p>
                        </section>
                        <section className="flex justify-between mb-4">
                          <article className="text-c-gray3 text-p-sm">
                            <p>Requested Product</p>
                            <p className="font-medium text-f-dark text-p-rg">
                              {dets.reqP}
                            </p>
                          </article>
                          <article className="text-c-gray3 text-p-sm">
                            <p>Quantity</p>
                            <p className="font-medium text-f-dark text-p-rg">
                              {dets.qty}
                            </p>
                          </article>
                        </section>
                        <section className="text-p-sm text-c-gray3 mb-4">
                          <p>Remarks</p>
                          <div className="border rounded-md p-2">
                            <p className="font-medium text-f-dark">
                              {dets.remarks}
                            </p>
                          </div>
                        </section>
                        <section className="text-p-sm text-c-gray3">
                          <p>Requested To</p>
                          <p className="font-medium text-f-dark text-p-rg">
                            {dets.bName} Branch
                          </p>
                        </section>
                      </div>
                      <div className="rounded-md w-full bg-white p-4 text-p-sm text-c-gray3 shadow-sm">
                        <p>Remark</p>
                        <textarea
                          type="text"
                          name=""
                          //   value={}
                          //   onChange={}
                          className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={2}
                          placeholder="Comemement"
                        />
                        <footer className="flex gap-4 mt-4 font-medium text-f-light justify-end">
                          <button className="rounded-full border shadow-sm hover:bg-sb-org px-6 py-1 text-f-dark">
                            Reject
                          </button>
                          <button className="rounded-full bg-bg-con  hover:bg-opacity-75 active:bg-pressed-branch px-6 py-1">
                            Approve
                          </button>
                        </footer>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferStockBranch;
