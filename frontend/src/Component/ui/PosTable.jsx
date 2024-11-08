import React, { useState } from "react";
import { useSelector } from "react-redux";
import Nodatafound from "../../assets/Image/nodatafound.png";
import RoleColor from "../../assets/Util/RoleColor";

const PosTable = ({ onProductSelect, searchTerm, sortOption }) => {
  const products = useSelector((state) => state.reducer.inventory.products);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const maxPageButtons = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  let filteredProducts = products
    .filter((product) => product.isDeleted === false)
    .filter(
      (product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productSKU.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (sortOption === "ascending") {
    filteredProducts = filteredProducts.sort((a, b) =>
      `${a.product_name}`.localeCompare(`${b.product_name}`)
    );
  } else if (sortOption === "descending") {
    filteredProducts = filteredProducts.sort((b, a) =>
      `${a.product_name}`.localeCompare(`${b.product_name}`)
    );
  } else if (sortOption === "price-l") {
    filteredProducts = filteredProducts.sort((a, b) => b.quantity - a.quantity);
  } else if (sortOption === "price-h") {
    filteredProducts = filteredProducts.sort((a, b) => a.quantity - b.quantity);
  }

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const { btnContentColor } = RoleColor();

  return (
    <>
      {filteredProducts.length > 0 ? (
        <>
          <div className="w-fit md:w-full text-f-dark overflow-x-auto font-Poppins text-p-rg">
            <header className="w-full py-5 rounded-md flex border-b bg-white text-f-gray2">
              <div className="w-1/5 pl-4">Code</div>
              <div className="w-1/5 pl-4">Product Name</div>
              <div className="w-1/5 pl-4">Category</div>
              <div className="w-1/5 pl-4">Price</div>
              <div className="w-1/5 pl-4">Quantity</div>
            </header>
            <div>
              {paginatedProducts.map((productDetail, index) => {
                const isOutOfStock = productDetail.quantity === 0;
                return (
                  <section
                    className={`py-5 cursor-pointer flex w-full rounded-md ${
                      index % 2 === 0
                        ? "bg-none border-none"
                        : `bg-white border-b`
                    } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    key={productDetail.productId}
                    onClick={() =>
                      !isOutOfStock && onProductSelect(productDetail)
                    }
                  >
                    <div className="w-1/5 pl-4">{productDetail.productSKU}</div>
                    <div className="w-1/5 pl-4">
                      {productDetail.product_name}
                    </div>
                    <div className="w-1/5 pl-4">{productDetail.category}</div>
                    <div className="w-1/5 pl-4">
                      Php {productDetail.price || 0}
                    </div>
                    <div className="w-1/5 pl-4">
                      {isOutOfStock ? "Out of stock" : productDetail.quantity}
                    </div>
                  </section>
                );
              })}
            </div>
            <div className="flex justify-end mt-6 mb-4">
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
                      ? `${btnContentColor} text-f-light`
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
        </>
      ) : (
        <div className="w-full mt-24 flex flex-col items-center justify-center text-center text-[#96B4B4] text-p-lg font-medium gap-4">
          <img src={Nodatafound} alt="no data image" className="w-80" />
          <p>Oops! No products found.</p>
        </div>
      )}
    </>
  );
};

export default PosTable;
