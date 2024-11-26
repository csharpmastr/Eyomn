import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPatient } from "../Slice/PatientSlice";
import { addNotification } from "../Slice/NotificationSlice";

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
      `http://localhost:3000/sse/${role}/${doctorId}`
    );

    doctorSSE.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received doctor update:", data);
        if (data.type === "patient") {
          const patientData = data.data[0];
          reduxDispatch(addPatient(patientData));
        }
        if (data.type === "notification") {
          const notificationData = data.data[0];
          reduxDispatch(addNotification(notificationData));
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
