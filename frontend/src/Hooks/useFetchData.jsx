import { useEffect } from "react";
import Cookies from "universal-cookie";
import { getPatients } from "../Service/PatientService";
import { useDispatch, useSelector } from "react-redux";
import { setPatients } from "../Slice/PatientSlice";
import { getBranchData, getDoctorList } from "../Service/OrganizationService";
import { setDoctor } from "../Slice/doctorSlice";
import { setBranch } from "../Slice/BranchSlice";
import { setStaffs } from "../Slice/StaffSlice";

export const useFetchData = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");

  const fetchData = async () => {
    try {
      let organizationId = null;
      let branchId = null;
      let branches = [];
      let patients = [];
      let doctors = [];
      let staffs = [];
      if (user.role === "1") {
        organizationId = user.organizationId;
        branchId = user.userId;
        patients = await getPatients(
          organizationId,
          branchId,
          null,
          accessToken,
          refreshToken,
          user.role
        );
      } else if (user.role === "3") {
        organizationId = user.organizationId;
        branchId = user.branchId;
        patients = await getPatients(
          organizationId,
          branchId,
          null,
          accessToken,
          refreshToken,
          user.role
        );
        doctors = await getDoctorList(
          organizationId,
          branchId,
          accessToken,
          refreshToken
        );
        console.log(doctors);
      } else if (user.role === "0") {
        patients = await getPatients(
          user.userId,
          null,
          null,
          accessToken,
          refreshToken,
          user.role
        );
        branches = await getBranchData(user.userId, accessToken, refreshToken);
        staffs = branches.flatMap((branch) => branch.staffs || []);
      }
      reduxDispatch(setBranch(branches));
      reduxDispatch(setPatients(patients));
      reduxDispatch(setDoctor(doctors));
      reduxDispatch(setStaffs(staffs));
    } catch (error) {
      console.error("Error fetching patients: ", error);
    }
  };

  return {
    fetchData,
  };
};
