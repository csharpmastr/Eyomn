import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { getPatients, getPatientsByDoctor } from "../Service/PatientService";
import { useDispatch, useSelector } from "react-redux";
import { setPatients } from "../Slice/PatientSlice";
import { setDoctor } from "../Slice/doctorSlice";
import { setBranch } from "../Slice/BranchSlice";
import { setStaffs } from "../Slice/StaffSlice";
import {
  getProducts,
  getProductsSales,
  getPurchases,
} from "../Service/InventoryService";
import { setProducts, setPurchases } from "../Slice/InventorySlice";
import {
  getAppointments,
  getDoctorAppointments,
} from "../Service/AppointmentService";
import { setAppointments } from "../Slice/AppointmentSlice";
import {
  getBranchData,
  getBranchName,
  getDoctorList,
  getStaffs,
} from "../Service/organizationService";

export const useFetchData = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const reduxDispatch = useDispatch();
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  const buildApiCalls = () => {
    let organizationId = user.role === "0" ? user.userId : user.organizationId;
    let staffId = user.userId || user.staffId;

    let branchId =
      (user.branches &&
        user.branches.length > 0 &&
        user.branches[0].branchId) ||
      user.userId ||
      null;
    let firebaseUid = user.firebaseUid;

    switch (user.role) {
      case "1":
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
          {
            call: () =>
              getPurchases(branchId, firebaseUid, accessToken, refreshToken),
            type: "purchases",
          },
          {
            call: () =>
              getStaffs(
                organizationId,
                branchId,
                accessToken,
                refreshToken,
                firebaseUid
              ),
            type: "staffs",
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
          {
            call: () =>
              getProductsSales(
                organizationId,
                firebaseUid,
                accessToken,
                refreshToken
              ),
            type: "inventory",
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
              getPatientsByDoctor(
                organizationId,
                staffId,
                firebaseUid,
                accessToken,
                refreshToken
              ),
            type: "patients",
          },
          {
            call: () =>
              getBranchName(
                user.userId,
                firebaseUid,
                accessToken,
                refreshToken
              ),
            type: "branch",
          },
        ];
      default:
        return [];
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiCalls = buildApiCalls();
      await Promise.all(
        apiCalls.map(async (apiCall) => {
          try {
            const result = await apiCall.call();
            switch (apiCall.type) {
              case "patients":
                reduxDispatch(setPatients(result));
                break;
              case "appointments":
                reduxDispatch(setAppointments(result));
                break;
              case "doctors":
                reduxDispatch(setDoctor(result));
                break;
              case "products":
                reduxDispatch(setProducts(result));
                break;
              case "purchases":
                reduxDispatch(setPurchases(result));
                break;
              case "staffs":
                reduxDispatch(setStaffs(result));
                break;
              case "branch":
                reduxDispatch(setBranch(result));
                break;
              case "inventory":
                let allPurchases = [];
                let allProducts = [];
                Object.entries(result).forEach(
                  ([branchId, { purchases, products }]) => {
                    const formattedPurchases = purchases.map((purchase) => ({
                      ...purchase,
                      branchId,
                    }));
                    allPurchases = [...allPurchases, ...formattedPurchases];

                    const formattedProducts = products.map((product) => ({
                      ...product,
                      branchId,
                    }));
                    allProducts = [...allProducts, ...formattedProducts];
                  }
                );
                reduxDispatch(setPurchases(allPurchases));
                reduxDispatch(setProducts(allProducts));
                break;
              case "branches":
                reduxDispatch(setBranch(result));
                const staffs = result.flatMap((branch) => branch.staffs || []);
                const uniqueStaffsMap = new Map();
                staffs.forEach((staff) => {
                  if (!uniqueStaffsMap.has(staff.staffId)) {
                    uniqueStaffsMap.set(staff.staffId, staff);
                  }
                });
                const appointments = result.flatMap((branch) =>
                  (branch.appointments || []).map((appointment) => ({
                    ...appointment,
                    branchId: branch.branchId,
                  }))
                );
                reduxDispatch(setAppointments(appointments));
                reduxDispatch(setStaffs(Array.from(uniqueStaffsMap.values())));
                break;
              default:
                console.error("Unknown API call type: ", apiCall.type);
            }
          } catch (error) {
            console.error(`Failed to fetch ${apiCall.type}: `, error);
          }
        })
      );
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, loading };
};
