import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPatient, setPatients } from "../Slice/PatientSlice";
import { addNotification, setNotifications } from "../Slice/NotificationSlice";

const BranchSSEComponent = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();
  useEffect(() => {
    if (!user || !user.userId) return;

    const stopSSE = starBranchSSE(user.userId);

    return () => {
      stopSSE();
    };
  }, [user]);

  function starBranchSSE(branchId) {
    const branchSSE = new EventSource(
      `http://localhost:3000/sse-branch/${branchId}`
    );

    branchSSE.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received branch update:", data);
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

    branchSSE.onerror = (error) => {
      console.error("Error in SSE connection:", error);
      branchSSE.close();
    };

    return () => {
      branchSSE.close();
    };
  }

  return null;
};

export default BranchSSEComponent;
