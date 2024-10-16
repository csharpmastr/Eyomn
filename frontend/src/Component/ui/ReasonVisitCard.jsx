import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";

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
        <article className="w-full p-3 bg-bg-mc rounded-md">
          <header className="flex justify-between mb-5">
            <section>
              <p className="text-p-rg text-f-dark">
                {doctor ? doctor.first_name + " " + doctor.last_name : ""}
              </p>
              {doctor ? (
                <p className="text-p-rg text-c-gray3">{doctor.position}</p>
              ) : (
                ""
              )}
            </section>
            <div className="px-2 py-1 h-fit bg-bg-sb rounded-md border border-c-primary text-p-sm text-c-primary">
              {reasonData.reason_visit}
            </div>
          </header>
          <section className="flex">
            <div className="flex items-center gap-1 mr-8">
              <IoIosAddCircleOutline className="h-6 w-6 md:mr-2 text-[#696969]" />
              <p className="text-p-sm text-f-dark">{date}</p>
            </div>
            <div className="flex items-center gap-1">
              <IoIosAddCircleOutline className="h-6 w-6 md:mr-2 text-[#696969]" />
              <p className="text-p-sm text-f-dark">{time}</p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default ReasonVisitCard;
