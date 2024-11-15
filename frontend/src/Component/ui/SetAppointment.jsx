import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { addAppointmentService } from "../../Service/AppointmentService";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";
import Modal from "./Modal";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { addAppointment } from "../../Slice/AppointmentSlice";

const SetAppointment = ({ onClose, appointmentToEdit }) => {
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const user = useSelector((state) => state.reducer.user.user);
  const doctors = useSelector((state) => state.reducer.doctor.doctor);
  const branches = useSelector((state) => state.reducer.branch.branch);
  const appointments = useSelector(
    (state) => state.reducer.appointment.appointment
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [doesExists, setDoesExists] = useState(false);
  const [selectedBranch, setSelectedBranchId] = useState(null);
  const reduxDispatch = useDispatch();
  const [availableDoctors, setAvailableDoctors] = useState([]);

  let branchId =
    (user.branches && user.branches.length > 0 && user.branches[0].branchId) ||
    user.userId;

  const [formData, setFormData] = useState({
    patient_name: "",
    reason: "",
    doctorId: "",
    doctor: "",
  });

  const [docFormData, setDocFormData] = useState({
    patient_name: "",
    reason: "",
    doctorId: user.userId,
    doctor: `${user.first_name} ${user.last_name}`,
  });

  useEffect(() => {
    if (appointmentToEdit) {
      setFormData({
        patient_name: appointmentToEdit.patient_name,
        reason: appointmentToEdit.reason,
        doctorId: appointmentToEdit.doctorId,
        doctor: appointmentToEdit.doctor,
      });
      const scheduledTime = new Date(appointmentToEdit.scheduledTime);
      setDate(scheduledTime.toISOString().split("T")[0]);
      setTime(scheduledTime.toTimeString().split(" ")[0].substring(0, 5));
    }
  }, [appointmentToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    if (user.role !== "2") {
      if (name === "doctor") {
        const selectedDoctor = doctors.find(
          (doctor) => doctor.staffId === value
        );
        if (selectedDoctor) {
          setFormData((prevData) => ({
            ...prevData,
            doctor: selectedDoctor.first_name + " " + selectedDoctor.last_name,
            doctorId: selectedDoctor.staffId,
          }));
        }
      } else if (name === "patient_name") {
        setFormData((prevData) => ({
          ...prevData,
          patient_name: value,
        }));
      } else if (name === "reason") {
        setFormData((prevData) => ({
          ...prevData,
          reason: value,
        }));
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
    } else {
      if (name === "patient_name") {
        setDocFormData((prevData) => ({
          ...prevData,
          patient_name: value,
        }));
      } else if (name === "reason") {
        setDocFormData((prevData) => ({
          ...prevData,
          reason: value,
        }));
      } else if (name === "branch") {
        setSelectedBranchId(value);
      } else if (name === "date") {
        setDate(value);
      } else if (name === "time") {
        setTime(value);
      } else {
        setDocFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const validateForm = () => {
    let newErrors = {};
    const dataToValidate = user.role !== "2" ? formData : docFormData;

    if (
      !dataToValidate.patient_name ||
      !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(dataToValidate.patient_name)
    ) {
      newErrors.patient_name = "(Patient name is required)";
    }
    if (!date) {
      newErrors.date = "(Select appointment date)";
    }
    if (!time) {
      newErrors.time = "(Select appointment time)";
    }
    if (!dataToValidate.reason) {
      newErrors.reason = "(Select reason for visit)";
    }
    if (user.role !== "2" && !dataToValidate.doctor) {
      newErrors.doctor = "(Select doctor to assign)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClear = () => {
    setFormData({
      patient_name: "",
      reason: "",
      doctorId: "",
      doctor: "",
    });
    setDocFormData({
      patient_name: "",
      reason: "",
    });
    setDate("");
    setTime("");
  };
  const generateTimeOptions = (appointmentDay) => {
    const times = [];
    const start = new Date();
    start.setHours(8, 30, 0, 0);
    const end = new Date();
    end.setHours(18, 0, 0, 0);

    while (start <= end) {
      const hours = start.getHours().toString().padStart(2, "0");
      const minutes = start.getMinutes().toString().padStart(2, "0");
      times.push(`${hours}:${minutes}`);
      start.setMinutes(start.getMinutes() + 30);
    }

    return times.filter((time) => {
      const timeISO = new Date(`${appointmentDay}T${time}:00`).toISOString();
      return !appointments.some((appointment) => {
        const appointmentTimeISO = new Date(
          appointment.scheduledTime
        ).toISOString();
        return timeISO === appointmentTimeISO;
      });
    });
  };

  const timeOptions = date ? generateTimeOptions(date) : [];

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    const scheduledTime = new Date(`${date}T${time}`).toISOString();

    try {
      if (user.role !== "2") {
        const appointmentData = {
          ...formData,
          scheduledTime,
        };
        const response = await addAppointmentService(
          branchId,
          appointmentData,
          accessToken,
          refreshToken,
          user.firebaseUid
        );

        if (response) {
          setIsSuccess(true);
          handleClear();
          console.log(response.data);
          const scheduleId = response.data.scheduleId;
          reduxDispatch(addAppointment({ ...appointmentData, scheduleId }));
        }
      } else {
        const appointmentData = {
          ...docFormData,
          scheduledTime,
        };
        const response = await addAppointmentService(
          selectedBranch,
          appointmentData,
          accessToken,
          refreshToken,
          user.firebaseUid
        );
        if (response) {
          setIsSuccess(true);
          handleClear();
          console.log(response.data);
          const scheduleId = response.data.scheduleId;
          reduxDispatch(addAppointment({ ...appointmentData, scheduleId }));
        }
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
  const filterAvailableDoctors = (date, time) => {
    return doctors.filter((doctor) => {
      const doctorScheduleForDay = doctor.schedule.find((scheduleEntry) => {
        const scheduleDay = scheduleEntry.day.toLowerCase();
        const inputDay = new Date(date)
          .toLocaleString("en-GB", { weekday: "long" })
          .toLowerCase();
        return scheduleDay === inputDay;
      });

      if (!doctorScheduleForDay) {
        return false;
      }

      const inTime = new Date(`1970-01-01T${doctorScheduleForDay.in}:00Z`);
      const outTime = new Date(`1970-01-01T${doctorScheduleForDay.out}:00Z`);
      outTime.setMinutes(outTime.getMinutes() - 30);
      const inputTime = new Date(`1970-01-01T${time}:00Z`);

      const isTimeWithinRange = inputTime >= inTime && inputTime <= outTime;

      const isDoctorAvailable = !appointments.some((appointment) => {
        const appointmentDate = new Date(appointment.scheduledTime);
        const appointmentTime = new Date(
          `1970-01-01T${appointmentDate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}:00Z`
        );

        return (
          appointment.doctorId === doctor.staffId &&
          appointmentDate.toLocaleDateString() ===
            new Date(date).toLocaleDateString() &&
          appointmentTime.getTime() === inputTime.getTime()
        );
      });

      return isTimeWithinRange && isDoctorAvailable;
    });
  };

  useEffect(() => {
    if (date && time) {
      setAvailableDoctors(filterAvailableDoctors(date, time));
    }
  }, [date, time, appointments, doctors]);

  return (
    <>
      {isLoading ? (
        <Loader
          description={"Saving Appointment Information, please wait..."}
        />
      ) : (
        <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
          <div className="w-[380px] md:w-1/2 xl:w-[500px] h-auto ">
            <header className="p-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
              <h1 className="text-p-rg md:text-p-lg text-c-secondary font-medium">
                {appointmentToEdit ? "Edit Appointment" : "Set Appointment"}
              </h1>
              <button onClick={onClose}> &times; </button>
            </header>
            <form className="p-6 bg-white" onSubmit={handleSubmitAppointment}>
              <section>
                <label
                  htmlFor="patient_name"
                  className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                >
                  Patient Name{" "}
                  <span className="text-red-400">
                    {(formData.patient_name === "" ||
                      docFormData.patient_name === "" ||
                      errors.patient_name) &&
                      errors.patient_name}
                  </span>
                </label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name || docFormData.patient_name}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  placeholder="Enter patient name"
                />
              </section>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label
                    htmlFor="date"
                    className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
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
                    className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
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
                  className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                >
                  Reason{" "}
                  <span className="text-red-400">
                    {(formData.reason === "" ||
                      docFormData === "" ||
                      errors.reason) &&
                      errors.reason}
                  </span>
                </label>
                <select
                  name="reason"
                  value={formData.reason || docFormData.reason}
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
              {user.role !== "2" ? (
                <section>
                  <label
                    htmlFor="doctor"
                    className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                  >
                    Appoint a Doctor{" "}
                    <span className="text-red-400">
                      {(formData.doctor === "" || errors.doctor) &&
                        errors.doctor}
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
                    {availableDoctors.map((doctor, key) => (
                      <option key={key} value={doctor.staffId}>
                        {doctor.first_name + " " + doctor.last_name}
                      </option>
                    ))}
                  </select>
                </section>
              ) : (
                <section>
                  <label
                    htmlFor="branch"
                    className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                  >
                    Select a Branch{" "}
                    <span className="text-red-400">
                      {/* {(formData.doctor === "" || errors.doctor) && errors.doctor} */}
                    </span>
                  </label>
                  <select
                    name="branch"
                    value={selectedBranch || ""}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                  >
                    <option value="" disabled className="text-c-gray3">
                      Available Branches
                    </option>
                    {branches.map((branch, key) => (
                      <option
                        key={key}
                        value={branch.branchId}
                      >{`${branch.branchName}`}</option>
                    ))}
                  </select>
                </section>
              )}
            </form>
            <div className="border border-t-f-gray bg-white rounded-b-lg flex gap-4 justify-end px-4 py-3">
              <button
                type="button"
                className="px-4 lg:px-12 py-2 text-f-dark text-p-sm md:text-p-rg font-medium border shadow-sm rounded-md hover:bg-sb-org"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAppointment}
                type="submit"
                className="px-4 lg:px-12 py-2 bg-bg-con rounded-md text-f-light text-p-sm md:text-p-rg font-medium hover:bg-opacity-75"
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
