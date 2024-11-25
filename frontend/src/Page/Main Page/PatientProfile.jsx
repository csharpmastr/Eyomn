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
import AddEditPatient from "../../Component/ui/AddEditPatient";
import { FiEdit } from "react-icons/fi";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPatient, setCurrentPatient] = useState(null);
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  const handleOpenModal = () => setIsModalOpen(!isModalOpen);

  const handleBack = () => {
    navigate("/patient", { state: { resetSelected: true } });
    sessionStorage.removeItem("currentPatient");
    sessionStorage.removeItem("currentPath");
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
        const existingVisits = visitsStore.filter(
          (visit) => visit.patientId === currentPatient.patientId
        );

        if (existingVisits.length > 0) {
          setVisits(existingVisits);
        } else {
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
        }
      } catch (error) {
        console.error("Error fetching patient visit data:", error);
      }
    };

    if (currentPatient?.patientId && accessToken && refreshToken) {
      fetchPatientVisit();
    }
  }, [currentPatient, accessToken, refreshToken, reduxDispatch, visitsStore]);

  return (
    <div className="w-full h-full p-4 md:p-6 2xl:p-8">
      <div className="flex items-end justify-between mb-6">
        <div className="flex gap-3 items-center w-fit">
          <div
            className="flex gap-1 items-center text-c-primary"
            onClick={handleBack}
          >
            <AiOutlineArrowLeft className="h-4 w-5" />
            <button className="text-p-sm md:text-p-rg">Patient List</button>
          </div>
          <p className="text-h-h4 flex items-center gap-3 text-f-gray2">
            &gt;
            <span className="text-p-sm md:text-p-rg">
              {currentPatient?.first_name}
            </span>
          </p>
        </div>
        {role !== "0" && (
          <button
            className="flex px-6 py-3 bg-c-branch rounded-md text-f-light gap-3 items-center"
            onClick={handleOpenModal}
          >
            <FiEdit className="h-5 w-5" />
            <p className="font-medium text-p-sm md:text-p-rg">Edit</p>
          </button>
        )}
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
      {isModalOpen && (
        <AddEditPatient
          patient={currentPatient}
          onClose={handleOpenModal}
          title={"Edit Patient Information"}
        />
      )}
    </div>
  );
};

export default PatientProfile;
