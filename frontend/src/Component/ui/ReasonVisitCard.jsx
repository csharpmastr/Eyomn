import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

const ReasonVisitCard = ({ doc_name, staff, reason, data, time }) => {
  return (
    <div className="w-full h-full p-5 bg-white rounded-lg font-poppins">
      <header className="flex w-full h-auto mb-5 justify-between">
        <h1 className="text-p-rg font-medium text-c-gray3">Reason for Visit</h1>
        <button>
          <IoIosAddCircleOutline className="h-6 w-6 md:mr-2 text-c-gray3]" />
        </button>
      </header>
      <body>
        <article className="w-full p-3 bg-bg-mc rounded-md">
          <header className="flex justify-between mb-5">
            <section>
              <p className="text-p-rg text-f-dark">{doc_name}</p>
              <p className="text-p-rg text-c-gray3">{staff}</p>
            </section>
            <div className="px-2 py-1 h-fit bg-bg-sb rounded-md border border-c-primary text-p-sm text-c-primary">
              {reason}
            </div>
          </header>
          <section className="flex">
            <div className="flex items-center gap-1 mr-8">
              <IoIosAddCircleOutline className="h-6 w-6 md:mr-2 text-[#696969]" />
              <p className="text-p-sm text-f-dark">{data}</p>
            </div>
            <div className="flex items-center gap-1">
              <IoIosAddCircleOutline className="h-6 w-6 md:mr-2 text-[#696969]" />
              <p className="text-p-sm text-f-dark">{time}</p>
            </div>
          </section>
        </article>
      </body>
    </div>
  );
};

export default ReasonVisitCard;
