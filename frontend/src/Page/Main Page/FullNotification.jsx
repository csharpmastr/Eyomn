import React from "react";
import { useSelector } from "react-redux";
import NotificationContent from "../../Component/ui/NotificationContent";
import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";

const FullNotification = () => {
  const navigate = useNavigate();

  const notification = useSelector(
    (state) => state.reducer.notification.notifications
  );

  const handleClickNotification = (patientId) => {
    sessionStorage.setItem("currentPatient", patientId);
    sessionStorage.setItem("selectedTab", "patient");
    navigate(`/patient/${patientId}`);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 gap-4 md:p-0 md:py-8 flex-col md:gap-6 font-Poppins">
      <div className="p-8 rounded-lg w-full md:w-2/3 bg-white shadow-sm text-p-rg md:text-p-lg font-semibold text-f-dark flex items-center gap-4">
        <FiBell className="w-8 h-8" />
        <h1>All Notification ({notification.length})</h1>
      </div>
      <div className="w-full md:w-2/3 h-full overflow-auto">
        <section className="flex flex-col gap-6 p-8 bg-white rounded-lg shadow-sm">
          <NotificationContent
            data={notification}
            onClickNotification={handleClickNotification}
          />
        </section>
      </div>
    </div>
  );
};

export default FullNotification;
