import { useEffect } from "react";
import Cookies from "universal-cookie";
import { getPatients } from "../Service/PatientService";
import { useDispatch, useSelector } from "react-redux";
import { setPatients } from "../Slice/PatientSlice";

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

      let patients = {};

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
        console.log("HEllo");

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
      } else if (user.role === "0") {
        patients = await getPatients(
          user.userId,
          null,
          null,
          accessToken,
          refreshToken,
          user.role
        );
      }
      reduxDispatch(setPatients(patients));
    } catch (error) {
      console.error("Error fetching patients: ", error);
    }
  };

  return {
    fetchData,
  };
};
