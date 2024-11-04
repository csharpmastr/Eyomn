import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";

const DbProduct = ({ filteredSales }) => {
  const products = useSelector((state) => state.reducer.inventory.products);

  const productSales = useMemo(() => {
    const productTotals = {};

    // Calculate total sales per product from filtered sales
    filteredSales.forEach((sale) => {
      sale.purchaseDetails.forEach((detail) => {
        const { productId, totalAmount } = detail;
        if (!productTotals[productId]) {
          productTotals[productId] = 0;
        }
        productTotals[productId] += totalAmount;
      });
    });

    // Get top 3 products sorted by total sales
    const sortedProducts = Object.entries(productTotals)
      .map(([productId, total]) => ({ productId, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    const topProducts = sortedProducts.map(({ productId, total }) => {
      const product = products.find((prod) => prod.productId === productId);
      return {
        name: product ? product.product_name : "Unknown Product",
        total,
      };
    });

    return topProducts;
  }, [filteredSales, products]);

  const chartData = {
    series: [
      {
        name: "Sales",
        data: productSales.map((product) => product.total),
      },
    ],
    categories: productSales.map((product) => product.name),
  };

  const chartOptions = {
    chart: {
      toolbar: { show: false },
      width: "100%",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
      },
    },
    colors: ["#A2A98F", "#7A9E9F", "#A0A0A0"],
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Products",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#26282a",
        },
      },
    },
    yaxis: {
      title: {
        text: "Total Sales",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#26282a",
        },
      },
    },
    dataLabels: {
      enabled: true,
      fontSize: "18px",
      fontFamily: "Helvetica, Arial, sans-serif",
      fontWeight: "bold",
    },
  };

  return (
    <div className="rounded-lg h-[500px] bg-white text-f-dark font-poppins border text-p-rg py-4 overflow-clip shadow-sm p-4">
      <header className="flex justify-between px-4 pt-2 mb-4 text-c-secondary">
        <h1 className="font-medium text-nowrap">| Top Selling Products</h1>
      </header>
      <div className="w-full">
        <Chart
          type="bar"
          height={420}
          width="100%"
          series={chartData.series}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default DbProduct;
