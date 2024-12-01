import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPatient } from "../Slice/PatientSlice";
import { addNotification } from "../Slice/NotificationSlice";
import { addPurchase, addServices } from "../Slice/InventorySlice";

const OrganizationSSEComponent = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();
  console.log("hello");

  useEffect(() => {
    if (!user || !user.userId) return;

    const stopSSE = startOrganizationSSE(user.role, user.userId);

    return () => {
      stopSSE();
    };
  }, [user]);

  function startOrganizationSSE(role, orgId) {
    const organiztionSSE = new EventSource(
      `http://localhost:3000/sse-org/${role}/${orgId}`
    );

    organiztionSSE.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.type === "purchases") {
          const salesData = data.data;
          reduxDispatch(addPurchase(salesData));
        }
        if (data.type === "services") {
          const servicesData = data.data;
          reduxDispatch(addServices(servicesData));
        }
      } catch (error) {
        console.error("Error processing SSE message:", error);
      }
    };

    organiztionSSE.onerror = (error) => {
      console.error("Error in SSE connection:", error);
      organiztionSSE.close();
    };

    return () => {
      organiztionSSE.close();
    };
  }

  return null;
};

export default OrganizationSSEComponent;
