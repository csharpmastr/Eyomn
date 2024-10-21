import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { getPatients } from "../Service/PatientService";
import { useDispatch, useSelector } from "react-redux";
import { setPatients } from "../Slice/PatientSlice";
import { setDoctor } from "../Slice/doctorSlice";
import { setBranch } from "../Slice/BranchSlice";
import { setStaffs } from "../Slice/StaffSlice";
import { getProducts } from "../Service/InventoryService";
import { setProducts } from "../Slice/ProductSlice";
import {
  getAppointments,
  getDoctorAppointments,
} from "../Service/AppointmentService";
import { setAppointments } from "../Slice/AppointmentSlice";
import { getBranchData, getDoctorList } from "../Service/organizationService";

export const useFetchData = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");

  const buildApiCalls = () => {
    let organizationId = user.organizationId || null;
    let branchId =
      (user.branches &&
        user.branches.length > 0 &&
        user.branches[0].branchId) ||
      user.userId ||
      null;
    let firebaseUid = user.firebaseUid;

    switch (user.role) {
      case "1":
        return [
          {
            call: () =>
              getPatients(
                organizationId,
                branchId,
                null,
                accessToken,
                refreshToken,
                user.role,
                firebaseUid
              ),
            type: "patients",
          },
          {
            call: () =>
              getDoctorList(
                organizationId,
                branchId,
                accessToken,
                refreshToken,
                firebaseUid
              ),
            type: "doctors",
          },
          {
            call: () =>
              getProducts(branchId, accessToken, refreshToken, firebaseUid),
            type: "products",
          },
          {
            call: () =>
              getAppointments(branchId, accessToken, refreshToken, firebaseUid),
            type: "appointments",
          },
        ];
      case "3":
        return [
          {
            call: () =>
              getPatients(
                organizationId,
                branchId,
                null,
                accessToken,
                refreshToken,
                user.role,
                firebaseUid
              ),
            type: "patients",
          },
          {
            call: () =>
              getDoctorList(
                organizationId,
                branchId,
                accessToken,
                refreshToken,
                firebaseUid
              ),
            type: "doctors",
          },
          {
            call: () =>
              getProducts(branchId, accessToken, refreshToken, firebaseUid),
            type: "products",
          },
          {
            call: () =>
              getAppointments(branchId, accessToken, refreshToken, firebaseUid),
            type: "appointments",
          },
        ];
      case "0":
        return [
          {
            call: () =>
              getPatients(
                user.userId,
                null,
                null,
                accessToken,
                refreshToken,
                user.role,
                firebaseUid
              ),
            type: "patients",
          },
          {
            call: () =>
              getBranchData(
                user.userId,
                accessToken,
                refreshToken,
                firebaseUid
              ),
            type: "branches",
          },
        ];
      case "2":
        return [
          {
            call: () =>
              getDoctorAppointments(
                user.userId,
                accessToken,
                refreshToken,
                firebaseUid
              ),
            type: "appointments",
          },
        ];
      default:
        return [];
    }
  };

  const fetchData = async () => {
    try {
      const apiCalls = buildApiCalls();
      apiCalls.forEach(async (apiCall) => {
        try {
          const result = await apiCall.call();
          switch (apiCall.type) {
            case "patients":
              reduxDispatch(setPatients(result));
              break;
            case "appointments":
              console.log(result);

              reduxDispatch(setAppointments(result));
              break;
            case "doctors":
              reduxDispatch(setDoctor(result));
              break;
            case "products":
              reduxDispatch(setProducts(result));
              break;
            case "branches":
              reduxDispatch(setBranch(result));
              console.log(result);

              const staffs = result.flatMap((branch) => branch.staffs || []);

              const uniqueStaffsMap = new Map();
              staffs.forEach((staff) => {
                if (!uniqueStaffsMap.has(staff.staffId)) {
                  uniqueStaffsMap.set(staff.staffId, staff);
                }
              });
              const uniqueStaffs = Array.from(uniqueStaffsMap.values());
              console.log(uniqueStaffs);
              reduxDispatch(setStaffs(uniqueStaffs));
              break;
            default:
              console.error("Unknown API call type: ", apiCall.type);
          }
        } catch (error) {
          console.error(`Failed to fetch ${apiCall.type}: `, error);
        }
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return { fetchData };
};
