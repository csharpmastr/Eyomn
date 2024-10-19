import React, { useEffect, useState } from "react";
import StaffViewPatientProfile from "../../Component/ui/StaffViewPatientProfile";
import DocViewPatientProfile from "../../Component/ui/DocViewPatientProfile";
import { AiOutlineArrowLeft } from "react-icons/ai";
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
  const user = useSelector((state) => state.reducer.user.user);
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
          refreshToken,
          user.firebaseUid
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
    <div className="w-full h-fit p-6">
      <div className="flex gap-2 items-center mb-6">
        <AiOutlineArrowLeft />
        <button className="text-p-rg font-medium" onClick={handleBack}>
          Back
        </button>
      </div>
      {currentPatient ? (
        role === "2" ? (
          <DocViewPatientProfile patient={currentPatient} visits={visits} />
        ) : (
          <StaffViewPatientProfile patient={currentPatient} visits={visits} />
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PatientProfile;
