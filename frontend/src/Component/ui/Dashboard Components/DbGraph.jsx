import React from "react";

const DbGraph = () => {
  return (
    <div className="text-p-rg h-[500px] text-c-secondary rounded-lg bg-white p-4 border">
      <header className="flex justify-between h-fit w-full items-center mb-4">
        <h1 className=" font-semibold">| Inventory / Patient Graph</h1>
        <select className="hover:cursor-pointer focus:outline-none bg-bg-mc p-1 rounded-md border border-f-gray">
          <option value="filter1">Today</option>
          <option value="filter2">This Month</option>
          <option value="filter3">This Year</option>
        </select>
      </header>
      <canvas className="bg-white w-full h-[420px] border"></canvas>
    </div>
  );
};

export default DbGraph;
