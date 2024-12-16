import React from "react";

const RequestDetails = ({ onClose }) => {
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
          <section className="flex justify-between text-p-sm text-c-gray3 mb-4">
            <p>
              Branch{" "}
              <span className="font-medium px-3 rounded-full bg-c-primary text-f-light">
                Santa Cruz
              </span>
            </p>
            <p>Dec 04, 2024</p>
          </section>
          <section className="text-p-sm text-c-gray3 mb-4">
            <p>Requested Product</p>
            <p className="text-p-rg font-medium text-f-dark">
              Apple Cider (20 pcs)
            </p>
          </section>
          <section className="text-p-sm text-c-gray3 mb-4">
            <p>Remarks</p>
            <div className="border rounded-md p-2">
              <p className="font-medium text-f-dark">
                Yao Ming, an 8-time NBA All-Star. The Chinese basketball icon
                played for the Houston Rockets and was known for his dominant
                presence in the paint.
              </p>
            </div>
          </section>
          <section className="text-p-sm text-c-gray3">
            <p>Request To</p>
            {/*Ano nalang siguro lalabas list ng branch tapos kung ilan pa yung stock nila sa prd na nireq hahaha*/}
            <select
              name="branches"
              //value={}
              //onChange={}
              className="mt-1 w-full p-2 border rounded-md text-f-dark focus:outline-c-primary"
            >
              <option value="" disabled className="text-c-gray3">
                Select Branch
              </option>
              <option>Santa Maria (67pcs)</option>
              <option>Paete (257pcs)</option>
            </select>
          </section>
          <footer className="flex gap-4 mt-12 font-medium text-f-light justify-end">
            <button className="rounded-full border shadow-sm hover:bg-sb-org px-6 py-1 text-f-dark">
              Reject
            </button>
            <button className="rounded-full bg-bg-con  hover:bg-opacity-75 active:bg-pressed-branch px-6 py-1">
              Approve
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
