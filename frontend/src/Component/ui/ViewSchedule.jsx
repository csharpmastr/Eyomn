import React from "react";
import ReactDOM from "react-dom";

const ViewSchedule = ({ onClose }) => {
  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[500px] h-[600px]">
        <header className="px-4 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-lg text-c-secondary font-semibold">
            Set Appointment
          </h1>
          <button onClick={onClose}> &times; </button>
        </header>
        <div className="py-10 bg-bg-mc h-full rounded-b-lg text-f-dark flex gap-4 flex-col">
          <div className="w-full border-l-[8px] border-l-red-400 px-4 py-6 bg-white">
            <div className="flex justify-between text-p-lg mb-2">
              <p>Patients Name</p>
              <p>Doctors Name</p>
            </div>
            <p className="text-p-rg text-f-gray2">Time</p>
          </div>
          <div className="w-full border-l-[8px] border-l-blue-400 px-4 py-6 bg-white">
            <div className="flex justify-between text-p-lg mb-2">
              <p>Patients Name</p>
              <p>Doctors Name</p>
            </div>
            <p className="text-p-rg text-f-gray2">Time</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewSchedule;
