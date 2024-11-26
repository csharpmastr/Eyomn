import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationContent from "../../Component/ui/NotificationContent";
import { updateNotification } from "../../Service/NotificationService";
import { useDispatch, useSelector } from "react-redux";
import { updateNotificationRead } from "../../Slice/NotificationSlice";
import { setMedicalScribeNotes, setRawNotes } from "../../Slice/NoteSlice";
import { getPatientNotes } from "../../Service/PatientService";
import Cookies from "universal-cookie";

const Notification = ({ data, setNotifOpen }) => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.reducer.user.user);
  const rawNotes = useSelector((state) => state.reducer.note.rawNotes);
  const medicalScribeNotes = useSelector(
    (state) => state.reducer.note.medicalScribeNotes
  );
  const handleClickNotification = async (patientId, notificationId) => {
    try {
      setNotifOpen(false);

      // Set session storage values
      sessionStorage.setItem("currentPath", `/scribe/${patientId}`);
      sessionStorage.setItem("currentPatientId", patientId);
      sessionStorage.setItem("selectedTab", "scribe");

      navigate(`/scribe/${patientId}`);

      const responseNotif = await updateNotification(
        user.staffId,
        notificationId,
        user.firebaseUid
      );

      if (responseNotif) {
        reduxDispatch(updateNotificationRead({ notificationId }));
        console.log("Notification Updated");
      }
    } catch (error) {
      console.log("Error handling notification:", error);
    }
  };

  const handleViewFull = () => {
    setNotifOpen(false);
    navigate(`/notification`);
  };

  return (
    <div className="origin-top-right mt-2 absolute left-0 w-full z-50 rounded-md shadow-lg ring-1 ring-f-gray font-Poppins">
      <header className="border-b border-f-gray bg-bg-sb p-4 flex justify-between items-center">
        <h1 className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
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
          className="text-p-sm md:text-p-rg font-medium flex justify-between w-full"
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
