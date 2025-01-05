import React, { useState, useEffect, Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import BannerBg from "../../../assets/Image/BannerBg.png";
import { FiCalendar } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import BgCard1 from "../../../assets/Image/BgCard1.png";
import BgCard2 from "../../../assets/Image/BgCard2.png";
import BgCard3 from "../../../assets/Image/BgCard3.png";
import BgCard4 from "../../../assets/Image/BgCard4.png";

const DbCard = lazy(() => import("./DbCard"));
const DbGraph = lazy(() => import("./DbGraph"));
const DbAppointment = lazy(() => import("./DbAppointment"));
const DbTable = lazy(() => import("./DbTable"));
const DbProduct = lazy(() => import("./DbProduct"));

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const OrgDashboard = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const products = useSelector((state) => state.reducer.inventory.products);
  const sales = useSelector((state) => state.reducer.inventory.purchases);
  const services = useSelector((state) => state.reducer.inventory.services);
  const branch = useSelector((state) => state.reducer.branch.branch);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [greeting, setGreeting] = useState("");

  const filteredPatients = selectedBranch
    ? patients.filter((patient) => patient.branchId === selectedBranch)
    : patients;

  const filteredSales = selectedBranch
    ? sales.filter((sale) => sale.branchId === selectedBranch)
    : sales;

  const filteredProducts = selectedBranch
    ? products
        .filter((product) => product.isDeleted === false)
        .filter((product) => product.branchId === selectedBranch)
    : products.filter((product) => product.isDeleted === false);

  const filteredServices = selectedBranch
    ? services.filter((service) => service.branchId === selectedBranch)
    : services;

  const patientCount = filteredPatients.length;
  const productCount = filteredProducts.length;

  const combinedSalesAndServices = [
    ...(filteredSales || []),
    ...(filteredServices || []),
  ];

  const filterSalesByMonth = (data, monthOffset = 0) => {
    const now = new Date();
    const targetMonth = new Date(
      now.getFullYear(),
      now.getMonth() + monthOffset,
      1
    );
    const nextMonth = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth() + 1,
      1
    );

    return data.filter((item) => {
      if (!item || !item.createdAt) return false;
      const itemDate = new Date(item.createdAt);
      return itemDate >= targetMonth && itemDate < nextMonth;
    });
  };

  const currentMonthSales = filterSalesByMonth(combinedSalesAndServices, 0);
  const previousMonthSales = filterSalesByMonth(combinedSalesAndServices, -1);

  const getTotalSales = (data) => {
    return data.reduce((total, item) => {
      if (!item) return total;

      if (item.purchaseDetails && Array.isArray(item.purchaseDetails)) {
        const itemTotal = item.purchaseDetails.reduce((sum, detail) => {
          return sum + (detail.totalAmount || 0);
        }, 0);
        return total + itemTotal;
      } else if (item.service_price) {
        return total + parseFloat(item.service_price || 0);
      }

      return total;
    }, 0);
  };

  const currentMonthTotalSales = getTotalSales(currentMonthSales);
  const previousMonthTotalSales = getTotalSales(previousMonthSales);

  const calculatePercentageChange = (currentValue, previousValue) => {
    if (previousValue === 0) {
      return currentValue > 0 ? "+∞%" : "0%";
    }
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const totalSales = getTotalSales(combinedSalesAndServices);
  const salesChange = calculatePercentageChange(
    currentMonthTotalSales,
    previousMonthTotalSales
  );

  const dummyData = [
    {
      title: "Gross Income",
      value: `₱ ${totalSales}`,
      percentageChange: salesChange,
    },
    { title: "Total Patients", value: patientCount, percentageChange: "+4.3%" },
    { title: "Total Product", value: productCount, percentageChange: "+4.3%" },
  ];

  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });

  const updateDateTimeAndGreeting = () => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = formatTime(now.toTimeString().split(" ")[0]);
    setCurrentDateTime({ date: formattedDate, time: formattedTime });

    const currentHour = now.getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  };

  useEffect(() => {
    updateDateTimeAndGreeting();
    const intervalId = setInterval(updateDateTimeAndGreeting, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const cardColor = [
    "bg-[#FDF5E4]",
    "bg-[#E5FDE4]",
    "bg-[#E4ECFD]",
    "bg-[#FDE6E4]",
  ];

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-5 font-Poppins">
        <div
          className="w-full lg:w-3/5 h-fit md:h-[400px] p-5 bg-cover bg-no-repeat bg-center bg-c-primary rounded-lg justify-between flex flex-col shadow-sm"
          style={{ backgroundImage: `url(${BannerBg})` }}
        >
          <div className="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-0">
            <article className="text-f-light text-p-lg">
              <h6>{greeting}</h6>
              <h1 className="lg:text-h-h6 2xl:text-h-h3 font-semibold">
                {`Welcome Back, ${
                  user.role !== "3"
                    ? user.role === "0"
                      ? user.organization
                      : user.name
                    : `Secretary ${user.first_name}`
                }`}
              </h1>
            </article>
            <div className="flex gap-5 font-Poppins">
              {user.role === "0" && (
                <div
                  className="flex flex-col justify-between bg-white p-4 h-fit w-fit gap-4 rounded-lg border"
                  style={{ backgroundColor: "rgba(169, 182, 178, 0.2)" }}
                >
                  <div className="text-p-sc md:text-p-sm flex justify-between gap-2  text-f-light">
                    <p className="flex gap-1 items-center">
                      <FiCalendar /> {formatDate(currentDateTime.date)}
                    </p>
                    <p className="flex gap-1 items-center">
                      <FiClock />
                      {currentDateTime.time}
                    </p>
                  </div>
                  <select
                    className="hover:cursor-pointer h-fit focus:outline-none bg-bg-sub border px-2 py-2 rounded-md text-p-sm font-medium  text-f-dark text-wrap"
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    disabled={!branch || branch.length === 0}
                  >
                    <option value="">
                      {!branch ? "Loading branches..." : "All Branches"}
                    </option>
                    {branch &&
                      branch.map((item, key) => (
                        <option key={key} value={item.branchId}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <p className="text-f-light text-p-rg mb-4">
              Here’s an overview of your clinic’s performance today. Wishing you
              a productive day!
            </p>
            <section className="flex w-full gap-5 overflow-x-auto">
              {dummyData.map((data, index) =>
                data.title === "Number of Staffs" &&
                user.role === "3" ? null : (
                  <Suspense
                    fallback={<div>Loading cards...</div>}
                    key={data.title}
                  >
                    <DbCard
                      title={data.title}
                      value={data.value}
                      percentageChange={data.percentageChange}
                      color={cardColor[index % cardColor.length] || "#000000"}
                      bg={
                        index === 0
                          ? BgCard1
                          : index === 1
                          ? BgCard2
                          : index === 2
                          ? BgCard3
                          : BgCard4
                      }
                    />
                  </Suspense>
                )
              )}
            </section>
          </div>
        </div>
        <div className="w-full lg:w-2/5">
          <Suspense fallback={<div>Loading table...</div>}>
            <DbTable role={user.role} />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full h-full gap-5 font-Poppins">
        <div className="w-full lg:w-3/5">
          <Suspense fallback={<div>Loading graph...</div>}>
            <DbGraph sales={filteredSales} />
          </Suspense>
        </div>
        <div className="w-full lg:w-2/5 flex flex-col md:flex-row gap-5">
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<div>Loading products...</div>}>
              <DbProduct filteredSales={filteredSales} />
            </Suspense>
          </div>
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<div>Loading appointments...</div>}>
              <DbAppointment />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrgDashboard;
