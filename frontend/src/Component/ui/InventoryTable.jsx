import React, { useState, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaEllipsisV } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddEditProduct from "../../Component/ui/AddEditProduct";
import ConfirmationModal from "../../Component/ui/ConfirmationModal";
import Sample from "../../assets/Image/3.png";

const InventoryTable = ({ searchTerm, sortOption }) => {
  const products = useSelector((state) => state.reducer.product.products);
  const [collapsedProducts, setCollapsedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPageButtons = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const [isMenuOpen, setIsMenuOpen] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productId, setProductId] = useState("");

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const toggleOpen = (productId) => {
    setIsMenuOpen((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const handleCollapseToggle = (productId) => {
    setCollapsedProducts((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  let filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortOption === "ascending") {
    filteredProducts = filteredProducts.sort((a, b) =>
      `${a.product_name}`.localeCompare(`${b.product_name}`)
    );
  } else if (sortOption === "descending") {
    filteredProducts = filteredProducts.sort((b, a) =>
      `${a.product_name}`.localeCompare(`${b.product_name}`)
    );
  } else if (sortOption === "quantity-l") {
    filteredProducts = filteredProducts.sort((a, b) =>
      `${a.quantity}`.localeCompare(`${b.quantity}`)
    );
  } else if (sortOption === "quantity-h") {
    filteredProducts = filteredProducts.sort((a, b) =>
      `${b.quantity}`.localeCompare(`${a.quantity}`)
    );
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

  const handleEditProduct = (productId) => {
    const productToEdit = products.find(
      (product) => product.productId === productId
    );
    const { productSKU, productId: id, ...productWithoutSKUId } = productToEdit;

    setSelectedProduct(productWithoutSKUId);
    setProductId(productId);
    toggleModal();
  };

  const handleDeleteProduct = (productId) => {
    setProductId(productId);
    setIsConfirmationModalOpen(true);
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

  return (
    <>
      {filteredProducts.length > 0 ? (
        <>
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
              {paginatedProducts.map((productDetail, index) => {
                const isCollapsed =
                  collapsedProducts[productDetail.productId] !== false;

                return (
                  <section
                    key={productDetail.productId}
                    className={`${index % 2 === 0 ? "bg-bg-mc" : "bg-white"}`}
                  >
                    <div
                      className={`flex text-p-rg py-6 ${
                        isCollapsed ? "border border-b-f-gray" : ""
                      }`}
                    >
                      <div className="flex-1 pl-4">
                        {productDetail.product_name}
                      </div>
                      <div className="flex-1 pl-4">
                        {productDetail.category || "Eyeglasses"}
                      </div>
                      <div className="flex-1 pl-4">
                        {productDetail.eyeglass_category || ""}
                      </div>
                      <div className="flex-1 pl-4">
                        Php {productDetail.price || 0}
                      </div>
                      <div className="flex-1 pl-4">
                        {productDetail.quantity === 0
                          ? "Out of stock"
                          : productDetail.quantity || 0}
                      </div>
                      <div className="flex-1 pl-4">
                        {productDetail.brand || "Luxottica"}
                      </div>
                      <div className="w-20 flex items-center gap-4">
                        <MdKeyboardArrowDown
                          className={`h-6 w-6 ${
                            isCollapsed ? `rotate-0` : `rotate-180`
                          }`}
                          onClick={() =>
                            handleCollapseToggle(productDetail.productId)
                          }
                        />
                        <FaEllipsisV
                          className="h-4 w-2 cursor-pointer"
                          onClick={() => toggleOpen(productDetail.productId)}
                        />
                        {isMenuOpen[productDetail.productId] && (
                          <div className="menu-dropdown absolute right-0 w-fit rounded-md shadow-lg bg-white ring-1 ring-f-gray z-50 origin-top-right mr-4">
                            <div
                              className="p-2"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="options-menu"
                            >
                              <a
                                className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-gray-100 cursor-pointer"
                                role="menuitem"
                                onClick={() =>
                                  handleEditProduct(productDetail.productId)
                                }
                              >
                                Edit
                              </a>
                              <a
                                className="block px-4 py-2 text-p-sm text-f-gray2 hover:bg-gray-100 cursor-pointer"
                                role="menuitem"
                                onClick={() =>
                                  handleDeleteProduct(productDetail.productId)
                                }
                              >
                                Delete
                              </a>
                            </div>
                          </div>
                        )}
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

            {isModalOpen && (
              <AddEditProduct
                onClose={toggleModal}
                productDetails={selectedProduct}
                title={"Edit Product"}
                productId={productId}
              />
            )}

            {isConfirmationModalOpen && (
              <ConfirmationModal
                productId={productId}
                onClose={() => setIsConfirmationModalOpen(false)}
              />
            )}
          </div>
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
        </>
      ) : (
        <div className="w-full mt-24 flex flex-col items-center justify-center text-center text-c-primary text-p-lg font-medium gap-4">
          <img src={Sample} alt="no data image" className="w-80" />
          <p>Oops! No products found.</p>
        </div>
      )}
    </>
  );
};

export default InventoryTable;
