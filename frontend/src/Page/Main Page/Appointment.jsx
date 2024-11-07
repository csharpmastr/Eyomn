import React, { useState } from "react";
import dayjs from "dayjs";
import { FiPlus } from "react-icons/fi";
import SetAppointment from "../../Component/ui/SetAppointment";
import ViewSchedule from "../../Component/ui/ViewSchedule";
import { useSelector } from "react-redux";
import RoleColor from "../../assets/Util/RoleColor";

const Appointment = () => {
  const [isModalSetApp, setIsModalSetApp] = useState(false);
  const [isModalViewApp, setIsModalViewApp] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);

  const appointments = useSelector(
    (state) => state.reducer.appointment.appointment
  );

  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));
  const handlePrevMonth = () =>
    setCurrentDate(currentDate.subtract(1, "month"));

  const handleOpenViewApp = (day) => {
    setSelectedDayAppointments(getAppointmentsForDay(day));
    setIsModalViewApp(true);
  };
  const handleCloseViewApp = () => setIsModalViewApp(false);
  const handleOpenSetApp = () => setIsModalSetApp(true);
  const handleCloseSetApp = () => setIsModalSetApp(false);
  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf("month").day();

  const getAppointmentsForDay = (day) => {
    const dateToCheck = currentDate.date(day).format("YYYY-MM-DD");
    return appointments
      .filter(
        (appointment) =>
          dayjs(appointment.scheduledTime).format("YYYY-MM-DD") === dateToCheck
      )
      .sort((a, b) => dayjs(a.scheduledTime) - dayjs(b.scheduledTime));
  };

  // Function to generate a pastel color
  const getPastelColor = () => {
    const r = Math.floor(Math.random() * 128 + 127);
    const g = Math.floor(Math.random() * 128 + 127);
    const b = Math.floor(Math.random() * 128 + 127);
    return `rgb(${r}, ${g}, ${b})`;
  };

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
          className="aspect-square border border-c-gray3 p-4 relative bg-white flex font-Poppins cursor-pointer"
          onClick={() => handleOpenViewApp(i)} // Pass the day number here
        >
          <span className="absolute top-2 left-2 font-Poppins">{i}</span>

          {getAppointmentsForDay(i).length > 0 && (
            <div className="mt-2 text-sm text-gray-600 text-center w-full overflow-y-auto">
              <div className="overflow-hidden mt-2">
                {getAppointmentsForDay(i).map((appointment, index) => (
                  <div
                    key={index}
                    className="text-rg text-f-dark font-medium py-2 rounded-md mb-2"
                    style={{ backgroundColor: getPastelColor() }}
                  >
                    {dayjs(appointment.scheduledTime).format("h:mm A")}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  const { btnContentColor } = RoleColor();

  return (
    <div className="p-4 md:p-6 2xl:p-8 text-c-secondary text-p-rg font-Poppins">
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={handlePrevMonth}
            className="py-3 px-4 bg-f-light border border-c-gray3 rounded-md"
          >
            &lt;
          </button>
          <span className="mx-4 font-medium">
            {currentDate.format("MMMM YYYY")}
          </span>
          <button
            onClick={handleNextMonth}
            className="py-3 px-4 bg-f-light border border-c-gray3 rounded-md"
          >
            &gt;
          </button>
        </div>
        <div
          className={`ml-2 h-fit flex justify-center items-center rounded-md px-4 py-3 text-f-light font-md hover:cursor-pointer  ${btnContentColor} `}
          onClick={handleOpenSetApp}
        >
          <FiPlus className="h-5 w-5 md:mr-2" />
          <h1 className="md:block hidden">Set Appointment</h1>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center pt-3 md:pt-6 pb-3 font-medium bg-bg-sb border border-c-gray3 mt-4 md:mt-6 rounded-t-md">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="grid grid-cols-7">{renderDays()}</div>
      {isModalViewApp && (
        <ViewSchedule
          onClose={handleCloseViewApp}
          appointments={selectedDayAppointments}
        />
      )}
      {isModalSetApp && <SetAppointment onClose={handleCloseSetApp} />}
    </div>
  );
};

export default Appointment;
