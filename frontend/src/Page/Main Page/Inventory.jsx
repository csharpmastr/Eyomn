import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import InventoryTable from "../../Component/ui/InventoryTable";
import AddEditProduct from "../../Component/ui/AddEditProduct";
import { getProducts } from "../../Service/InventoryService";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";

const Inventory = () => {
  const products = useSelector((state) => state.reducer.inventory.products);
  const productCount = products.filter(
    (product) => product.isDeleted === false
  ).length;
  const lowStockCount = products
    .filter((product) => product.isDeleted === false)
    .filter((product) => product.quantity < 10).length;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="text-f-dark p-4 md:p-6 2xl:p-8 font-Poppins">
      <nav className="flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between mb-8">
        <div className="flex gap-3 items-center">
          <h1 className="text-p-lg font-medium text-c-secondary">
            All Product
          </h1>
          <section className="bg-bg-sub flex rounded-md h-fit w-fit p-3 border shadow-sm">
            <p className="text-p-sm">
              <span className="text-blue-500">{productCount}</span> Total
              Products |{"  "}
              <span className="text-red-500">{lowStockCount}</span> Low Stock
              {"  "}
            </p>
          </section>
        </div>
        <div className="flex gap-3">
          <div className="flex justify-center items-center rounded-md px-4 py-3 border border-f-gray bg-bg-sub text-c-gray3 font-normal hover:cursor-pointer">
            <select
              className="hover:cursor-pointer focus:outline-none bg-bg-sub w-fit"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="" disabled selected>
                Sort by
              </option>
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
              <option value="quantity-l">Low (Stock)</option>
              <option value="quantity-h">High (Stock)</option>
            </select>
          </div>
          <div className="flex flex-row gap-2 border border-gray-300 bg-bg-sub px-4 rounded-md justify-center items-center w-full">
            <IoMdSearch className="h-6 w-6 text-c-secondary" />
            <input
              type="text"
              className="w-full text-f-dark focus:outline-none placeholder-f-gray2 text-p-rg bg-bg-sub"
              placeholder="Search product... "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div
            className="flex flex-row px-4 items-center rounded-md py-3 bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
            onClick={toggleModal}
          >
            <FiPlus className="h-5 w-5 md:mr-2" />
            <h1 className="hidden md:block text-nowrap">Add Product</h1>
          </div>
        </div>
      </nav>
      <main className="overflow-x-auto">
        <InventoryTable searchTerm={searchTerm} sortOption={sortOption} />
      </main>
      {isModalOpen && (
        <AddEditProduct onClose={toggleModal} title={"Add Product"} />
      )}
    </div>
  );
};

export default Inventory;
