import React from "react";

const DbTable = () => {
  return (
    <div className="w-fit md:w-full rounded-lg bg-white text-f-dark overflow-x-auto font-poppins">
      <header className="flex text-p-rg font-semibold py-8 border border-b-f-gray">
        <div className="flex-1 pl-4">Patient Name</div>
        <div className="flex-1 pl-4">Last Visit</div>
      </header>
      <main className="flex py-3">
        <div className="flex-1 pl-4">Patient Name</div>
        <div className="flex-1 pl-4">Last Visit</div>
      </main>
    </div>
  );
};

export default DbTable;
