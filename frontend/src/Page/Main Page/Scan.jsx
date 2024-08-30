import React, { useState } from "react";
import PatientModal from "../../Component/ui/PatientModal";
import { Outlet } from "react-router-dom";

const Scan = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="h-full flex justify-center items-center">
      {isModalOpen && <PatientModal onClose={closeModal} />}
      <Outlet />
    </div>
  );
};

export default Scan;
