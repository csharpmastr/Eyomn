import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addVisitService } from "../../Service/PatientService";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";
import { addVisit } from "../../Slice/VisitSlice";

const VisitReasonModal = ({ onClose }) => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const doctors = useSelector((state) => state.reducer.doctor.doctor);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const reduxDispatch = useDispatch();
  const [visitData, setVisitData] = useState({
    reason_visit: "",
  });

  const { patientId } = useParams();
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
        firebaseUid,
        accessToken,
        refreshToken
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
          <div className="w-[600px]">
            <header className="px-4 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
              <h1 className="text-p-lg text-c-secondary font-semibold">
                Visitation Reason
              </h1>
              <button onClick={onClose}> &times; </button>
            </header>
            <div className="py-6 px-6 h-fit bg-white">
              <label htmlFor="reason_visit" className="text-p-sm">
                Reason for Visit
              </label>
              <select
                name="reason_visit"
                value={visitData.reason_visit} // This should be a string
                onChange={handleReasonChange}
                className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
              >
                <option value="" disabled className="text-c-gray3">
                  Select Reason
                </option>
                <option value="check up">Check Up</option>
                <option value="consultation">Consultation</option>
              </select>
              <div className="mt-3 text-c-gray3">
                <label htmlFor="doctorId" className="text-p-sm">
                  Attending Doctor
                </label>
                <select
                  name="doctorId"
                  value={selectedDoctor}
                  onChange={handleDoctorChange}
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                >
                  <option value="" disabled>
                    Select Doctor
                  </option>
                  {doctors.map((doctor, key) => (
                    <option key={key} value={doctor.staffId}>
                      {doctor.first_name} {doctor.last_name} ({doctor.position})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <footer className="border border-t-f-gray bg-white rounded-b-lg flex gap-4 justify-end p-4">
              <button
                className="px-4 py-2 text-f-dark text-p-rg font-medium rounded-md border border-c-gray3"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-7 py-2 bg-[#3B7CF9] text-f-light text-p-rg font-semibold rounded-md hover:bg-[#77a0ec] active:bg-bg-[#2c4c86]"
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
