import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";

const DbGraph = ({ patients, sales }) => {
  const [selectedFilter, setSelectedFilter] = useState("filter1");
  const [selectedDataType, setSelectedDataType] = useState("sales");

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
    colors: ["#3B82F6"],
    markers: { size: 0 },
  };

  const chartSeries = [
    {
      name: selectedDataType === "sales" ? "Sales" : "Patients",
      data: chartData,
    },
  ];

  return (
    <div className="text-p-rg h-[500px] text-c-secondary rounded-lg bg-white p-4 border">
      <header className="flex justify-between h-fit w-full items-center mb-4">
        <h1 className="font-semibold">| Inventory / Patient Graph</h1>
        <div className="flex gap-2">
          <select
            value={selectedDataType}
            onChange={handleDataTypeChange}
            className="hover:cursor-pointer focus:outline-none bg-bg-mc p-1 rounded-md border border-f-gray"
          >
            <option value="sales">Sales</option>
            <option value="patients">Patients</option>
          </select>
          <select
            value={selectedFilter}
            onChange={handleFilterChange}
            className="hover:cursor-pointer focus:outline-none bg-bg-mc p-1 rounded-md border border-f-gray"
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
        height={420}
      />
    </div>
  );
};

export default DbGraph;
