import React from "react";
import ReactDOM from "react-dom";
import { IoMdSearch } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";

const POS = ({ onClose }) => {
  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50">
      <div className="w-[1100px] h-[800px]">
        <header className="px-4 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-lg text-c-secondary font-semibold">
            Point of Sale
          </h1>
          <button onClick={onClose}>&times;</button>
        </header>
        <div className="bg-white rounded-b-lg flex h-full">
          <div className="w-full bg-bg-mc p-6 text-f-dark">
            <div className="mb-6">
              <div className="flex flex-row h-14">
                <div className="flex flex-row border border-c-gray3 px-4 rounded-md justify-center items-center w-full">
                  <IoMdSearch className="h-8 w-8 text-c-secondary" />
                  <input
                    type="text"
                    className="w-full text-f-dark font-Poppins focus:outline-none placeholder-f-gray2 bg-bg-mc text-p-rg"
                    placeholder="Search product... "
                    //value={searchTerm}
                    //onChange={handleSearchChange}
                  />
                </div>
                <div className="ml-2 h-auto flex justify-center items-center rounded-md px-4 py-3 font-Poppins border border-c-gray3 text-f-dark font-medium font-md hover:cursor-pointer">
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
              </div>
            </div>
            <header className="flex text-p-rg font-semibold py-5 bg-white border border-b-f-gray">
              <div className="flex-1 pl-4">Code</div>
              <div className="flex-1 pl-4">Product Name</div>
              <div className="flex-1 pl-4">Category</div>
              <div className="flex-1 pl-4">Price</div>
            </header>
            <div className="overflow-y-auto border border-b-f-gray text-p-rg">
              <section className="flex py-4 ">
                <div className="flex-1 pl-4">####</div>
                <div className="flex-1 pl-4">Product Name</div>
                <div className="flex-1 pl-4">Category</div>
                <div className="flex-1 pl-4">Price</div>
              </section>
            </div>
          </div>
          <div className="w-[640px] bg-white flex flex-col">
            <header className="p-6">
              <h1 className="text-p-rg font-semibold">Order List</h1>
            </header>
            <div>
              <div className="px-6 py-3 border border-b-f-gray">
                <h1 className="text-p-lg font-semibold mb-4">Product Name</h1>
                <div className="flex justify-between items-end">
                  <p className="text-f-gray2">sub total</p>
                  <input
                    type="number"
                    name="price"
                    //value={formData.price}
                    //onChange={handleChange}
                    className="w-20 h-8 border text-center border-c-gray3 rounded-sm text-f-dark focus:outline-c-primary"
                    min="0"
                    step="1"
                    placeholder="0.00"
                  />
                  <p>grand total</p>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <div className="rounded-lg bg-bg-mc p-6 mx-6 mb-6 shadow-md">
                <div className="flex justify-between mb-2">
                  <p className="text-f-gray2">Total</p>
                  <p>Php. 0.00</p>
                </div>
                <div className="flex justify-between items-center mb-5">
                  <p className="text-f-gray2">Cash Tendered</p>
                  <input
                    type="text"
                    name="price"
                    //value={formData.price}
                    //onChange={handleChange}
                    className="w-28 h-10 border text-end px-2 border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                  />
                </div>
                <hr className="border-slate-400" />
                <div className="flex justify-between mt-5">
                  <p className="text-f-gray2">change</p>
                  <p>Php. 0.00</p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button className="w-full h-12 bg-[#3B7CF9] text-f-light text-p-rg font-semibold rounded-md hover:bg-[#77a0ec] active:bg-bg-[#2c4c86]">
                  Process Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default POS;
