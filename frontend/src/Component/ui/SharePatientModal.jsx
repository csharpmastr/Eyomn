import React, { useState } from "react";
import { useSelector } from "react-redux";

const SharePatientModal = ({ patientId, title, onClose, currentDoctor }) => {
  const doctors = useSelector((state) => state.reducer.doctor.doctor);
  const [selectdAuthorizedDoctor, setSelectedAuthorizedDoctor] = useState([]);
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
  console.log(selectdAuthorizedDoctor);

  return (
    <div className="fixed p-4 top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[500px] md:w-[600px] md:mr-8">
        <header className="px-3 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-lg text-c-secondary font-semibold">{title}</h1>
          <button onClick={onClose}>&times;</button>
        </header>
        <div className="bg-white h-[480px] md:h-[450px] overflow-y-auto">
          <div className="p-3 md:p-8">
            <h1 className="text-p-rg font-semibold text-c-secondary">
              | Attending Doctor
            </h1>
            <p className="text-center mt-4 text-h-h4 font-semibold text-c-gray3">
              {`Doctor ${attendingDoctor.first_name} ${attendingDoctor.last_name}`}
            </p>
          </div>
          <div className="p-3 md:p-8">
            <h1 className="text-p-rg font-semibold text-c-secondary mb-5">
              | Other Doctor(s)
            </h1>
            {doctorsExceptCurrent.map((doctor, index) => (
              <div key={index} className="flex items-center  mb-4">
                <input
                  type="checkbox"
                  className="w-6 h-6 mr-2"
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
                  className="text-c-gray3 font-medium text-p-lg"
                >
                  {doctor.first_name} {doctor.last_name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePatientModal;
