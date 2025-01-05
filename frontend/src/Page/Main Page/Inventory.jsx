import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RoleColor from "../../assets/Util/RoleColor";
import InventoryTable from "../../Component/ui/InventoryTable";
import AddEditProduct from "../../Component/ui/AddEditProduct";
import TransferStock from "../../Component/ui/TransferStock";
import TransferStockBranch from "../../Component/ui/TransferStockBranch";
import PointOfSale from "./PointOfSale";
import { HiExternalLink } from "react-icons/hi";
import { IoMdSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { FiArrowRight } from "react-icons/fi";

const Inventory = () => {
  const user = useSelector((state) => state.reducer.user.user);
  const products = useSelector((state) => state.reducer.inventory.products);
  const [selected, setSelected] = useState("All");
  const [openPOS, setOpenPOS] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isTransferBranchOpen, setIsTransferBranchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ascending");
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const { btnContentColor } = RoleColor();

  const handleSelected = (section) => {
    setSelected(section);
  };

  const posToggle = () => setOpenPOS(!openPOS);
  const transferToggle = () => setIsTransferOpen(!isTransferOpen);
  const transferBranchToggle = () =>
    setIsTransferBranchOpen(!isTransferBranchOpen);

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
      <nav className="flex flex-col gap-3 lg:flex-row justify-between mb-2 text-p-sm md:text-p-rg">
        <div className="w-full flex justify-between">
          <div className="flex gap-3 items-center">
            {user.role === "3" ? (
              <button
                className="px-2 h-8 md:h-10 rounded-md md:bg-white md:shadow-sm flex items-center gap-1"
                onClick={posToggle}
              >
                <HiExternalLink className="block md:hidden" />
                Quick Dispense
              </button>
            ) : (
              <div>
                <button
                  className="border flex gap-1 items-center px-6 h-12 rounded-md text-f-dark shadow-sm font-medium hover:bg-white"
                  onClick={
                    user.role === "0" ? transferToggle : transferBranchToggle
                  }
                >
                  Monitor Request
                  <FiArrowRight />
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-center items-center rounded-lg md:px-4 md:border font-normal hover:cursor-pointer md:bg-white md:h-12 text-f-dark">
            <select
              className={`hover:cursor-pointer focus:outline-none w-fit bg-bg-mc md:bg-white ${
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
        </div>
        <div className="flex gap-3">
          <div className="flex flex-row border px-4 rounded-lg justify-center items-center w-full gap-2 bg-white h-12">
            <IoMdSearch className="h-6 w-6 text-f-dark" />
            <input
              type="text"
              className="w-fit text-f-dark focus:outline-none placeholder-f-gray2 bg-white"
              placeholder="Search product"
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
      {openPOS && <PointOfSale onClose={posToggle} type={"walkin"} />}
      {isTransferOpen && <TransferStock onClose={transferToggle} />}
      {isTransferBranchOpen && (
        <TransferStockBranch onClose={transferBranchToggle} />
      )}
    </div>
  );
};

export default Inventory;
