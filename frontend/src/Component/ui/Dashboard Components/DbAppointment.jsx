import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../../Hooks/useFetchData";
import { FiArrowRight } from "react-icons/fi";

const DbAppointment = () => {
  const { loading } = useFetchData();
  const appointments = useSelector(
    (state) => state.reducer.appointment.appointment
  );

  const currentDate = new Date();

  const sortedAppointments = [...appointments]
    .filter((appointment) => new Date(appointment.scheduledTime) > currentDate)
    .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));

  const dateColors = [
    "bg-fuchsia-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-orange-200",
    "bg-red-200",
    "bg-purple-200",
    "bg-teal-200",
    "bg-pink-200",
    "bg-indigo-200",
  ];

  const navigate = useNavigate();

  const viewAll = () => {
    sessionStorage.setItem("selectedTab", "appointment");
    navigate(`/appointment`);
  };

  return (
    <div className="rounded-lg h-[360px] bg-white text-f-dark font-poppins border text-p-sm md:text-p-rg py-4 overflow-clip shadow-sm">
      <header className="flex justify-between px-4 items-center text-c-secondary">
        <h1 className="font-medium text-nowrap">| Upcoming Appointment</h1>
        <button
          onClick={viewAll}
          className="flex items-center gap-1 font-medium text-p-sm hover:font-semibold"
        >
          View all <FiArrowRight />
        </button>
      </header>
      <section className="h-full overflow-y-scroll flex flex-col gap-4 px-4 mt-6 pb-12">
        {loading ? (
          <p className="text-center text-gray-500">Loading appointments...</p>
        ) : sortedAppointments.length > 0 ? (
          sortedAppointments.map((appointment, index) => {
            const date = new Date(appointment.scheduledTime);
            const month = date.toLocaleString("default", { month: "short" });
            const day = date.getDate();
            const time = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                className="rounded-md flex items-center justify-between bg-gray-100 p-3"
                key={appointment.id}
              >
                <section className="flex items-center gap-3">
                  <h1
                    className={`w-fit rounded-md text-center px-2 shadow-sm ${
                      dateColors[index % dateColors.length]
                    }`}
                  >
                    {month}
                    <br />
                    {day}
                  </h1>
                  <p>{appointment.patient_name}</p>
                </section>
                <p>{time}</p>
              </div>
            );
          })
        ) : (
          <div className="h-full flex justify-center items-center">
            <p className="text-center text-f-gray2">
              No upcoming appointments.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DbAppointment;
