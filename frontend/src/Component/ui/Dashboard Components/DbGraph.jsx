import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useSelector } from "react-redux";

dayjs.extend(isBetween);

const DbGraph = ({ sales }) => {
  const user = useSelector((state) => state.reducer.user.user);
  const branches = useSelector((state) => state.reducer.branch.branch);
  const [selectedFilter, setSelectedFilter] = useState("last7Days");
  const [customRange, setCustomRange] = useState({ start: null, end: null });

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
    if (event.target.value !== "custom") {
      setCustomRange({ start: null, end: null });
    }
  };

  const handleCustomRangeChange = (start, end) => {
    setCustomRange({ start, end });
    setSelectedFilter("custom");
  };

  const filteredData = useMemo(() => {
    const now = dayjs();

    if (!sales) return [];

    switch (selectedFilter) {
      case "last7Days":
        return sales.filter((item) =>
          dayjs(item.createdAt).isAfter(now.subtract(7, "day"))
        );
      case "last30Days":
        return sales.filter((item) =>
          dayjs(item.createdAt).isAfter(now.subtract(30, "day"))
        );
      case "custom":
        if (customRange.start && customRange.end) {
          const start = dayjs(customRange.start);
          const end = dayjs(customRange.end);
          return sales.filter((item) =>
            dayjs(item.createdAt).isBetween(start, end, "day", "[]")
          );
        }
        return [];
      default:
        return sales;
    }
  }, [selectedFilter, sales, customRange]);

  const groupedDataByBranch = useMemo(() => {
    const grouped = {};
    if (!branches || !filteredData || !user) {
      return grouped;
    }

    if (user.role === "0") {
      branches.forEach((branch) => {
        grouped[branch.branchId] = {};
      });

      filteredData.forEach((item) => {
        const date = dayjs(item.createdAt).format("YYYY-MM-DD");
        const branchId = item.branchId;
        const total = item.purchaseDetails.reduce(
          (sum, detail) => sum + detail.totalAmount,
          0
        );

        if (grouped[branchId]) {
          grouped[branchId][date] = (grouped[branchId][date] || 0) + total;
        }
      });
    } else {
      filteredData.forEach((item) => {
        const date = dayjs(item.createdAt).format("YYYY-MM-DD");
        const branchId =
          user.role === "3" ? user.branches?.[0]?.branchId : user.branchId;
        const total = item.purchaseDetails.reduce(
          (sum, detail) => sum + detail.totalAmount,
          0
        );

        if (!grouped[branchId]) {
          grouped[branchId] = {};
        }

        grouped[branchId][date] = (grouped[branchId][date] || 0) + total;
      });
    }

    return grouped;
  }, [filteredData, branches, user]);

  const chartSeries = useMemo(() => {
    if (user.role === "0" && branches?.length) {
      return branches.map((branch) => {
        const branchData = groupedDataByBranch[branch.branchId] || {};

        if (!branchData || Object.keys(branchData).length === 0) {
          console.warn("No branch data found for the current user or branch.");
        }
        const sortedDates = Object.keys(branchData).sort((a, b) =>
          dayjs(a).isBefore(b) ? -1 : 1
        );

        return {
          name: branch.name,
          data: sortedDates.map((date) => branchData[date] || 0),
        };
      });
    } else {
      const branchData =
        user.role === "3"
          ? groupedDataByBranch[user.branches?.[0]?.branchId] || {}
          : groupedDataByBranch[user.branchId] || {};

      if (!branchData || Object.keys(branchData).length === 0) {
        console.warn("No branch data found for the current user or branch.");
      }

      const sortedDates = Object.keys(branchData).sort((a, b) =>
        dayjs(a).isBefore(b) ? -1 : 1
      );

      return [
        {
          name: "Your Branch",
          data: sortedDates.map((date) => branchData[date] || 0),
        },
      ];
    }
  }, [groupedDataByBranch]);

  const xAxisCategories = useMemo(() => {
    const uniqueDates = filteredData.map((item) =>
      dayjs(item.createdAt).format("YYYY-MM-DD")
    );
    return Array.from(new Set(uniqueDates)).sort((a, b) =>
      dayjs(a).isBefore(b) ? -1 : 1
    );
  }, [filteredData]);

  const chartOptions = {
    chart: {
      id: "branch-sales-graph",
      toolbar: { show: false },
    },
    xaxis: { categories: xAxisCategories },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
    colors:
      branches && branches.length >= 1
        ? branches.map(
            (_, i) => `hsl(${(i * 360) / branches.length}, 70%, 50%)`
          )
        : ["hsl(0, 70%, 50%)"],

    markers: { size: 0 },
  };

  const graphHeight = user.role !== "2" ? "280" : "420";

  return (
    <div
      className={`text-p-sm md:text-p-rg text-f-dark rounded-lg bg-white p-4 border ${
        user.role !== "2" ? "h-[360px]" : "h-[500px]"
      }`}
    >
      <header className="flex justify-between h-fit w-full items-center mb-4">
        <h1 className="font-medium text-nowrap text-c-secondary">
          | Sales Summary
        </h1>
        <div className="flex gap-2">
          <select
            value={selectedFilter}
            onChange={handleFilterChange}
            className="hover:cursor-pointer focus:outline-none bg-bg-sb p-2 rounded-md shadow-md text-p-sm font-medium"
          >
            <option value="last7Days">Last 7 Days</option>
            <option value="last30Days">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          {selectedFilter === "custom" && (
            <div className="flex gap-2">
              <input
                type="date"
                value={customRange.start || ""}
                onChange={(e) =>
                  handleCustomRangeChange(e.target.value, customRange.end)
                }
                className="hover:cursor-pointer focus:outline-none bg-bg-sb p-2 rounded-md shadow-md text-p-sm font-medium"
              />
              <input
                type="date"
                value={customRange.end || ""}
                onChange={(e) =>
                  handleCustomRangeChange(customRange.start, e.target.value)
                }
                className="hover:cursor-pointer focus:outline-none bg-bg-sb p-2 rounded-md shadow-md text-p-sm font-medium"
              />
            </div>
          )}
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
