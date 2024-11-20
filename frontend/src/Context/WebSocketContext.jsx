import React, { createContext, useContext, useRef, useEffect } from "react";
import { addPatient } from "../Slice/PatientSlice";
import { addNotification } from "../Slice/NotificationSlice";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const user = useSelector((state) => state.reducer.user.user);
  const cookies = new Cookies();
  const ws = useRef(null);
  const reduxDispatch = useDispatch();
  const accessToken = cookies.get("accessToken");
  const role = useSelector((state) => state.reducer.user.user.role);
  const organizationId = useSelector(
    (state) => state.reducer.user.user.organizationId
  );
  let branchId =
    (user.branches && user.branches.length > 0 && user.branches[0].branchId) ||
    user.userId ||
    null;
  const doctorId = useSelector((state) => state.reducer.user.user.staffId);

  const patients = useSelector((state) => state.reducer.patient.patients || []);
  const notifications = useSelector(
    (state) => state.reducer.notification.notifications || []
  );

  const existingPatientIds = useRef(
    Array.isArray(patients)
      ? new Set(patients.map((patient) => patient.patientId))
      : new Set()
  );

  const existingNotificationIds = useRef(
    Array.isArray(notifications)
      ? new Set(
          notifications.map((notification) => notification.notificationId)
        )
      : new Set()
  );

  useEffect(() => {
    existingPatientIds.current = new Set(
      Array.isArray(patients)
        ? patients.map((patient) => patient.patientId)
        : []
    );
  }, [patients]);

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

    const wsUrl = `wss://api.eyomn.com:3000/${organizationId}/${branchId}/${doctorId}/?token=${accessToken}`;

    const socket = new WebSocket(wsUrl);
    ws.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "patient") {
          const updatedPatient = message.data;

          if (!existingPatientIds.current.has(updatedPatient.patientId)) {
            reduxDispatch(addPatient(updatedPatient));
          }
        } else if (message.type === "notification") {
          const notificationData = message.data;

          if (
            !existingNotificationIds.current.has(
              notificationData.notificationId
            )
          ) {
            reduxDispatch(addNotification(notificationData));
          }
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    // socket.onclose = () => {
    //   console.log("WebSocket connection closed. Attempting to reconnect...");

    //   setTimeout(() => {
    //     ws.current = new WebSocket(wsUrl);
    //   }, 3000);
    // };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [organizationId, branchId, doctorId, reduxDispatch, role, accessToken]);

  return (
    <WebSocketContext.Provider value={ws.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
