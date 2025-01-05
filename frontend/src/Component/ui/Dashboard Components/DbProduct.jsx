import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import RoleColor from "../../../assets/Util/RoleColor";

const DbProduct = ({ filteredSales }) => {
  const products = useSelector((state) => state.reducer.inventory.products);

  const { barColor } = RoleColor();

  const productSales = useMemo(() => {
    const productTotals = {};

    filteredSales.forEach((sale) => {
      sale.purchaseDetails.forEach((detail) => {
        const { productId, totalAmount } = detail;
        if (!productTotals[productId]) {
          productTotals[productId] = 0;
        }
        productTotals[productId] += totalAmount;
      });
    });

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
    series: productSales.map((product) => product.total),
    categories: productSales.map((product) => product.name),
  };

  const chartOptions = {
    chart: {
      toolbar: { show: false },
      width: "100%",
    },
    labels: chartData.categories,
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
        },
      },
    },
    colors: [barColor[0], barColor[1], barColor[2]],
    dataLabels: {
      enabled: true,
      fontSize: "18px",
      fontFamily: "Poppins, Arial, sans-serif",
      fontWeight: "medium",
      formatter: (val) => {
        return `${val.toFixed(2)}%`;
      },
    },
    legend: {
      position: "bottom",
      formatter: function (seriesName, opts) {
        const saleValue = productSales[opts.seriesIndex]?.total ?? 0;
        return `${seriesName}: ${saleValue.toLocaleString()}`;
      },
    },
    tooltip: {
      enabled: false,
    },
  };

  return (
    <div className="rounded-lg h-[440px] bg-white text-f-dark font-poppins border text-p-sm md:text-p-rg py-4 overflow-clip shadow-sm p-4">
      <header className="flex justify-between px-4 pt-2 mb-4 text-c-secondary">
        <h1 className="font-medium text-nowrap text-c-secondary">
          Top Selling Products
        </h1>
      </header>
      <div className="w-full pl-5">
        <Chart
          type="donut"
          height={320}
          width="100%"
          series={chartData.series}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default DbProduct;
