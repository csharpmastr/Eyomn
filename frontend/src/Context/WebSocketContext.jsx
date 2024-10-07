import React, { createContext, useContext, useRef, useEffect } from "react";
import { addPatient } from "../Slice/PatientSlice";
import { useDispatch, useSelector } from "react-redux";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const reduxDispatch = useDispatch();
  const role = useSelector((state) => state.reducer.user.user.role);
  const organizationId = useSelector(
    (state) => state.reducer.user.user.organizationId
  );
  const branchId = useSelector((state) => state.reducer.user.user.branchId);
  const doctorId = useSelector((state) => state.reducer.user.user.userId);
  const patients = useSelector((state) => state.reducer.patient.patients || []);

  const existingPatientIds = useRef(
    Array.isArray(patients)
      ? new Set(patients.map((patient) => patient.patientId))
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
    if (role !== "2") {
      return;
    }

    ws.current = new WebSocket(
      `ws://localhost:8080/${organizationId}/${branchId}/${doctorId}`
    );

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const updatedPatient = JSON.parse(event.data);

      if (!existingPatientIds.current.has(updatedPatient.patientId)) {
        reduxDispatch(addPatient(updatedPatient));
      } else {
        console.log(
          `Patient with ID ${updatedPatient.patientId} already exists.`
        );
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
