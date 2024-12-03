import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import InventoryTable from "../../Component/ui/InventoryTable";
import AddEditProduct from "../../Component/ui/AddEditProduct";
import { useSelector } from "react-redux";
import RoleColor from "../../assets/Util/RoleColor";
import { FiShoppingCart } from "react-icons/fi";
import PointOfSale from "./PointOfSale";

const Inventory = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const products = useSelector((state) => state.reducer.inventory.products);
  const [selected, setSelected] = useState("All");
  const [openPOS, setOpenPOS] = useState(false);
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
  const { btnContentColor } = RoleColor();

  const handleSelected = (section) => {
    setSelected(section);
  };

  const posToggle = () => setOpenPOS(!openPOS);

  return (
    <div className="text-f-dark p-4 md:p-6 2xl:p-8 font-Poppins">
      <nav className="flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between mb-2">
        <div className="flex gap-3 items-center">
          <section className="bg-white flex rounded-md h-fit w-fit p-3 border shadow-sm">
            <p className="text-p-sc md:text-p-sm">
              <span className="text-blue-500">{productCount}</span> Total
              Products |{"  "}
              <span className="text-red-500">{lowStockCount}</span> Low Stock
            </p>
          </section>
          {user.role === "3" && (
            <button
              className="text-p-sm border flex gap-2 items-center p-3 rounded-md text-blue-300 shadow-sm font-medium"
              onClick={posToggle}
            >
              <FiShoppingCart className="w-4 h-4" />
              Checkout
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <div className="flex justify-center items-center rounded-md px-4 py-3 border border-f-gray bg-white text-c-gray3 font-normal hover:cursor-pointer">
            <select
              className="hover:cursor-pointer focus:outline-none bg-white w-fit"
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
          <div className="flex flex-row gap-2 border border-gray-300  px-4 rounded-md justify-center items-center w-full">
            <IoMdSearch className="h-6 w-6 text-c-secondary" />
            <input
              type="text"
              className="w-full text-f-dark focus:outline-none placeholder-f-gray2 text-p-sm md:text-p-rg bg-bg-mc"
              placeholder="Search product... "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {user.role !== "0" && (
            <div
              className={`flex flex-row px-4 items-center rounded-md py-3 text-f-light font-md hover:cursor-pointer hover:bg-opacity-75 ${btnContentColor} `}
              onClick={toggleModal}
            >
              <FiPlus className="h-5 w-5 md:mr-2" />
              <h1 className="hidden md:block text-nowrap">Add Product</h1>
            </div>
          )}
        </div>
      </nav>
      <div className="w-full flex text-p-sc md:text-p-sm overflow-auto">
        {["All", "Eye Glass", "Contact Lens", "Medication", "Other"].map(
          (section) => (
            <div
              key={section}
              className={`h-auto flex items-center px-4 py-2 cursor-pointer text-nowrap border-b-2 ${
                selected === section
                  ? "text-f-dark border-c-primary font-medium"
                  : "text-f-gray2"
              }`}
              onClick={() => handleSelected(section)}
            >
              <h1>{section}</h1>
            </div>
          )
        )}
      </div>
      <main className="overflow-x-auto">
        <InventoryTable
          searchTerm={searchTerm}
          sortOption={sortOption}
          selectedCategory={selected}
        />
      </main>
      {isModalOpen && (
        <AddEditProduct onClose={toggleModal} title={"Add Product"} />
      )}
      {openPOS && <PointOfSale onClose={posToggle} />}
    </div>
  );
};

export default Inventory;
