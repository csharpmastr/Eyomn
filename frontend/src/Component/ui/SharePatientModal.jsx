import React, { useState } from "react";
import { useSelector } from "react-redux";
import { sharePatient } from "../../Service/PatientService";
import Cookies from "universal-cookie";
import Loader from "./Loader";

const SharePatientModal = ({
  patientId,
  title,
  onClose,
  currentDoctor,
  patientName,
}) => {
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const user = useSelector((state) => state.reducer.user.user);
  const doctors = useSelector((state) => state.reducer.doctor.doctor);
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
  const handleSelectAuthorizedDoctor = (doctor, isChecked) => {
    setSelectedAuthorizedDoctor((prevAuthorizedDoctors) => {
      if (isChecked) {
        return [...prevAuthorizedDoctors, doctor];
      } else {
        return prevAuthorizedDoctors.filter(
          (doc) => doc.staffId !== doctor.staffId
        );
      }
    });
  };

  const handleSharePatient = async () => {
    console.log({ authorizedDoctor: authorizedDoctor });

    setIsLoading(true);
    try {
      const response = await sharePatient(
        currentDoctor,
        authorizedDoctor,
        patientId,
        user.firebaseUid,
        accessToken,
        refreshToken
      );
      if (response) {
        console.log("success");

        console.log(response);
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
      <div className="fixed p-4 top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
        <div className="w-[380px] md:w-1/2 xl:w-[500px] h-auto ">
          <header className="px-3 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
            <h1 className="text-p-lg text-c-secondary font-medium">{title}</h1>
            <button onClick={onClose}>&times;</button>
          </header>
          <div className="bg-white px-8 py-6">
            <div className="border shadow-sm rounded-md p-4 flex flex-col gap-4 mb-8">
              <section className="flex flex-col">
                <h1 className="text-p-sm text-c-gray3">Attending Doctor:</h1>
                <p className="text-f-dark text-p-lg font-medium">{`Dr. ${attendingDoctor.first_name} ${attendingDoctor.last_name}`}</p>
              </section>
              <section className="flex flex-col">
                <h1 className="text-p-sm text-c-gray3">Patient Name:</h1>
                <p className="text-f-dark text-p-lg font-medium">
                  {patientName}
                </p>
              </section>
            </div>
            <div>
              <h1 className="text-p-rg font-medium text-c-secondary mb-4">
                | Share with Doctor
              </h1>
              {doctorsExceptCurrent.map((doctor, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mr-2"
                    id={doctor.staffId}
                    onChange={(e) =>
                      handleSelectAuthorizedDoctor(
                        doctor.staffId,
                        e.target.checked
                      )
                    }
                  />
                  <label
                    htmlFor={doctor.staffId}
                    className="text-c-gray3 text-p-rg"
                  >
                    {`Dr. ${doctor.first_name} ${doctor.last_name}`}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <footer className="border border-t-f-gray bg-white rounded-b-lg flex gap-4 justify-end p-4">
            <button
              type="button"
              className="px-4 lg:px-12 py-3 text-f-dark text-p-sm md:text-p-rg font-medium border shadow-sm rounded-md hover:bg-sb-org"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 lg:px-12 py-3 bg-bg-con rounded-md text-f-light text-p-sm md:text-p-rg font-medium hover:bg-opacity-75"
              type="submit"
              onClick={handleSharePatient}
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
