import React, { useState, useMemo, useEffect } from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import RoleColor from "../../../assets/Util/RoleColor";

const DbGraph = ({ patients, sales }) => {
  const user = useSelector((state) => state.reducer.user.user);
  const [selectedFilter, setSelectedFilter] = useState("filter2");
  const [selectedDataType, setSelectedDataType] = useState(
    user.role === "3" ? "sales" : "patients"
  );

  const { graphColor } = RoleColor();

  useEffect(() => {
    if (["0", "1", "3"].includes(user.role)) {
      setSelectedDataType("sales");
    } else {
      setSelectedDataType("patients");
    }
  }, [user.role]);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleDataTypeChange = (event) => {
    setSelectedDataType(event.target.value);
  };

  const filteredData = useMemo(() => {
    const now = dayjs();
    const data = selectedDataType === "sales" ? sales : patients;

    if (selectedFilter === "filter1") {
      return data.filter((item) => dayjs(item.createdAt).isSame(now, "day"));
    } else if (selectedFilter === "filter2") {
      return data.filter((item) => dayjs(item.createdAt).isSame(now, "month"));
    } else if (selectedFilter === "filter3") {
      return data.filter((item) => dayjs(item.createdAt).isSame(now, "year"));
    }
    return data;
  }, [selectedDataType, selectedFilter, sales, patients]);

  const chartData = useMemo(() => {
    if (selectedFilter === "filter1") {
      const hourlyCounts = Array(24).fill(0);
      const hourlyTotals = Array(24).fill(0);

      filteredData.forEach((item) => {
        const hourIndex = dayjs(item.createdAt).hour();
        const total =
          selectedDataType === "sales"
            ? item.purchaseDetails.reduce(
                (sum, detail) => sum + detail.totalAmount,
                0
              )
            : 1;

        hourlyCounts[hourIndex] += 1;
        hourlyTotals[hourIndex] += total;
      });

      return selectedDataType === "sales" ? hourlyTotals : hourlyCounts;
    } else if (selectedFilter === "filter2") {
      const daysInMonth = dayjs().daysInMonth();
      const dailyCounts = Array(daysInMonth).fill(0);
      const dailyTotals = Array(daysInMonth).fill(0);

      filteredData.forEach((item) => {
        const dayIndex = dayjs(item.createdAt).date() - 1;
        const total =
          selectedDataType === "sales"
            ? item.purchaseDetails.reduce(
                (sum, detail) => sum + detail.totalAmount,
                0
              )
            : 1;

        dailyCounts[dayIndex] += 1;
        dailyTotals[dayIndex] += total;
      });

      return selectedDataType === "sales" ? dailyTotals : dailyCounts;
    } else {
      const monthlyCounts = Array(12).fill(0);
      const monthlyTotals = Array(12).fill(0);

      filteredData.forEach((item) => {
        const monthIndex = dayjs(item.createdAt).month();
        const total =
          selectedDataType === "sales"
            ? item.purchaseDetails.reduce(
                (sum, detail) => sum + detail.totalAmount,
                0
              )
            : 1;

        monthlyCounts[monthIndex] += 1;
        monthlyTotals[monthIndex] += total;
      });

      return selectedDataType === "sales" ? monthlyTotals : monthlyCounts;
    }
  }, [filteredData, selectedFilter, selectedDataType]);

  const xAxisCategories = useMemo(() => {
    if (selectedFilter === "filter1") {
      return Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    } else if (selectedFilter === "filter2") {
      const daysInMonth = dayjs().daysInMonth();
      return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    } else {
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
      id: "inventory-patient-graph",
      toolbar: { show: false },
    },
    xaxis: { categories: xAxisCategories },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
    colors: [graphColor],
    markers: { size: 0 },
  };

  const chartSeries = [
    {
      name: selectedDataType === "sales" ? "Sales" : "Patients",
      data: chartData,
    },
  ];

  const graphHeight = [user.role !== "2" ? "280" : "420"];
  return (
    <div
      className={`text-p-sm md:text-p-rg text-f-dark rounded-lg bg-white p-4 border ${
        user.role !== "2" ? "h-[360px]" : "h-[500px]"
      }`}
    >
      <header className="flex justify-between h-fit w-full items-center mb-4">
        <h1 className="font-medium text-nowrap text-c-secondary">
          {user.role !== "2"
            ? selectedDataType === "sales"
              ? "| Inventory Sales Graph"
              : "| Patient Graph"
            : "| Patient Graph"}
        </h1>
        <div className="flex gap-2">
          {user.role !== "2" && (
            <select
              value={selectedDataType}
              onChange={handleDataTypeChange}
              className="hover:cursor-pointer focus:outline-none bg-bg-sub p-1 rounded-md border border-f-gray"
            >
              <option value="sales">Sales</option>
              <option value="patients">Patients</option>
            </select>
          )}
          <select
            value={selectedFilter}
            onChange={handleFilterChange}
            className="hover:cursor-pointer focus:outline-none bg-bg-sub p-1 rounded-md border border-f-gray"
          >
            <option value="filter1">Today</option>
            <option value="filter2">This Month</option>
            <option value="filter3">This Year</option>
          </select>
        </div>
      </header>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={graphHeight}
      />
    </div>
  );
};

export default DbGraph;
