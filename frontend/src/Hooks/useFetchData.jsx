import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { getPatients } from "../Service/PatientService";
import { useDispatch, useSelector } from "react-redux";
import { setPatients } from "../Slice/PatientSlice";
import { getBranchData, getDoctorList } from "../Service/OrganizationService";
import { setDoctor } from "../Slice/doctorSlice";
import { setBranch } from "../Slice/BranchSlice";
import { setStaffs } from "../Slice/StaffSlice";
import { getProducts } from "../Service/InventoryService";
import { setProducts } from "../Slice/ProductSlice";

export const useFetchData = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");

  const buildApiCalls = () => {
    let organizationId = user.organizationId || null;
    let branchId = user.branchId || user.userId || null;

    switch (user.role) {
      case "1":
        return [
          getPatients(
            organizationId,
            branchId,
            null,
            accessToken,
            refreshToken,
            user.role
          ),
        ];
      case "3":
        return [
          getPatients(
            organizationId,
            branchId,
            null,
            accessToken,
            refreshToken,
            user.role
          ),
          getDoctorList(organizationId, branchId, accessToken, refreshToken),
          getProducts(branchId, accessToken, refreshToken),
        ];
      case "0":
        return [
          getPatients(
            user.userId,
            null,
            null,
            accessToken,
            refreshToken,
            user.role
          ),
          getBranchData(user.userId, accessToken, refreshToken),
        ];
      default:
        return [];
    }
  };

  const fetchData = async () => {
    try {
      const apiCalls = buildApiCalls();

      const results = await Promise.allSettled(apiCalls);

      let patients = [];
      let doctors = [];
      let branches = [];
      let staffs = [];
      let products = [];

      if (user.role === "1" || user.role === "3") {
        if (results[0].status === "fulfilled") patients = results[0].value;
        if (user.role === "3") {
          if (results[1]?.status === "fulfilled") doctors = results[1].value;
          if (results[2]?.status === "fulfilled") products = results[2].value;
        }
      } else if (user.role === "0") {
        if (results[0].status === "fulfilled") patients = results[0].value;
        if (results[1].status === "fulfilled") {
          branches = results[1].value;
          staffs = branches.flatMap((branch) => branch.staffs || []);
        }
      }

      reduxDispatch(setBranch(branches));
      reduxDispatch(setPatients(patients));
      reduxDispatch(setDoctor(doctors));
      reduxDispatch(setStaffs(staffs));
      reduxDispatch(setProducts(products));
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return { fetchData };
};
