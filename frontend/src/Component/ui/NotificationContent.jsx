import React from "react";

const NotificationContent = ({ data, onClickNotification }) => {
  function timeAgo(notificationTime) {
    const notificationDate = new Date(notificationTime);
    const currentDate = new Date();
    const diffInMilliseconds = currentDate - notificationDate;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  const sortedData = [...data].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      {sortedData.map((notifData, index) => (
        <section
          className={`text-p-rg text-f-dark rounded-md p-4 ${
            index % 2 === 0 ? "bg-bg-mc" : "bg-white"
          }`}
          key={index}
          onClick={() =>
            onClickNotification(notifData.patientId, notifData.read)
          }
        >
          <h1>
            <span className="font-semibold">{notifData.message}</span>
          </h1>
          <div className="flex justify-between items-center mt-3">
            <p className="text-p-sm text-f-gray2">
              {timeAgo(notifData.createdAt)}
            </p>
            {notifData.read === false ? (
              <span className="p-[6px] bg-blue-400 h-fit rounded-full"></span>
            ) : (
              ""
            )}
          </div>
        </section>
      ))}
    </>
  );
};

export default NotificationContent;
