import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FiClock, FiTrash, FiEdit } from "react-icons/fi";
import ConfirmationModal from "./ConfirmationModal";
import SetAppointment from "./SetAppointment";
import { deleteAppointment } from "../../Service/AppointmentService";
import Cookies from "universal-cookie";
import { removeAppointment } from "../../Slice/AppointmentSlice";

const ViewSchedule = ({ onClose, appointments }) => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSetAppoinmentOpen, setSetAppoimentOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const reduxDispatch = useDispatch();
  const user = useSelector((state) => state.reducer.user.user);
  const role = user.role;
  const branches = useSelector((state) => state.reducer.branch.branch);
  let branchId =
    (user.branches && user.branches.length > 0 && user.branches[0].branchId) ||
    user.userId;
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const borderColors = [
    "border-l-blue-300",
    "border-l-red-300",
    "border-l-green-300",
    "border-l-yellow-300",
    "border-l-purple-300",
    "border-l-cyan-300",
    "border-l-orange-300",
    "border-l-pink-300",
    "border-l-violet-300",
  ];

  const openConfirmation = () =>
    setIsConfirmationModalOpen(!isConfirmationModalOpen);

  const openSetAppoinment = (appointment) => {
    setAppointmentToEdit(appointment);
    setSetAppoimentOpen(!isSetAppoinmentOpen);
  };

  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete) return;

    setIsLoading(true);
    try {
      const response = await deleteAppointment(
        branchId,
        appointmentToDelete,
        user.firebaseUid,
        accessToken,
        refreshToken
      );
      if (response) {
        setIsSuccess(true);
        reduxDispatch(removeAppointment(appointmentToDelete));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[380px] h-[480px] md:w-[500px] md:h-[600px]">
        <header className="px-4 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-rg md:text-p-lg text-c-secondary font-medium">
            Appointment Schedules
          </h1>
          <button onClick={onClose}> &times; </button>
        </header>
        <div className="bg-bg-mc h-full rounded-b-lg text-f-dark flex flex-col px-2 py-4">
          <div className="overflow-y-auto h-full flex flex-col gap-4">
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => {
                const branch = branches.find(
                  (b) => b.branchId === appointment.branchId
                );
                const branchesName =
                  branch?.name || branch?.branchName || "Unknown Branch";

                return (
                  <div
                    key={index}
                    className={`w-full border-l-8 px-4 py-6 bg-white shadow-sm rounded-md flex justify-between items-center ${
                      borderColors[index % borderColors.length]
                    } group flex flex-col`}
                  >
                    {role === "0" ||
                    (role === "2" && user.branches?.length > 1) ? (
                      <h1>{branchesName}</h1>
                    ) : null}

                    <div className="flex justify-between w-full">
                      <div className="flex flex-col gap-3">
                        <p className="text-p-sm md:text-p-rg font-medium">
                          {appointment.patient_name}
                        </p>
                        <p className="text-p-sc md:text-p-sm text-c-gray3">
                          {appointment.reason}
                        </p>
                      </div>

                      <div className="flex items-center relative gap-4 xl:gap-0">
                        <div className="flex flex-col items-end gap-2 transform transition-transform duration-300 group-hover:-translate-x-5">
                          <p className="text-p-sm md:text-p-rg font-medium">
                            Dr. {appointment.doctor}
                          </p>
                          <div className="flex items-center gap-2">
                            <FiClock className="h-4 w-4 text-c-gray3" />
                            <p className="text-p-sc md:text-p-sm text-c-gray3">
                              {dayjs(appointment.scheduledTime).format(
                                "h:mm A"
                              )}
                            </p>
                          </div>
                        </div>
                        {role === "0" ? (
                          ""
                        ) : (
                          <div className="flex flex-col justify-between opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                            {dayjs(appointment.scheduledTime).isAfter(
                              dayjs()
                            ) && (
                              <button
                                onClick={() => openSetAppoinment(appointment)}
                              >
                                <FiEdit className="w-5 h-5 text-blue-400" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setAppointmentToDelete(appointment.id);
                                openConfirmation();
                              }}
                            >
                              <FiTrash className="w-5 h-5 text-red-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex justify-center items-center">
                <p className="text-center">No appointments for this day.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isConfirmationModalOpen && (
        <ConfirmationModal
          onClose={() => setIsConfirmationModalOpen(false)}
          title={"Delete Schedule"}
          handleDelete={() => handleDeleteAppointment(appointmentToDelete)}
          isLoading={isLoading}
          actionSuccessMessage={"Appointment Successfully Deleted!"}
          isSuccessModalOpen={isSuccess}
        />
      )}
      {isSetAppoinmentOpen && (
        <SetAppointment
          onClose={openSetAppoinment}
          appointmentToEdit={appointmentToEdit}
        />
      )}
    </div>,
    document.body
  );
};

export default ViewSchedule;
