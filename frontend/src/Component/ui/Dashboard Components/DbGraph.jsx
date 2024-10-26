import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const DbGraph = ({ patients }) => {
  const [selectedFilter, setSelectedFilter] = useState("filter1");

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const filteredPatients = useMemo(() => {
    const now = dayjs();

    if (selectedFilter === "filter1") {
      return patients.filter((patient) =>
        dayjs(patient.createdAt).isSame(now, "day")
      );
    } else if (selectedFilter === "filter2") {
      return patients.filter((patient) =>
        dayjs(patient.createdAt).isSame(now, "month")
      );
    } else if (selectedFilter === "filter3") {
      return patients.filter((patient) =>
        dayjs(patient.createdAt).isSame(now, "year")
      );
    }
    return patients;
  }, [patients, selectedFilter]);

  const chartData = useMemo(() => {
    if (selectedFilter === "filter1") {
      const hourlyCounts = Array(24).fill(0);

      filteredPatients.forEach((patient) => {
        const hourIndex = dayjs(patient.createdAt).hour();
        hourlyCounts[hourIndex] += 1;
      });

      return hourlyCounts;
    } else if (selectedFilter === "filter2") {
      const daysInMonth = dayjs().daysInMonth();
      const dailyCounts = Array(daysInMonth).fill(0);

      filteredPatients.forEach((patient) => {
        const dayIndex = dayjs(patient.createdAt).date() - 1;
        dailyCounts[dayIndex] += 1;
      });

      return dailyCounts;
    } else {
      const monthlyCounts = Array(12).fill(0);

      filteredPatients.forEach((patient) => {
        const monthIndex = dayjs(patient.createdAt).month();
        monthlyCounts[monthIndex] += 1;
      });

      return monthlyCounts;
    }
  }, [filteredPatients, selectedFilter]);

  const xAxisCategories = useMemo(() => {
    //today
    if (selectedFilter === "filter1") {
      return Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    } else if (selectedFilter === "filter2") {
      //This month
      const daysInMonth = dayjs().daysInMonth();
      return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    } else {
      //this year
      return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    }
  }, [selectedFilter]);

  const chartOptions = {
    chart: {
      id: "patient-inventory-graph",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: xAxisCategories,
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#3B82F6"],
    markers: {
      size: 4,
    },
  };

  const chartSeries = [
    {
      name: "Patients",
      data: chartData,
    },
  ];

  return (
    <div className="text-p-rg h-[500px] text-c-secondary rounded-lg bg-white p-4 border">
      <header className="flex justify-between h-fit w-full items-center mb-4">
        <h1 className="font-semibold">| Inventory / Patient Graph</h1>
        <select
          value={selectedFilter}
          onChange={handleFilterChange}
          className="hover:cursor-pointer focus:outline-none bg-bg-mc p-1 rounded-md border border-f-gray"
        >
          <option value="filter1">Today</option>
          <option value="filter2">This Month</option>
          <option value="filter3">This Year</option>
        </select>
      </header>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={420}
      />
    </div>
  );
};

export default DbGraph;
