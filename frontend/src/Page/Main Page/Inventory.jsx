import React from "react";
import { IoMdSearch } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import InventoryTable from "../../Component/ui/InventoryTable";

const Inventory = () => {
  return (
    <div className="text-f-dark p-3 md:p-8 font-Poppins">
      <nav className="flex flex-col gap-3 lg:gap-0 lg:flex-row justify-between mb-8">
        <div>
          <h1 className="text-p-lg">All Product</h1>
          <p className="text-p-rg">
            <span className="text-blue-500">28</span> Total Products |{"  "}
            <span className="text-red-500">28</span> Out of Stock |{"  "}
            <span className="text-green-500">28</span> In Stock{" "}
          </p>
        </div>
        <div className="flex flex-row h-14">
          <div className="flex flex-row border border-c-gray3 px-4 rounded-md justify-center items-center w-full">
            <IoMdSearch className="h-8 w-8 text-c-secondary" />
            <input
              type="text"
              className="w-full text-f-dark focus:outline-none placeholder-f-gray2 bg-bg-mc text-p-rg"
              placeholder="Search product... "
              //value={searchTerm}
              //onChange={handleSearchChange}
            />
          </div>
          <div className="ml-2 h-auto flex justify-center items-center rounded-md px-4 py-3 border border-c-gray3 text-f-dark font-medium font-md hover:cursor-pointer">
            <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
            <select className="md:block hover:cursor-pointer focus:outline-none bg-bg-mc">
              <option value="" disabled selected>
                Filter
              </option>
              <option value="filter1">Filter 1</option>
              <option value="filter2">Filter 2</option>
              <option value="filter3">Filter 3</option>
            </select>
          </div>
          <div className="ml-2 h-auto flex justify-center items-center rounded-md px-4 py-3 bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary">
            <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
            <h1 className="hidden md:block">Add Product</h1>
          </div>
        </div>
      </nav>
      <main className="overflow-x-auto">
        <InventoryTable />
      </main>
    </div>
  );
};

export default Inventory;
