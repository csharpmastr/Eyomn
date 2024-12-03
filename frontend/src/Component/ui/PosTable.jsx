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
        (product.product_name &&
          product.product_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (product.productSKU &&
          product.productSKU.toLowerCase().includes(searchTerm.toLowerCase()))
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
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-h") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
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
          <div className="w-fit md:w-full text-f-dark overflow-x-auto font-Poppins text-p-sm md:text-p-rg">
            <table className="min-w-full table-auto border-collapse text-f-dark overflow-x-auto font-Poppins text-p-sm md:text-p-rg">
              <thead>
                <tr className="bg-zinc-200 text-f-dark opacity-40 h-16">
                  <th className="pl-4 w-1/5 text-start ffont-semibold">Code</th>
                  <th className="pl-4 w-1/5 text-start font-semibold">
                    Product Name
                  </th>
                  <th className="pl-4 w-1/5 text-start font-semibold">
                    Category
                  </th>
                  <th className="pl-4 w-1/5 text-start font-semibold">Price</th>
                  <th className="pl-4 w-1/5 text-start font-semibold">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((productDetail, index) => {
                  const isOutOfStock = productDetail.quantity === 0;
                  return (
                    <tr
                      key={productDetail.productId}
                      className={`h-16 cursor-pointer ${
                        index % 2 === 0 ? "bg-none" : "bg-white"
                      } ${isOutOfStock ? "text-f-gray" : "text-f-dark"}`}
                      onClick={() =>
                        !isOutOfStock && onProductSelect(productDetail)
                      }
                    >
                      <td className="pl-4 w-1/5">{productDetail.productSKU}</td>
                      <td className="pl-4 w-1/5">
                        {productDetail.product_name}
                      </td>
                      <td className="pl-4 w-1/5">{productDetail.category}</td>
                      <td className="pl-4 w-1/5">
                        Php {productDetail.price || 0}
                      </td>
                      <td className="pl-4 w-1/5">
                        <span
                          className={`${
                            isOutOfStock
                              ? "bg-red-400 text-white rounded-full px-2 py-1"
                              : ""
                          }`}
                        >
                          {isOutOfStock
                            ? "Out of stock"
                            : productDetail.quantity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-end mt-6 mb-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === 1
                    ? "bg-zinc-200 text-f-gray2"
                    : "bg-zinc-200 text-f-gray2"
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
                      : "bg-zinc-200 text-f-gray2"
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
                    ? "bg-zinc-200 text-f-gray2"
                    : "bg-zinc-200 text-f-gray2"
                }`}
              >
                &gt;
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full mt-24 flex flex-col items-center justify-center text-center text-[#96B4B4] text-p-rg md:text-p-lg font-medium gap-4">
          <img src={Nodatafound} alt="no data image" className="w-80" />
          <p>Oops! No products found.</p>
        </div>
      )}
    </>
  );
};

export default PosTable;
