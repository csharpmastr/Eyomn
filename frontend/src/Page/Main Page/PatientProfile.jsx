import React, { useEffect, useState } from "react";
import StaffViewPatientProfile from "../../Component/ui/StaffViewPatientProfile";
import DocViewPatientProfile from "../../Component/ui/DocViewPatientProfile";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const PatientProfile = () => {
  const role = useSelector((state) => state.reducer.user.user.role);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const { patientId } = useParams();
  const [currentPatient, setCurrentPatient] = useState(null);
  const navigate = useNavigate();
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

  return (
    <div className="w-full h-auto p-8">
      {currentPatient ? (
        role === "2" ? (
          <DocViewPatientProfile patient={currentPatient} />
        ) : (
          <StaffViewPatientProfile patient={currentPatient} />
        )
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default PatientProfile;
