import React, { useState, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
import Nodatafound from "../../assets/Image/nodatafound.png";
import RoleColor from "../../assets/Util/RoleColor";
import { useDispatch, useSelector } from "react-redux";
import { FiTrash } from "react-icons/fi";
import { FiRefreshCcw } from "react-icons/fi";
import { retrieveProductService } from "../../Service/InventoryService";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";
import { retrieveProduct } from "../../Slice/InventorySlice";

const ArchiveTable = () => {
  const products = useSelector((state) => state.reducer.inventory.products);
  const user = useSelector((state) => state.reducer.user.user);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const maxPageButtons = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const [isMenuOpen, setIsMenuOpen] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const reduxDispatch = useDispatch();
  const [selectedProducts, setSelectedProducts] = useState([]);
  let branchId =
    (user.branches && user.branches.length > 0 && user.branches[0].branchId) ||
    user.userId;
  const toggleOpen = (productId) => {
    setIsMenuOpen((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuElements = document.querySelectorAll(".menu-dropdown");
      if (isMenuOpen) {
        for (let i = 0; i < menuElements.length; i++) {
          if (menuElements[i] && !menuElements[i].contains(event.target)) {
            setIsMenuOpen({});
          }
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const paginatedProducts = products
    .filter((product) => product.isDeleted === true)
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const { btnContentColor } = RoleColor();

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };
  const handleRetrieveProduct = async (productId) => {
    setIsLoading(true);
    try {
      setSelectedProducts((prevSelected) => {
        const updatedSelected = [...prevSelected];
        if (!updatedSelected.includes(productId)) {
          updatedSelected.push(productId);
        }

        const response = retrieveProductService(
          branchId,
          updatedSelected,
          user.firebaseUid
        );

        if (response) {
          console.log(response);
          setIsSuccess(true);
          reduxDispatch(retrieveProduct(updatedSelected));
        }
        return updatedSelected;
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRetrieveMultipleProducts = async () => {
    setIsLoading(true);
    try {
      if (selectedProducts.length === 0) {
        console.log("No products selected.");
        return;
      }

      const response = await retrieveProductService(
        branchId,
        selectedProducts,
        user.firebaseUid
      );

      if (response) {
        console.log(response);
        setIsSuccess(true);
        reduxDispatch(retrieveProduct(selectedProducts));
        setSelectedProducts([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <Loader description={"Retrieving Product. Please wait..."} />
      )}
      {products.length > 0 ? (
        <div className="flex flex-col w-full h-full font-Poppins">
          <header className="flex py-5 rounded-md border-b bg-white text-f-gray2">
            <div className="w-1/12"></div>
            <div className="w-2/12 pl-4">SKU</div>
            <div className="w-3/12 pl-4">Product Name</div>
            <div className="w-2/12 pl-4">Category</div>
            <div className="w-2/12 pl-4">Price</div>
            <div className="w-2/12 pl-4">Quantity</div>
            <div className="w-1/12"></div>
          </header>
          <main>
            {paginatedProducts.map((productDetail, index) => {
              const isOutOfStock = productDetail.quantity === 0;
              const isChecked = selectedProducts.includes(
                productDetail.productId
              );
              return (
                <section
                  key={productDetail.productId}
                  className={`flex rounded-md py-5 text-p-rg text-f-dark text-nowrap ${
                    index % 2 === 0
                      ? "bg-none border-none"
                      : `bg-white border-b`
                  }`}
                >
                  <div className="w-1/12 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        handleCheckboxChange(productDetail.productId)
                      }
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="w-2/12 pl-4">{productDetail.productSKU}</div>
                  <div className="w-3/12 pl-4">
                    {productDetail.product_name}
                  </div>
                  <div className="w-2/12 pl-4">{productDetail.category}</div>
                  <div className="w-2/12 pl-4">
                    Php {productDetail.price || 0}
                  </div>
                  <div className="w-2/12 pl-4">
                    {isOutOfStock ? "Out of stock" : productDetail.quantity}
                  </div>
                  <div className="w-1/12 relative">
                    <FaEllipsisV
                      className="h-4 w-2 cursor-pointer"
                      onClick={() => toggleOpen(productDetail.productId)}
                    />
                    {isMenuOpen[productDetail.productId] && (
                      <div className="menu-dropdown absolute top-0 left-0 w-fit rounded-md shadow-lg bg-white ring-1 ring-f-gray z-50 origin-top-right mr-4">
                        <div
                          className="p-2"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <a
                            className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-green-100 rounded-md cursor-pointer"
                            role="menuitem"
                            onClick={() =>
                              handleRetrieveProduct(productDetail.productId)
                            }
                          >
                            Retrieve
                          </a>
                          <a
                            className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-red-500 hover:text-f-light rounded-md cursor-pointer"
                            role="menuitem"
                          >
                            Permanent Delete
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </main>
          <div className="flex justify-between mt-6 mb-4">
            <div className="flex gap-4">
              {selectedProducts.length > 0 && (
                <>
                  <div className="flex flex-col items-center gap-2 hover:text-red-400 cursor-pointer text-f-gray2">
                    <FiTrash className="w-5 h-5" />
                    <p className="text-p-sm">Delete</p>
                  </div>
                  <div
                    className="flex flex-col items-center gap-2 hover:text-blue-400 cursor-pointer text-f-gray2"
                    onClick={handleRetrieveMultipleProducts}
                  >
                    <FiRefreshCcw className="w-5 h-5" />
                    <p className="text-p-sm">Retrieve</p>
                  </div>
                </>
              )}
            </div>
            <nav>
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
            </nav>
          </div>
        </div>
      ) : (
        <div className="w-full mt-24 flex flex-col items-center justify-center text-center text-[#96B4B4] text-p-lg font-medium gap-4">
          <img src={Nodatafound} alt="no data image" className="w-80" />
          <p>Oops! No products found.</p>
        </div>
      )}
      <SuccessModal
        title={"Product Retrieved"}
        description={
          "Product has been retrieved. You can now view it in the inventory"
        }
        isOpen={isSuccess}
        onClose={() => setIsSuccess(false)}
      />
    </>
  );
};

export default ArchiveTable;
