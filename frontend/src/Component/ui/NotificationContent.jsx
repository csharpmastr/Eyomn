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
          className={`text-p-sm md:text-p-rg  rounded-md p-4 ${
            index % 2 === 0 ? "bg-bg-mc" : "bg-white"
          } 
          ${notifData.read === true ? "text-gray-400" : "text-f-dark"}`}
          key={index}
          onClick={() =>
            onClickNotification(notifData.patientId, notifData.notificationId)
          }
        >
          <div className="flex flex-row justify-between">
            <div>
              <h1>
                <span className="font-semibold">{notifData.message}</span>
              </h1>
              <div className="flex justify-between items-center mt-3">
                <p className="text-p-sc md:text-p-sm text-f-gray2">
                  {timeAgo(notifData.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center mr-5">
              {notifData.read === false ? (
                <span className="p-[6px] bg-blue-400 h-fit rounded-full"></span>
              ) : (
                ""
              )}
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default NotificationContent;
