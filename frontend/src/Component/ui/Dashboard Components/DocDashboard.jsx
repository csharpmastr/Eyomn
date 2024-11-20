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
  const patients = useSelector((state) => state.reducer.patient.patients);
  const user = useSelector((state) => state.reducer.user.user);
  const patientCount = patients.length;
  const [greeting, setGreeting] = useState("");

  const dummyData = [
    {
      title: "Number of Visit Today",
      value: "8",
      percentageChange: "+4.3%",
    },
    {
      title: "Total Patients this Month",
      value: "22",
      percentageChange: "+4.3%",
    },
    { title: "Total Patients", value: patientCount, percentageChange: "+4.3%" },
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
                          : index === 2 && BgCard3
                      }
                    />
                  </Suspense>
                )
              )}
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
        <div className="w-full md:w-1/2">
          <Suspense fallback={<div>Loading graph...</div>}>
            <DbGraph
              patients={patients}
              sales={user.role === "doctor" ? null : null}
              selectedDataType={user.role === "2" ? "patients" : undefined}
            />
          </Suspense>
        </div>
        <div className="w-full md:w-1/2">
          <Suspense fallback={<div>Loading table...</div>}>
            <DbTable />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default DocDashboard;
