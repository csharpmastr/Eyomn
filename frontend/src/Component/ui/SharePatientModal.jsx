import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { sharePatient } from "../../Service/PatientService";
import Cookies from "universal-cookie";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";

const SharePatientModal = ({
  patientId,
  title,
  onClose,
  currentDoctor,
  patientName,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const user = useSelector((state) => state.reducer.user.user);
  const doctors = useSelector((state) => state.reducer.doctor.doctor);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const patient = patients.find((patient) => patient.patientId === patientId);

  const [authorizedDoctor, setSelectedAuthorizedDoctor] = useState([]);

  if (doctors.length === 0) {
    return [];
  }

  const attendingDoctor = doctors.find(
    (doctor) => doctor.staffId === currentDoctor
  );

  const doctorsExceptCurrent = doctors.filter(
    (doctor) => doctor.staffId !== currentDoctor
  );

  useEffect(() => {
    if (patient && patient.authorizedDoctor) {
      const initialAuthorizedDoctors = patient.authorizedDoctor;
      setSelectedAuthorizedDoctor(initialAuthorizedDoctors);
    }
  }, [patient]);

  const handleSelectAuthorizedDoctor = (doctor, isChecked) => {
    setSelectedAuthorizedDoctor((prevAuthorizedDoctors) => {
      if (isChecked) {
        return [...prevAuthorizedDoctors, doctor.staffId];
      } else {
        return prevAuthorizedDoctors.filter((doc) => doc !== doctor.staffId);
      }
    });
  };

  const handleSharePatient = async () => {
    setIsLoading(true);
    try {
      const response = await sharePatient(
        currentDoctor,
        authorizedDoctor,
        patientId,
        user.firebaseUid
      );
      if (response) {
        console.log("Success:", response);
        setIsSuccessModalOpen(true); // Open success modal on successful response
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        title="Success!"
        description={`Patient ${patientName} has been successfully shared.`}
        onClose={() => {
          setIsSuccessModalOpen(false);
          onClose(); // Close parent modal after success
        }}
      />
      <div className="fixed p-4 top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
        <div className="w-[380px] md:w-1/2 xl:w-[500px] h-auto bg-white rounded-lg">
          <header className="px-4 py-5 border-b flex justify-between items-center">
            <h1 className="text-p-rg text-f-dark font-medium">{title}</h1>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-md border hover:bg-zinc-50"
            >
              &times;
            </button>
          </header>
          <div className="p-6">
            <div className="flex flex-col gap-4 mb-8">
              <section className="flex flex-col text-p-sm">
                <h1 className=" text-c-gray3">Attending Doctor:</h1>
                <p className="text-f-dark font-medium">{`Dr. ${attendingDoctor.first_name} ${attendingDoctor.last_name}`}</p>
              </section>
              <section className="flex flex-col">
                <h1 className="text-p-sm text-c-gray3">Patient Name:</h1>
                <p className="text-f-dark text-p-lg font-medium">
                  {patientName}
                </p>
              </section>
            </div>
            <div className="p-4 border shadow-sm rounded-md">
              <h1 className="text-p-rg font-medium text-c-secondary mb-4">
                Share with Doctor
              </h1>
              {doctorsExceptCurrent.length === 0 ? (
                <p className="text-c-gray3 text-p-rg">
                  No other doctors available to share this patient.
                </p>
              ) : (
                doctorsExceptCurrent.map((doctor, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 mr-2"
                      id={doctor.staffId}
                      checked={authorizedDoctor.includes(doctor.staffId)}
                      disabled={authorizedDoctor.includes(user.userId)}
                      onChange={(e) =>
                        handleSelectAuthorizedDoctor(doctor, e.target.checked)
                      }
                    />
                    <label
                      htmlFor={doctor.staffId}
                      className="text-c-gray3 text-p-rg"
                    >
                      {`Dr. ${doctor.first_name} ${doctor.last_name}`}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          <footer className="flex gap-4 justify-end p-4">
            <button
              type="button"
              className="px-4 lg:px-12 py-2 text-f-dark text-p-sm md:text-p-rg font-medium rounded-md border shadow-sm hover:bg-sb-org"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 lg:px-12 py-2 bg-bg-con rounded-md text-f-light text-p-sm md:text-p-rg font-medium ${
                authorizedDoctor.includes(user.userId)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-opacity-75 cursor-pointer"
              }`}
              type="submit"
              disabled={authorizedDoctor.length === 0}
              onClick={
                authorizedDoctor.includes(user.userId)
                  ? null
                  : handleSharePatient
              }
            >
              Share Patient
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default SharePatientModal;
