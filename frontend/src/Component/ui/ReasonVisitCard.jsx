import React from "react";
import { useSelector } from "react-redux";
import { FiClock } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";

const ReasonVisitCard = ({ reasonData }) => {
  const doctors = useSelector((state) => state.reducer.doctor.doctor);

  const doctor = doctors.find((doc) => doc.staffId === reasonData.doctorId);

  const getDateAndTime = (timestamp) => {
    const dateObj = new Date(timestamp);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const { date, time } = getDateAndTime(reasonData.date);

  return (
    <div className="">
      <div>
        <article className="w-full py-4 px-4  bg-bg-sb rounded-md">
          <div className="flex justify-between">
            <div className="ml-2 px-4 py-4 h-full bg-white rounded-full border border-c-primary text-p-rg text-c-primary">
              {reasonData.reason_visit}
            </div>
            <section className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <FiCalendar className="h-6 w-6 md:mr-2 text-c-gray3" />
                <p className="text-p-sm text-f-dark">{date}</p>
              </div>
              <div className="flex items-center gap-1">
                <FiClock className="h-6 w-6 md:mr-2 text-c-gray3" />
                <p className="text-p-sm text-f-dark">{time}</p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ReasonVisitCard;
