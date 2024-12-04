import React from "react";
import { useSelector } from "react-redux";
import { FiClock } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";

const ReasonVisitCard = ({ reasonData }) => {
  const doctors = useSelector((state) => state.reducer.doctor.doctor);

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
    <div>
      <article className="w-full h-fit py-4 px-4  bg-bg-sb rounded-md shadow-sm border">
        <div className="flex justify-between">
          <div>
            <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
              Reason:
            </p>
            <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
              {reasonData.reason_visit}
            </p>
          </div>
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <FiCalendar className="h-4 w-4 text-c-gray3" />
              <p className="text-p-sc md:text-p-sm text-f-dark">{date}</p>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="h-4 w-4 text-c-gray3" />
              <p className="text-p-sc md:text-p-sm text-f-dark">{time}</p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export default ReasonVisitCard;
