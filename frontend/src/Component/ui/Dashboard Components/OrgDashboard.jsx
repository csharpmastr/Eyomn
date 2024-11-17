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

const OrgDashboard = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const products = useSelector((state) => state.reducer.inventory.products);
  const staffs = useSelector((state) => state.reducer.staff.staffs);
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
  const staffCount = staffs.length;

  const combinedSalesAndServices = [...filteredSales, ...filteredServices];

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
      const itemDate = new Date(item.createdAt);
      return itemDate >= targetMonth && itemDate < nextMonth;
    });
  };

  const currentMonthSales = filterSalesByMonth(combinedSalesAndServices, 0);
  const previousMonthSales = filterSalesByMonth(combinedSalesAndServices, -1);

  const getTotalSales = (data) => {
    return data.reduce((total, item) => {
      if (item.purchaseDetails) {
        const itemTotal = item.purchaseDetails.reduce((sum, detail) => {
          return sum + detail.totalAmount;
        }, 0);
        return total + itemTotal;
      } else if (item.service_price) {
        return total + parseFloat(item.service_price);
      }
      return total;
    }, 0);
  };

  const currentMonthTotalSales = getTotalSales(currentMonthSales);
  const previousMonthTotalSales = getTotalSales(previousMonthSales);
  console.log(currentMonthTotalSales);

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
    { title: "Number of Staffs", value: staffCount, percentageChange: "+4.3%" },
  ];

  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });

  const formatDateTime = () => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0];
    setCurrentDateTime({ date: formattedDate, time: formattedTime });
  };

  useEffect(() => {
    formatDateTime();
    const intervalId = setInterval(formatDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const cardColor = [
    "bg-[#FDF5E4]",
    "bg-[#E5FDE4]",
    "bg-[#E4ECFD]",
    "bg-[#FDE6E4]",
  ];

  const updateDateTimeAndGreeting = () => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0];
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

  return (
    <>
      <div className="w-full flex gap-5 font-Poppins">
        <div
          className="w-2/3 h-[360px] p-5 bg-cover bg-no-repeat bg-center bg-c-primary rounded-lg justify-between flex flex-col shadow-sm"
          style={{ backgroundImage: `url(${BannerBg})` }}
        >
          <div className="flex w-full justify-between">
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
                <div className="flex flex-col justify-between bg-white p-4 h-fit w-fit  gap-4 rounded-lg text-f-dark bg-[rgba(169,182,178,0.20)]  border">
                  <div className="text-p-sc md:text-p-sm flex justify-between">
                    <p className="flex gap-1 items-center">
                      <FiCalendar /> {currentDateTime.date}
                    </p>
                    <p className="flex gap-1 items-center">
                      <FiClock />
                      {currentDateTime.time}
                    </p>
                  </div>
                  <select
                    className="hover:cursor-pointer h-fit focus:outline-none bg-bg-sub border border-f-gray px-2 py-2 rounded-md text-p-sm font-medium text-wrap"
                    onChange={(e) => setSelectedBranch(e.target.value)}
                  >
                    <option value="">All Branches</option>
                    {branch.map((item, key) => (
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
            <section className="flex w-full gap-5">
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
        <div className="w-1/3">
          <Suspense fallback={<div>Loading appointments...</div>}>
            <DbAppointment />
          </Suspense>
        </div>
      </div>
      <div className="flex w-full h-full gap-5 font-Poppins">
        <div className="w-2/3">
          <Suspense fallback={<div>Loading graph...</div>}>
            <DbGraph patients={filteredPatients} sales={filteredSales} />
          </Suspense>
        </div>
        <div className="w-1/3">
          <Suspense fallback={<div>Loading products...</div>}>
            <DbProduct filteredSales={filteredSales} />
          </Suspense>
        </div>
      </div>
      <div className="w-full">
        <Suspense fallback={<div>Loading table...</div>}>
          <DbTable />
        </Suspense>
      </div>
    </>
  );
};

export default OrgDashboard;
