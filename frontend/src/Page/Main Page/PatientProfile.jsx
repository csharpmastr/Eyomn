import React from "react";
import StaffViewPatientProfile from "../../Component/ui/StaffViewPatientProfile";
import DocViewPatientProfile from "../../Component/ui/DocViewPatientProfile";
import { useSelector } from "react-redux";

const PatientProfile = () => {
  const role = useSelector((state) => state.reducer.user.user.role);

  return (
    <div className="w-full h-full p-8">
      {role === "0" ? <StaffViewPatientProfile /> : <DocViewPatientProfile />}
    </div>
  );
};

export default PatientProfile;
