import React, { useEffect, useState } from "react";
import StaffViewPatientProfile from "../../Component/ui/StaffViewPatientProfile";
import DocViewPatientProfile from "../../Component/ui/DocViewPatientProfile";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { getPatientVisit } from "../../Service/PatientService";
import { useDispatch } from "react-redux";
import { addVisit } from "../../Slice/VisitSlice";

const PatientProfile = () => {
  const cookies = new Cookies();
  const [visits, setVisits] = useState([]);
  const accessToken = cookies.get("accessToken", { path: "/" });
  const refreshToken = cookies.get("refreshToken", { path: "/" });
  const role = useSelector((state) => state.reducer.user.user.role);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const visitsStore = useSelector((state) => state.reducer.visit.visits);
  const { patientId } = useParams();
  const [currentPatient, setCurrentPatient] = useState(null);
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  const handleBack = () => {
    navigate("/patient", { state: { resetSelected: true } });
    sessionStorage.removeItem("currentPatient");
  };

  useEffect(() => {
    if (patients.length > 0) {
      const patient = patients.find((p) => p.patientId === patientId);
      setCurrentPatient(patient);
    }
  }, [patients, patientId]);

  useEffect(() => {
    const fetchPatientVisit = async () => {
      try {
        const visitsRes = await getPatientVisit(
          currentPatient.patientId,
          accessToken,
          refreshToken
        );

        visitsRes.forEach((visit) => {
          const visitExists = visitsStore.some(
            (storedVisit) => storedVisit.visitId === visit.visitId
          );
          if (!visitExists && visit.visitId) {
            reduxDispatch(addVisit(visit));
          }
        });
        setVisits(visitsRes);
      } catch (error) {
        console.error("Error fetching patient visit data:", error);
      }
    };
    if (currentPatient?.patientId && accessToken && refreshToken) {
      fetchPatientVisit();
    }
  }, [currentPatient, accessToken, refreshToken, reduxDispatch]);

  return (
    <div className="w-full h-auto p-8">
      {currentPatient ? (
        role === "2" ? (
          <DocViewPatientProfile patient={currentPatient} visits={visits} />
        ) : (
          <StaffViewPatientProfile patient={currentPatient} visits={visits} />
        )
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default PatientProfile;
