import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationContent from "../../Component/ui/NotificationContent";

const Notification = ({ data, setNotifOpen }) => {
  const navigate = useNavigate();

  const handleClickNotification = (patientId) => {
    setNotifOpen(false);
    sessionStorage.setItem("currentPatient", patientId);
    sessionStorage.setItem("selectedTab", "patient");
    navigate(`/patient/${patientId}`);
  };

  const handleViewFull = () => {
    setNotifOpen(false);
    navigate(`/notification`);
  };

  return (
    <div className="origin-top-right mt-2 absolute left-0 w-full z-50 rounded-md shadow-lg ring-1 ring-f-gray font-Poppins">
      <header className="border-b border-f-gray bg-bg-sb p-4 flex justify-between items-center">
        <h1 className="text-p-rg font-semibold text-c-secondary">
          Notification ({data.length})
        </h1>
      </header>
      <div className="bg-white flex flex-col gap-4 p-4 h-[300px] overflow-y-scroll cursor-pointer">
        <NotificationContent
          data={data}
          onClickNotification={handleClickNotification}
        />
      </div>
      <footer className="border-t border-f-gray bg-bg-sb p-4">
        <button
          className="text-p-rg font-medium flex justify-between w-full"
          onClick={handleViewFull}
        >
          <h1>See all notifications</h1>
          <h1>&gt;</h1>
        </button>
      </footer>
    </div>
  );
};

export default Notification;
