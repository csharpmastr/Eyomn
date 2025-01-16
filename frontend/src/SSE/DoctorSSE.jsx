import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPatient, setPatients } from "../Slice/PatientSlice";
import { addNotification, setNotifications } from "../Slice/NotificationSlice";

const DoctorSSEComponent = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();
  useEffect(() => {
    if (!user || !user.staffId) return;

    const stopSSE = startDoctorSSE(user.role, user.staffId);

    return () => {
      stopSSE();
    };
  }, [user]);

  function startDoctorSSE(role, doctorId) {
    const doctorSSE = new EventSource(
      `http://localhost:3000/sse-doctor/${role}/${doctorId}`
    );

    doctorSSE.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received doctor update:", data);
        if (data.type === "patient") {
          const patientData = data.data;
          patientData.forEach((patient) => {
            reduxDispatch(addPatient(patient));
          });
        }
        if (data.type === "notification") {
          const notificationData = data.data;
          notificationData.forEach((notification) => {
            reduxDispatch(addNotification(notification));
          });
        }
      } catch (error) {
        console.error("Error processing SSE message:", error);
      }
    };

    doctorSSE.onerror = (error) => {
      console.error("Error in SSE connection:", error);
      doctorSSE.close();
    };

    return () => {
      doctorSSE.close();
    };
  }

  return null;
};

export default DoctorSSEComponent;
