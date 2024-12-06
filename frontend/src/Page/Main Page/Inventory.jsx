import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import InventoryTable from "../../Component/ui/InventoryTable";
import AddEditProduct from "../../Component/ui/AddEditProduct";
import { useSelector } from "react-redux";
import RoleColor from "../../assets/Util/RoleColor";
import PointOfSale from "./PointOfSale";
import { HiExternalLink } from "react-icons/hi";

const Inventory = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const products = useSelector((state) => state.reducer.inventory.products);
  const [selected, setSelected] = useState("All");
  const [openPOS, setOpenPOS] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const { btnContentColor } = RoleColor();

  const handleSelected = (section) => {
    setSelected(section);
  };

  const posToggle = () => setOpenPOS(!openPOS);

  const productCounts = {
    All: products.filter((product) => !product.isDeleted).length,
    "Eye Glass": products.filter(
      (product) => !product.isDeleted && product.category === "Eye Glass"
    ).length,
    "Contact Lens": products.filter(
      (product) => !product.isDeleted && product.category === "Contact Lens"
    ).length,
    Medication: products.filter(
      (product) => !product.isDeleted && product.category === "Medication"
    ).length,
    Other: products.filter(
      (product) => !product.isDeleted && product.category === "Other"
    ).length,
  };

  return (
    <div className="text-f-dark p-4 md:p-6 2xl:p-8 font-Poppins">
      <nav className="flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between mb-2">
        <div className="flex gap-3 items-center">
          <p className="text-c-gray3 font-medium text-p-sm">
            Dispense product:
          </p>
          {user.role === "3" && (
            <button
              className="text-p-rg border flex gap-1 items-center px-4 py-1 rounded-full text-blue-500 shadow-sm font-medium hover:bg-white"
              onClick={posToggle}
            >
              <HiExternalLink />
              Walk Ins
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <div className="flex justify-center items-center rounded-lg px-4 border font-normal hover:cursor-pointer bg-white h-12 text-f-dark">
            <select
              className={`hover:cursor-pointer focus:outline-none w-fit bg-white ${
                sortOption === "" ? "text-f-gray2" : "text-f-dark"
              }`}
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
          <div className="flex flex-row border px-4 rounded-lg justify-center items-center w-full gap-2 bg-white h-12">
            <IoMdSearch className="h-6 w-6 text-f-dark" />
            <input
              type="text"
              className="w-full text-f-dark focus:outline-none placeholder-f-gray2 text-p-sm md:text-p-rg bg-white"
              placeholder="Search product... "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {user.role !== "0" && (
            <div
              className={`flex flex-row px-4 items-center rounded-md  text-f-light font-md hover:cursor-pointer hover:bg-opacity-75 ${btnContentColor} `}
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
                  ? "text-c-primary border-c-primary font-medium"
                  : "text-f-gray2"
              }`}
              onClick={() => handleSelected(section)}
            >
              <h1>
                {section} ({productCounts[section]})
              </h1>
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
