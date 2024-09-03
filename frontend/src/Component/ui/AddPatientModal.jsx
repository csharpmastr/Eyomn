import React, { useState } from "react";
import Modal from "./Modal";
import Form from "./Form";
import SuccessModal from "./SuccessModal";

import { addPatient } from "../../Service/PatientService";
import Cookies from "universal-cookie";
import { useAuthContext } from "../../Hooks/useAuthContext";
import Loader from "./Loader";

const AddPatientModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const cookies = new Cookies();
  const { user } = useAuthContext();
  const accessToken = cookies.get("accessToken", { path: "/" });
  const refreshToken = cookies.get("accessToken", { path: "/" });

  const formFields = [
    {
      name: "first_name",
      type: "text",
      placeholder: "Patient first name",
      pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    },
    {
      name: "last_name",
      type: "text",
      placeholder: "Patient last name",
      pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    },
    {
      name: "address",
      type: "text",
      placeholder: "Patient address",
      pattern: "^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$",
    },
  ];

  const handlePatientSubmit = async (formData) => {
    setIsLoading(true);
    const patientData = { ...formData, clinicId: user.id };
    try {
      const res = await addPatient(patientData, accessToken, refreshToken);
      if (res) {
        setIsSuccess(true);
        onClose();
      }
    } catch (err) {
      setIsError(true);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="Add Patient"
          className="w-[600px] h-auto p-4"
          overlayDescriptionClassName={
            "text-center font-Poppins pt-5 text-black text-[18px]"
          }
        >
          <Form formFields={formFields} handleSubmit={handlePatientSubmit} />
        </Modal>
      )}

      <SuccessModal
        isOpen={isSuccess}
        onClose={() => {
          setIsSuccess(false);
          onClose();
        }}
        title="Added Success"
        description="The patient has been registered in the system. You can now view and update their details as needed."
      />
      <Modal
        isOpen={isError}
        onClose={() => {
          setIsError(false);
          onClose();
        }}
        title="Adding Unavailable"
        description="There was an issue adding the patient. Please try again."
      />
    </>
  );
};

export default AddPatientModal;
