import React, { createContext, useContext, useRef, useEffect } from "react";
import { addPatient } from "../Slice/PatientSlice";
import { useDispatch, useSelector } from "react-redux";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const reduxDispatch = useDispatch();
  const role = useSelector((state) => state.reducer.user.user.role);
  const clinicId = useSelector((state) => state.reducer.user.user.clinicId);
  const doctorId = useSelector((state) => state.reducer.user.user.userId);
  const patients = useSelector((state) => state.reducer.patient.patients);

  useEffect(() => {
    if (role !== "1") {
      return;
    }

    ws.current = new WebSocket(`ws://localhost:8080/${clinicId}/${doctorId}`);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      ws.current.send(JSON.stringify({ clinicId, doctorId }));
    };
    ws.current.onmessage = (event) => {
      const updatedPatients = JSON.parse(event.data);

      reduxDispatch(addPatient(updatedPatients));
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
  }, [clinicId, doctorId, reduxDispatch]);

  return (
    <WebSocketContext.Provider value={ws.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
