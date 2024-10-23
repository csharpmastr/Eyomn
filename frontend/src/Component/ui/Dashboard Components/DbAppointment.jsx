import React from "react";
import { useNavigate } from "react-router-dom";

const DbAppointment = () => {
  const appointmentDummyData = [
    { month: "Oct", day: "24", name: "John Doe", time: "4:15 PM" },
    { month: "Oct", day: "24", name: "Jane Smith", time: "3:30 PM" },
    { month: "Oct", day: "25", name: "Emily Johnson", time: "10:00 AM" },
    { month: "Oct", day: "25", name: "Michael Brown", time: "2:45 PM" },
    { month: "Oct", day: "26", name: "Sarah Wilson", time: "9:15 AM" },
    { month: "Oct", day: "26", name: "David Lee", time: "11:30 AM" },
    { month: "Oct", day: "27", name: "Sophia Martinez", time: "1:00 PM" },
    { month: "Oct", day: "27", name: "James Anderson", time: "5:00 PM" },
    { month: "Oct", day: "28", name: "Olivia Taylor", time: "3:00 PM" },
    { month: "Oct", day: "29", name: "Liam Thomas", time: "4:30 PM" },
  ];

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
    navigate(`/appointment`);
  };

  return (
    <div className="rounded-lg h-[500px] bg-white text-f-dark font-poppins bordertext-p-rg py-4 overflow-clip">
      <header className="flex justify-between px-4 items-center">
        <h1 className="font-medium text-nowrap">| Upcoming Appointment</h1>
        <button
          onClick={viewAll}
          className="px-2 py-1 border border-c-primary text-c-primary rounded-lg"
        >
          View All
        </button>
      </header>
      <section className="h-full overflow-y-scroll flex flex-col gap-4 px-4 mt-6 pb-12">
        {appointmentDummyData.map((data, index) => (
          <div
            className="rounded-md flex items-center justify-between bg-gray-100 p-3"
            key={index}
          >
            <section className="flex items-center gap-3">
              <h1
                className={`w-fit rounded-md text-center px-2 ${
                  dateColors[index % dateColors.length]
                }`}
              >
                {data.month}
                <br />
                {data.day}
              </h1>
              <p>{data.name}</p>
            </section>
            <p>{data.time}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DbAppointment;
