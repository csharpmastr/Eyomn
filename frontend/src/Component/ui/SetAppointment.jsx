import React, { useState } from "react";
import ReactDOM from "react-dom";

const SetAppointment = ({ onClose }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    patient_name: "",
    date: "",
    time: "",
    reason: "",
    doctor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Call validateForm before saving
  const validateForm = () => {
    let newErrors = {};

    if (
      !formData.patient_name ||
      !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(formData.patient_name)
    )
      newErrors.patient_name = "(Patient name is required)";

    if (!formData.date) newErrors.date = "(Select appointment date)";

    if (!formData.time) newErrors.time = "(Select appointment time)";

    if (!formData.reason) newErrors.reason = "(Select reason for visit)";

    if (!formData.doctor) newErrors.doctor = "(Select doctor to assign)";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[500px]">
        <header className="px-4 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-lg text-c-secondary font-semibold">
            Set Appointment
          </h1>
          <button onClick={onClose}> &times; </button>
        </header>
        <div className="py-6 px-6 bg-white">
          <section>
            <label
              htmlFor="patient_name"
              className="text-p-sm text-c-gray3 font-medium"
            >
              Patient Name{" "}
              <span className="text-red-400">
                {(formData.patient_name === "" || errors.patient_name) &&
                  errors.patient_name}
              </span>
            </label>
            <input
              type="text"
              name="patient_name"
              value={formData.patient_name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
              placeholder="Enter patient name"
            />
          </section>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="date"
                className="text-p-sm text-c-gray3 font-medium"
              >
                Date{" "}
                <span className="text-red-400">
                  {(formData.date === "" || errors.date) && errors.date}
                </span>
              </label>
              <input
                type="date"
                name="date"
                min={0}
                value={formData.date}
                onChange={handleChange}
                className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="time"
                className="text-p-sm text-c-gray3 font-medium"
              >
                Time{" "}
                <span className="text-red-400">
                  {(formData.time === "" || errors.time) && errors.time}
                </span>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
              />
            </div>
          </div>
          <section>
            <label
              htmlFor="reason"
              className="text-p-sm text-c-gray3 font-medium"
            >
              Reason{" "}
              <span className="text-red-400">
                {(formData.reason === "" || errors.reason) && errors.reason}
              </span>
            </label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="mt-2 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-5 focus:outline-c-primary"
            >
              <option value="" disabled className="text-c-gray3">
                Select Reason
              </option>
              <option value="checkup">Check Up</option>
              <option value="consulation">Consultation</option>
              <option value="eyeglass">Eye Glass</option>
            </select>
          </section>
          <section>
            <label
              htmlFor="doctor"
              className="text-p-sm text-c-gray3 font-medium"
            >
              Appoint a Doctor{" "}
              <span className="text-red-400">
                {(formData.doctor === "" || errors.doctor) && errors.doctor}
              </span>
            </label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="mt-2 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-5 focus:outline-c-primary"
            >
              <option value="" disabled className="text-c-gray3">
                Available Doctor
              </option>
              <option value="-">-</option>
              <option value="-">-</option>
            </select>
          </section>
        </div>
        <footer className="border border-t-f-gray bg-white rounded-b-lg flex gap-2 justify-end py-6 px-4">
          <button
            className="w-28 h-12 text-f-dark text-p-rg font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="w-28 h-12 bg-[#3B7CF9] text-f-light text-p-rg font-semibold rounded-md hover:bg-[#77a0ec] active:bg-bg-[#2c4c86]">
            Save
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default SetAppointment;
