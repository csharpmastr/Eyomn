import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";

const InventoryTable = () => {
  const products = useSelector((state) => state.reducer.product.products);
  const [collapsedProducts, setCollapsedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPageButtons = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleCollapseToggle = (productId) => {
    setCollapsedProducts((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  return (
    <div className="w-fit md:w-full text-f-dark overflow-x-auto font-poppins">
      <header className="flex text-p-rg font-semibold py-8 border bg-white border-b-f-gray rounded-t-lg">
        <div className="flex-1 pl-4">Product Name</div>
        <div className="flex-1 pl-4">Category</div>
        <div className="flex-1 pl-4">Prescription/Type</div>
        <div className="flex-1 pl-4">Price</div>
        <div className="flex-1 pl-4">Quantity</div>
        <div className="flex-1 pl-4">Brand</div>
        <div className="w-20"></div>
      </header>
      <main>
        {products.map((product, index) => {
          // Default to true (collapsed) if not already set
          const isCollapsed = collapsedProducts[product.productId] !== false;

          return (
            <section
              key={product.productId}
              className={`${index % 2 === 0 ? "bg-bg-mc" : "bg-white"}`}
            >
              <div
                className={`flex text-p-rg py-6 ${
                  isCollapsed ? "border border-b-f-gray" : ""
                }`}
              >
                <div className="flex-1 pl-4">{product.product_name}</div>
                <div className="flex-1 pl-4">
                  {product.category || "Eyeglasses"}
                </div>
                <div className="flex-1 pl-4">
                  {product.eyeglass_category || ""}
                </div>
                <div className="flex-1 pl-4">Php {product.price || 0}</div>
                <div className="flex-1 pl-4">{product.quantity || 0}</div>
                <div className="flex-1 pl-4">
                  {product.brand || "Luxottica"}
                </div>
                <div className="w-20 flex">
                  <IoIosAddCircleOutline
                    className="h-6 w-6 md:mr-2"
                    onClick={() => handleCollapseToggle(product.productId)}
                  />
                </div>
              </div>
              {!isCollapsed && (
                <div className={`py-5 flex border border-b-f-gray`}>
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
          );
        })}
      </main>
      <div className="flex justify-end mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === 1
              ? "bg-gray-400 text-f-light"
              : "bg-gray-200 text-f-gray2"
          }`}
        >
          &lt;
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(startPage + index)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === startPage + index
                ? "bg-c-secondary text-f-light"
                : "bg-gray-200 text-f-gray2"
            }`}
          >
            {startPage + index}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-400 text-f-light"
              : "bg-gray-200 text-f-gray2"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default InventoryTable;
