import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

const InventoryTable = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="w-fit md:w-full rounded-lg bg-white text-f-dark overflow-x-auto font-poppins">
      <header className="flex text-p-rg font-semibold py-8 border border-b-f-gray">
        <div className="flex-1 pl-4">Product Name</div>
        <div className="flex-1 pl-4">Category</div>
        <div className="flex-1 pl-4">Prescription/Type</div>
        <div className="flex-1 pl-4">Price</div>
        <div className="flex-1 pl-4">Brand</div>
        <div className="w-20"></div>
      </header>
      <main>
        <section
        //   key={index}
        //   className={`${index % 2 === 0 ? "bg-bg-mc" : `bg-white`}`}
        >
          <div
            className={`flex text-p-rg py-6 ${
              isCollapsed ? "border border-b-f-gray" : ""
            }`}
          >
            <div className="flex-1 pl-4">PK6-12 Eye Protect</div>
            <div className="flex-1 pl-4">Eyeglasses</div>
            <div className="flex-1 pl-4">Non-Graded</div>
            <div className="flex-1 pl-4">Php 2,025.00</div>
            <div className="flex-1 pl-4">Luxottica</div>
            <div className="w-20 flex">
              <IoIosAddCircleOutline
                className="h-6 w-6 md:mr-2"
                onClick={handleCollapseToggle}
              />
              <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
            </div>
          </div>
          {isCollapsed ? (
            ""
          ) : (
            <div
              className={`py-5 flex ${
                isCollapsed ? "" : "border border-b-f-gray"
              }`}
            >
              <div className="flex-1 pl-4">
                <p className="text-p-sm">Other Info:</p>
                <p>Sample Info</p>
              </div>
              <div className="flex-1 pl-4">
                <p className="text-p-sm">Other Info:</p>
                <p>Sample Info</p>
              </div>
              <div className="flex-1 pl-4">
                <p className="text-p-sm">Other Info:</p>
                <p>Sample Info</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default InventoryTable;
