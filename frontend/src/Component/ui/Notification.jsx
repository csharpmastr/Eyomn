import React from "react";

const Notification = ({ data }) => {
  function timeAgo(notificationTime) {
    const notificationDate = new Date(notificationTime);
    const currentDate = new Date();

    const diffInMilliseconds = currentDate - notificationDate;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    let timeAgo;
    if (diffInSeconds < 60) {
      timeAgo = "Just now";
    } else if (diffInMinutes < 60) {
      timeAgo = `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      timeAgo = `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else {
      timeAgo = `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }

    return timeAgo;
  }

  const sortedData = [...data].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="origin-top-right mt-2 absolute left-0 w-full z-50 rounded-md shadow-lg ring-1 ring-f-gray font-Poppins">
      <div>
        <header className="border-b border-f-gray bg-bg-sb p-4 flex justify-between items-center">
          <h1 className="text-p-rg font-semibold text-c-secondary">
            Notification
          </h1>
          <button className="text-p-sm">expand</button>
        </header>
        <div className="bg-white flex flex-col gap-4 p-4 h-[300px] overflow-y-scroll cursor-pointer">
          {sortedData.map((notifData, index) => (
            <section
              className={`text-p-rg text-f-dark rounded-md p-4
                 ${index % 2 === 0 ? "bg-bg-mc" : "bg-white"}`}
              key={index}
            >
              <h1>
                <span className="font-semibold">{notifData.message}</span>
              </h1>
              <p className="text-p-sm text-f-gray2 mt-3">
                {timeAgo(notifData.createdAt)}
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
