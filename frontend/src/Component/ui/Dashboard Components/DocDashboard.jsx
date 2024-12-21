import React, { Suspense, lazy, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BgCard1 from "../../../assets/Image/BgCard1.png";
import BgCard2 from "../../../assets/Image/BgCard2.png";
import BgCard3 from "../../../assets/Image/BgCard3.png";
import BannerBg from "../../../assets/Image/BannerBg.png";

// Use lazy loading for the components
const DbCard = lazy(() => import("./DbCard"));
const DbGraph = lazy(() => import("./DbGraph"));
const DbAppointment = lazy(() => import("./DbAppointment"));
const DbTable = lazy(() => import("./DbTable"));

const DocDashboard = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const visits = useSelector((state) => state.reducer.visit.visits);

  const patientCount = patients.length;
  const visitCount = visits.length;
  const [greeting, setGreeting] = useState("");
  const [isGraphCollapsed, setIsGraphCollapsed] = useState(false);

  const filterPatientsByMonth = (data, monthOffset = 0) => {
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

  const countPatients = (data) => {
    return data.length;
  };

  const calculatePercentageChange = (currentValue, previousValue) => {
    if (previousValue === 0) {
      return currentValue > 0 ? "+∞%" : "0%";
    }
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const currentMonthPatients = filterPatientsByMonth(patients, 0);
  const previousMonthPatients = filterPatientsByMonth(patients, -1);

  const currentMonthPatientCount = countPatients(currentMonthPatients);
  const previousMonthPatientCount = countPatients(previousMonthPatients);

  const totalPatientChange = calculatePercentageChange(
    patientCount,
    previousMonthPatientCount
  );

  const filterVisitsByDate = (data, targetDate) => {
    const startOfDay = new Date(
      targetDate.toISOString().split("T")[0] // Get YYYY-MM-DD in UTC
    ).getTime(); // Start of day UTC

    const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1; // End of day UTC

    return data.filter((item) => {
      const itemDate = new Date(item.date).getTime(); // Parse visit date
      return itemDate >= startOfDay && itemDate <= endOfDay;
    });
  };

  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  };

  const today = new Date();
  const yesterday = getYesterdayDate();

  const todayVisits = filterVisitsByDate(visits, today);
  const yesterdayVisits = filterVisitsByDate(visits, yesterday);

  const todayVisitCount = todayVisits.length;
  const yesterdayVisitCount = yesterdayVisits.length;
  console.log(todayVisitCount);

  console.log(yesterdayVisitCount);

  const dummyData = [
    {
      title: "Number of Visit Today",
      value: todayVisitCount || "0",
      percentageChange: calculatePercentageChange(
        todayVisitCount,
        yesterdayVisitCount
      ),
    },
    {
      title: "Total Patients this Month",
      value: currentMonthPatientCount,
      percentageChange: calculatePercentageChange(
        currentMonthPatientCount,
        previousMonthPatientCount
      ),
    },
    {
      title: "Total Patients",
      value: patientCount,
      percentageChange: totalPatientChange,
    },
  ];

  const cardColor = ["bg-[#FDF5E4]", "bg-[#E5FDE4]", "bg-[#E4ECFD]"];

  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });

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

  // Inside useEffect to update time and greeting
  useEffect(() => {
    updateDateTimeAndGreeting();
    const intervalId = setInterval(updateDateTimeAndGreeting, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCollapseToggle = () => {
    setIsGraphCollapsed((prevState) => !prevState);
  };

  return (
    <>
      <div className="w-full flex flex-col md:flex-row gap-5 font-Poppins">
        <div
          className="w-full md:w-2/3 h-fit md:h-[360px] p-5 bg-cover bg-no-repeat bg-center bg-c-primary rounded-lg justify-between flex flex-col shadow-sm"
          style={{ backgroundImage: `url(${BannerBg})` }}
        >
          <div className="flex w-full justify-between">
            <article className="text-f-light text-p-lg">
              <h6>{greeting}</h6>
              <h1 className="lg:text-h-h6 2xl:text-h-h3 font-semibold">
                {`Welcome Back, Dr. ${user.first_name}`}
              </h1>
            </article>
          </div>
          <div className="w-full">
            <p className="text-f-light text-p-rg mb-4">
              Here’s an overview of your clinic’s performance today. Wishing you
              a productive day!
            </p>
            <section className="flex w-full gap-5">
              {dummyData.map((data, index) => {
                if (data.title === "Number of Staffs" && user.role === "3")
                  return null;
                return (
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
                        index === 0 ? BgCard1 : index === 1 ? BgCard2 : BgCard3
                      }
                    />
                  </Suspense>
                );
              })}
            </section>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <Suspense fallback={<div>Loading appointments...</div>}>
            <DbAppointment />
          </Suspense>
        </div>
      </div>
      <div className="w-full flex flex-col-reverse md:flex-row gap-6">
        <div
          className={`w-full transition-all duration-500 ease-in-out ${
            isGraphCollapsed ? "md:w-8" : "md:w-1/2"
          } relative`}
        >
          <div
            onClick={handleCollapseToggle}
            className="w-8 h-8 rounded-full bg-f-light border shadow-sm hidden md:flex items-center justify-center absolute -right-3 top-1/2 cursor-pointer"
          >
            {isGraphCollapsed ? ">" : "<"}
          </div>
          <Suspense fallback={<div>Loading graph...</div>}>
            {/* <DbGraph
              patients={patients}
              sales={user.role === "doctor" ? null : null}
              selectedDataType={user.role === "2" ? "patients" : undefined}
              isCollapsed={isGraphCollapsed}
            /> */}
          </Suspense>
        </div>
        <div
          className={`w-full transition-all duration-500 ease-in-out ${
            isGraphCollapsed ? "md:w-full" : "md:w-1/2"
          }`}
        >
          <Suspense fallback={<div>Loading table...</div>}>
            <DbTable role={user.role} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default DocDashboard;
