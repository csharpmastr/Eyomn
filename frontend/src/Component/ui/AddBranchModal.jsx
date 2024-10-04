import React from "react";
import ReactDOM from "react-dom";

const AddBranchModal = ({ onClose }) => {
  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50">
      <div className="w-[500px]">
        <header className="px-4 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-lg text-c-secondary font-semibold">
            Add Branch
          </h1>
          <button onClick={onClose}> &times; </button>
        </header>
        <div className="py-10 px-6 bg-white">
          <input
            type="text"
            className="w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
            placeholder="Enter branch name"
          />
        </div>
        <footer className="border border-t-f-gray bg-white rounded-b-lg flex gap-2 justify-end py-6 px-4">
          <button
            className="w-28 h-12 text-f-dark text-p-rg font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="w-28 h-12 bg-[#3B7CF9] text-f-light text-p-rg font-semibold rounded-md hover:bg-[#77a0ec] active:bg-bg-[#2c4c86]">
            Save
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default AddBranchModal;
