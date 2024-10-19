import React from "react";

const VisitReasonModal = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[600px]">
        <header className="px-4 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-lg text-c-secondary font-semibold">
            Add Branch
          </h1>
          <button onClick={onClose}> &times; </button>
        </header>
        <div className="py-6 px-6 h-fit bg-white">
          <label htmlFor="reason_visit" className="text-p-sm">
            Reason for Visit
            {/* {" "}
            <span className="text-red-400">
              {(formData.reason_visit === "" || errors.reason_visit) &&
                errors.reason_visit}
            </span> */}
          </label>
          <select
            name="reason_visit"
            // value={formData.reason_visit}
            // onChange={handleChange}
            className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
          >
            <option value="" disabled className="text-c-gray3">
              Select Reason
            </option>
            <option value="check up">Check Up</option>
            <option value="consulation">Consultation</option>
            <option value="eye glass">Eye Glass</option>
          </select>
          <div className="mt-3 text-c-gray3">
            <label htmlFor="doctorId" className="text-p-sm">
              Attending Doctor
            </label>
            <select
              name="doctorId"
              //   value={selectedDoctor?.staffId || ""}
              //   onChange={handleDoctorChange}
              className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
            >
              <option value="" disabled>
                Select Doctor
              </option>
              <option value="-">-</option>
              <option value="-">-</option>
              <option value="-">-</option>
            </select>
          </div>
        </div>
        <footer className="border border-t-f-gray bg-white rounded-b-lg flex gap-2 justify-end py-5 px-4">
          <button
            className="w-28 py-3 text-f-dark text-p-rg font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="w-28 py-3 bg-[#3B7CF9] text-f-light text-p-rg font-semibold rounded-md hover:bg-[#77a0ec] active:bg-bg-[#2c4c86]">
            Save
          </button>
        </footer>
      </div>
    </div>
  );
};

export default VisitReasonModal;
