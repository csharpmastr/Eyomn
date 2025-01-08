import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addVisitService } from "../../Service/PatientService";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";
import { addVisit } from "../../Slice/VisitSlice";

const VisitReasonModal = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const doctors = useSelector((state) => state.reducer.doctor.doctor);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const reduxDispatch = useDispatch();
  const [visitData, setVisitData] = useState({
    reason_visit: "",
  });

  const { patientId } = useParams();
  const currentPatient = useSelector((state) =>
    state.reducer.patient.patients?.find(
      (patient) => patient.patientId === patientId
    )
  );

  const patientDoc = currentPatient.flatMap;
  const user = useSelector((state) => state.reducer.user.user);
  const firebaseUid = user.firebaseUid;
  let branchId =
    (user.branches && user.branches.length > 0 && user.branches[0].branchId) ||
    user.userId ||
    null;

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleReasonChange = (e) => {
    setVisitData({ ...visitData, reason_visit: e.target.value });
  };

  const handleAddVisit = async () => {
    console.log({ reason_visit: visitData.reason_visit });

    setIsLoading(true);
    try {
      const response = await addVisitService(
        { reason_visit: visitData.reason_visit },
        patientId,
        selectedDoctor,
        branchId,
        firebaseUid
      );
      if (response) {
        const data = response.data;
        setIsSuccess(true);
        reduxDispatch(
          addVisit({
            reason_visit: visitData.reason_visit,
            visitId: data.visitId,
            date: data.date,
            patientId: patientId,
            branchId: branchId,
            doctorId: selectedDoctor,
          })
        );
      }
    } catch (error) {
      console.error("Error adding visit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader description={"Saving Visit Information, please wait..."} />
      ) : (
        <div className="fixed px-5 top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
          <div className="w-[380px] md:w-1/2 xl:w-[500px] h-auto bg-white rounded-lg">
            <header className="px-4 py-5 border-b flex justify-between items-center">
              <h1 className="text-p-rg text-f-dark font-medium">
                Visitation Reason
              </h1>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-md border hover:bg-zinc-50"
              >
                &times;
              </button>
            </header>
            <div className="py-6 px-6">
              <label
                htmlFor="reason_visit"
                className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
              >
                Reason for Visit
              </label>
              <select
                name="reason_visit"
                value={visitData.reason_visit} // This should be a string
                onChange={handleReasonChange}
                className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 focus:outline-c-primary"
              >
                <option value="" disabled className="text-c-gray3">
                  Select Reason
                </option>
                <option value="check up">Check Up</option>
                <option value="consultation">Consultation</option>
              </select>
              <div className="mt-3 text-c-gray3">
                <label
                  htmlFor="doctorId"
                  className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                >
                  Attending Doctor
                </label>
                <select
                  name="doctorId"
                  value={selectedDoctor}
                  onChange={handleDoctorChange}
                  className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 focus:outline-c-primary"
                >
                  <option value="" disabled>
                    Select Doctor
                  </option>
                  {doctors
                    .filter(
                      (doctor) =>
                        currentPatient?.authorizedDoctor?.includes(
                          doctor.staffId
                        ) || currentPatient?.doctorId === doctor.staffId
                    )
                    .map((doctor, key) => (
                      <option key={key} value={doctor.staffId}>
                        {doctor.first_name} {doctor.last_name} (
                        {doctor.position})
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <footer className="flex gap-4 justify-end p-4">
              <button
                className="px-4 lg:px-10 py-2 text-f-dark text-p-sm md:text-p-rg font-medium rounded-md border shadow-sm hover:bg-sb-org"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 lg:px-12 py-2 bg-bg-con text-f-light text-p-sm md:text-p-rg font-medium rounded-md  hover:bg-opacity-75"
                onClick={handleAddVisit}
              >
                Save
              </button>
            </footer>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={isSuccess}
        onClose={onClose}
        title={"Visit Added Successfully"}
        description={"Patient's visit added to the system"}
      />
    </>
  );
};

export default VisitReasonModal;
