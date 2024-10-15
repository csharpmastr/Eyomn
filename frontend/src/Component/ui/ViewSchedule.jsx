import dayjs from "dayjs";
import React from "react";
import ReactDOM from "react-dom";

const ViewSchedule = ({ onClose, appointments }) => {
  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[380px] h-[480px] md:w-[500px] md:h-[600px]">
        <header className="px-4 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-lg text-c-secondary font-semibold">
            Schedules
          </h1>
          <button onClick={onClose}> &times; </button>
        </header>
        <div className="py-10 bg-bg-mc h-full rounded-b-lg text-f-dark flex gap-4 flex-col overflow-y-auto">
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <div
                key={index}
                className="w-full border-l-[8px] border-l-blue-400 px-4 py-6 bg-white"
              >
                <div className="flex justify-between text-p-lg mb-2">
                  <p>{appointment.patient_name}</p>

                  <p>{appointment.doctor}</p>
                </div>
                <p className="text-p-rg text-f-gray2">
                  {dayjs(appointment.scheduledTime).format("h:mm A")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center">No appointments for this day.</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewSchedule;
