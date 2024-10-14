import React, { createContext, useContext, useRef, useEffect } from "react";
import { addPatient } from "../Slice/PatientSlice";
import { addNotification } from "../Slice/NotificationSlice";
import { useDispatch, useSelector } from "react-redux";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const reduxDispatch = useDispatch();

  // Fetch role, organizationId, branchId, doctorId from the store
  const role = useSelector((state) => state.reducer.user.user.role);
  const organizationId = useSelector(
    (state) => state.reducer.user.user.organizationId
  );
  const branchId = useSelector((state) => state.reducer.user.user.branchId);
  const doctorId = useSelector((state) => state.reducer.user.user.staffId);

  // Fetch existing patients and notifications from the store
  const patients = useSelector((state) => state.reducer.patient.patients || []);
  const notifications = useSelector(
    (state) => state.reducer.notification.notifications || []
  );

  // Track existing patient IDs
  const existingPatientIds = useRef(
    Array.isArray(patients)
      ? new Set(patients.map((patient) => patient.patientId))
      : new Set()
  );

  // Track existing notification IDs
  const existingNotificationIds = useRef(
    Array.isArray(notifications)
      ? new Set(
          notifications.map((notification) => notification.notificationId)
        ) // Assuming notification has an 'notificationId' field
      : new Set()
  );

  // Update existingPatientIds when patients change
  useEffect(() => {
    existingPatientIds.current = new Set(
      Array.isArray(patients)
        ? patients.map((patient) => patient.patientId)
        : []
    );
  }, [patients]);

  // Update existingNotificationIds when notifications change
  useEffect(() => {
    existingNotificationIds.current = new Set(
      Array.isArray(notifications)
        ? notifications.map((notification) => notification.notificationId)
        : []
    );
  }, [notifications]);

  useEffect(() => {
    if (role !== "2") {
      return;
    }

    const wsUrl = `ws://localhost:8080/${organizationId}/${branchId}/${doctorId}`;
    console.log(`Connecting to WebSocket at: ${wsUrl}`);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      console.log("Raw message received:", event.data);

      try {
        const message = JSON.parse(event.data);
        console.log("Parsed message:", message);

        if (message.type === "patient") {
          const updatedPatient = message.data;
          console.log("Patient data received:", updatedPatient);

          if (!existingPatientIds.current.has(updatedPatient.patientId)) {
            console.log("Dispatching addPatient:", updatedPatient);
            reduxDispatch(addPatient(updatedPatient));
          } else {
            console.log(
              `Patient with ID ${updatedPatient.patientId} already exists.`
            );
          }
        } else if (message.type === "notification") {
          const notificationData = message.data;
          console.log("Notification data received:", notificationData);

          // Check if notification already exists before dispatching
          if (
            !existingNotificationIds.current.has(
              notificationData.notificationId
            )
          ) {
            console.log("Dispatching addNotification:", notificationData);
            reduxDispatch(addNotification(notificationData));
          } else {
            console.log(
              `Notification with ID ${notificationData.notificationId} already exists.`
            );
          }
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [organizationId, branchId, doctorId, reduxDispatch, role]);

  return (
    <WebSocketContext.Provider value={ws.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
