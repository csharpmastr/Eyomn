import React from "react";

const Notification = ({ data }) => {
  return (
    <div className="origin-top-right mt-2 absolute left-0 w-full rounded-md shadow-lg ring-1 ring-f-gray font-Poppins">
      <div>
        <header className="border-b border-f-gray bg-bg-sb p-4 flex justify-between items-center">
          <h1 className="text-p-rg font-semibold text-c-secondary">
            Notification
          </h1>
          <button className="text-p-sm">expand</button>
        </header>
        <div className="bg-white flex flex-col gap-4 p-4 h-[300px] overflow-y-scroll">
          {data.map((notifData, index) => (
            <section
              className={`text-p-rg text-f-dark rounded-md p-4
                 ${index % 2 === 0 ? "bg-bg-mc" : "bg-white"}`}
              key={index}
            >
              <h1>
                <span className="font-semibold">{notifData.name}</span>{" "}
                {notifData.reason}
              </h1>
              <p className="text-p-sm text-f-gray2 mt-3">
                {notifData.timedate}
              </p>
            </section>
          ))}
        </div>
        <footer className="border-t border-f-gray bg-bg-sb p-4">
          <h1 className="text-p-rg font-medium text-c-secondary">
            Mark all as read
          </h1>
        </footer>
      </div>
    </div>
  );
};

export default Notification;
