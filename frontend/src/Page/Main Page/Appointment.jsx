import React, { useState } from "react";
import dayjs from "dayjs";
import { IoIosAddCircleOutline } from "react-icons/io";
import SetAppointment from "../../Component/ui/SetAppointment";
import ViewSchedule from "../../Component/ui/ViewSchedule";

const Appointment = () => {
  const [isModalSetApp, setIsModalSetApp] = useState(false);
  const [isModalViewApp, setIsModalViewApp] = useState(false);

  const handleOpenSetApp = () => {
    setIsModalSetApp(true);
  };

  const handleCloseSetApp = () => {
    setIsModalSetApp(false);
  };

  const handleOpenViewApp = () => {
    setIsModalViewApp(true);
  };

  const handleCloseViewApp = () => {
    setIsModalViewApp(false);
  };

  const [currentDate, setCurrentDate] = useState(dayjs());

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf("month").day();

  const handlePrevMonth = () =>
    setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="aspect-square border border-c-gray3 p-2"
        />
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div
          key={i}
          className="aspect-square border border-c-gray3 p-4 relative bg-white flex justify-end"
          onClick={handleOpenViewApp}
        >
          <span>{i}</span>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="p-8 text-c-secondary text-p-rg font-Poppins">
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={handlePrevMonth}
            className="p-2 w-10 bg-white border border-c-gray3 rounded"
          >
            {"<"}
          </button>
          <span className="mx-4 font-semibold">
            {currentDate.format("MMMM YYYY")}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 w-10 bg-white border border-c-gray3 rounded"
          >
            {">"}
          </button>
        </div>
        <div
          className="ml-2 h-auto flex justify-center items-center rounded-md px-4 py-3 font-Poppins bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
          onClick={handleOpenSetApp}
        >
          <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
          <h1 className="hidden md:block">Set Appointment</h1>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center pt-6 pb-3 font-medium bg-bg-sb border border-c-gray3 mt-8 rounded-t-md">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="grid grid-cols-7">{renderDays()}</div>
      {isModalViewApp && <ViewSchedule onClose={handleCloseViewApp} />}
      {isModalSetApp && <SetAppointment onClose={handleCloseSetApp} />}
    </div>
  );
};

export default Appointment;
