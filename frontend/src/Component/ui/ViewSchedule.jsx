import dayjs from "dayjs";
import React from "react";
import ReactDOM from "react-dom";
import { FiClock } from "react-icons/fi";

const ViewSchedule = ({ onClose, appointments }) => {
  const borderColors = [
    "border-l-blue-300",
    "border-l-red-300",
    "border-l-green-300",
    "border-l-yellow-300",
    "border-l-purple-300",
    "border-l-cyan-300",
    "border-l-orange-300",
    "border-l-pink-300",
    "border-l-violet-300",
  ];

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[380px] h-[480px] md:w-[500px] md:h-[600px]">
        <header className="px-4 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-rg md:text-p-lg text-c-secondary font-semibold">
            Appointment Schedules
          </h1>
          <button onClick={onClose}> &times; </button>
        </header>
        <div className="bg-bg-mc h-full rounded-b-lg text-f-dark flex flex-col px-2 py-4">
          <div className="overflow-y-auto h-full flex flex-col gap-4">
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <div
                  key={index}
                  className={`w-full border-l-8 px-4 py-6 bg-white shadow-sm rounded-md ${
                    borderColors[index % borderColors.length]
                  }`}
                >
                  <div className="flex justify-between text-p-sm md:text-p-rg mb-2">
                    <p>{appointment.patient_name}</p>
                    <p>Dr. {appointment.doctor}</p>
                  </div>
                  <div className="flex items-center gap-1 justify-between">
                    <p className="text-p-sc md:text-p-sm text-c-gray3">
                      {appointment.reason}
                    </p>
                    <div className="flex gap-2">
                      <FiClock className="h-4 w-4 text-c-gray3" />
                      <p className="text-p-sc md:text-p-sm text-c-gray3">
                        {dayjs(appointment.scheduledTime).format("h:mm A")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex justify-center items-center">
                <p className="text-center">No appointments for this day.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewSchedule;
