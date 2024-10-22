import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { addAppointmentService } from "../../Service/AppointmentService";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";
import Modal from "./Modal";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { addAppointment } from "../../Slice/AppointmentSlice";

const SetAppointment = ({ onClose }) => {
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const user = useSelector((state) => state.reducer.user.user);
  const doctors = useSelector((state) => state.reducer.doctor.doctor);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [doesExists, setDoesExists] = useState(false);
  const reduxDispatch = useDispatch();
  let branchId =
    (user.branches && user.branches.length > 0 && user.branches[0].branchId) ||
    user.userId;

  const [formData, setFormData] = useState({
    patient_name: "",
    reason: "",
    doctorId: "",
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

    if (name === "doctor") {
      const selectedDoctor = doctors.find((doctor) => doctor.staffId === value);
      if (selectedDoctor) {
        setFormData((prevData) => ({
          ...prevData,
          doctor: selectedDoctor.first_name + " " + selectedDoctor.last_name,
          doctorId: selectedDoctor.staffId,
        }));
      }
    } else if (name === "date") {
      setDate(value);
    } else if (name === "time") {
      setTime(value);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const validateForm = () => {
    let newErrors = {};

    if (
      !formData.patient_name ||
      !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(formData.patient_name)
    )
      newErrors.patient_name = "(Patient name is required)";

    if (!date) newErrors.date = "(Select appointment date)";
    if (!time) newErrors.time = "(Select appointment time)";
    if (!formData.reason) newErrors.reason = "(Select reason for visit)";
    if (!formData.doctor) newErrors.doctor = "(Select doctor to assign)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTimeOptions = () => {
    const times = [];
    const start = new Date();
    start.setHours(8, 30, 0);
    const end = new Date();
    end.setHours(18, 0, 0);

    while (start <= end) {
      const hours = start.getHours().toString().padStart(2, "0");
      const minutes = start.getMinutes().toString().padStart(2, "0");
      times.push(`${hours}:${minutes}`);
      start.setMinutes(start.getMinutes() + 30);
    }

    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleSubmitAppointment = async () => {
    console.log(formData);

    // e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    const scheduledTime = new Date(`${date}T${time}`).toISOString();

    const appointmentData = {
      ...formData,
      scheduledTime,
    };

    try {
      const response = await addAppointmentService(
        branchId,
        appointmentData,
        accessToken,
        refreshToken,
        user.firebaseUid
      );

      if (response) {
        setIsSuccess(true);

        console.log(response.data);
        const scheduleId = response.data.scheduleId;
        reduxDispatch(addAppointment({ ...appointmentData, scheduleId }));
      }
    } catch (error) {
      setIsSuccess(false);
      if (error.response?.status === 409) {
        setDoesExists({ type: "same_time" });
      } else if (error.response?.status === 422) {
        setDoesExists({ type: "overlap" });
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
          <div className="w-[380px] md:w-1/2 xl:w-[500px] h-auto ">
            <header className="p-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
              <h1 className="text-p-lg text-c-secondary font-semibold">
                Set Appointment
              </h1>
              <button onClick={onClose}> &times; </button>
            </header>
            <form className="p-6 bg-white" onSubmit={handleSubmitAppointment}>
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
                      {(date === "" || errors.date) && errors.date}
                    </span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
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
                      {(time === "" || errors.time) && errors.time}
                    </span>
                  </label>
                  <select
                    name="time"
                    value={time}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  >
                    <option value="" disabled className="text-c-gray3">
                      Select Time
                    </option>
                    {timeOptions.map((timeOption, index) => (
                      <option key={index} value={timeOption}>
                        {timeOption}
                      </option>
                    ))}
                  </select>
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
                  <option value="check up">Check Up</option>
                  <option value="consultation">Consultation</option>
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
                  value={formData.doctorId || ""}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                >
                  <option value="" disabled className="text-c-gray3">
                    Available Doctor
                  </option>
                  {doctors.map((doctor, key) => (
                    <option key={key} value={doctor.staffId}>
                      {doctor.first_name + " " + doctor.last_name}
                    </option>
                  ))}
                </select>
              </section>
            </form>
            <div className="border border-t-f-gray bg-white rounded-b-lg flex gap-4 justify-end p-4">
              <button
                type="button"
                className="px-4 py-2 text-f-dark text-p-rg font-medium border border-c-gray3 rounded-md"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAppointment}
                type="submit"
                className="px-4 py-2 bg-c-primary rounded-md text-f-light text-p-rg font-medium"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={isSuccess}
        onClose={() => {
          setIsSuccess(false);
        }}
        title="Adding Success"
        description="Appointment has been added in the system."
      />
      <Modal
        isOpen={doesExists}
        onClose={() => {
          setDoesExists(false);
        }}
        title="Invalid request"
        icon={<IoMdCloseCircleOutline className="w-24 h-24 text-red-700" />}
        className="w-[600px] h-auto p-4"
        overlayDescriptionClassName={
          "text-center font-Poppins pt-5 text-black text-[18px]"
        }
        description={
          doesExists.type === "overlap"
            ? "The scheduled time overlaps with an existing appointment."
            : "The scheduled time already exists."
        }
      ></Modal>
    </>
  );
};

export default SetAppointment;
