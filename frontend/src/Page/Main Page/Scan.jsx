import React, { useState } from "react";
import PatientModal from "../../Component/ui/PatientModal";
import { Outlet } from "react-router-dom";
import MedForm from "./MedForm";

const Scan = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="h-full ">
      {/* {isModalOpen && <PatientModal onClose={closeModal} tab={"scan"} />}
      <Outlet /> */}
      <MedForm />
    </div>
  );
};

export default Scan;
