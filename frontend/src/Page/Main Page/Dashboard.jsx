import React from "react";
import { useSelector } from "react-redux";
import OrgDashboard from "../../Component/ui/Dashboard Components/OrgDashboard";
import DocDashboard from "../../Component/ui/Dashboard Components/DocDashboard";

const Dashboard = () => {
  const role = useSelector((state) => state.reducer.user.user.role);

  return (
    <div className="w-full h-full flex flex-col items-center font-Poppins p-4 gap-4 md:p-6 md:gap-6 2xl:p-8 overflow-auto">
      {role === "2" ? <DocDashboard /> : <OrgDashboard />}
    </div>
  );
};

export default Dashboard;
