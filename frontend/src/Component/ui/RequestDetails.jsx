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
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
