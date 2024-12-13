import React, { useState, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaEllipsisV } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AddEditProduct from "../../Component/ui/AddEditProduct";
import ConfirmationModal from "../../Component/ui/ConfirmationModal";
import Nodatafound from "../../assets/Image/nodatafound.png";
import RoleColor from "../../assets/Util/RoleColor";
import Fuse from "fuse.js";
import { deleteProduct } from "../../Service/InventoryService";
import { removeProduct } from "../../Slice/InventorySlice";
import RequestStock from "./RequestStock";

const InventoryTable = ({ searchTerm, sortOption, selectedCategory }) => {
  const products = useSelector((state) => state.reducer.inventory.products);
  const user = useSelector((state) => state.reducer.user.user);
  let branchId =
    (user.branches && user.branches.length > 0 && user.branches[0].branchId) ||
    user.userId;
  const [collapsedProducts, setCollapsedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPageButtons = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const [isMenuOpen, setIsMenuOpen] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productId, setProductId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const reduxDispatch = useDispatch();
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

  const fuse = new Fuse(products, {
    keys: ["product_name", "productSKU"],
    threshold: 0.3,
  });

  let filteredProducts = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : products;

  if (selectedCategory !== "All") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory
    );
  }

  filteredProducts = filteredProducts.filter((product) => !product.isDeleted);

  if (!sortOption || sortOption === "default" || sortOption === "ascending") {
    filteredProducts = filteredProducts.sort((a, b) =>
      `${a.product_name}`.localeCompare(`${b.product_name}`)
    );
  } else if (sortOption === "descending") {
    filteredProducts = filteredProducts.sort((b, a) =>
      `${a.product_name}`.localeCompare(`${b.product_name}`)
    );
  } else if (sortOption === "quantity-l") {
    filteredProducts = filteredProducts.sort((a, b) => a.quantity - b.quantity);
  } else if (sortOption === "quantity-h") {
    filteredProducts = filteredProducts.sort((a, b) => b.quantity - a.quantity);
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

  const handleRequestStock = () => setIsRequestOpen(!isRequestOpen);

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

  const { btnContentColor } = RoleColor();

  const handleDelete = async (productId) => {
    setIsLoading(true);
    try {
      const response = await deleteProduct(
        branchId,
        productId,
        { isDeleted: true },
        user.firebaseUid
      );
      if (response) {
        setIsSuccess(true);
        reduxDispatch(removeProduct(productId));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {filteredProducts.length > 0 ? (
        <>
          <div className="w-fit md:w-full text-f-dark overflow-x-auto font-poppins">
            <header className="flex py-5 rounded-md border-b bg-white text-f-gray2">
              <div className="flex-1 pl-4">Product Name</div>
              <div className="flex-1 pl-4">Category</div>
              <div className="flex-1 pl-4">Price</div>
              <div className="flex-1 pl-4">Status</div>
              <div className="w-20"></div>
            </header>
            <main>
              {paginatedProducts.map((productDetail, index) => {
                const isCollapsed =
                  collapsedProducts[productDetail.productId] !== false;

                return (
                  <section
                    key={productDetail.productId}
                    className={`rounded-md ${
                      index % 2 === 0
                        ? "bg-none border-none"
                        : `bg-white border-b`
                    }`}
                  >
                    <div className="flex text-p-sm md:text-p-rg py-5">
                      <div className="flex-1 pl-4">
                        {productDetail.product_name}
                      </div>
                      <div className="flex-1 pl-4">
                        {productDetail.category || "Eyeglasses"}
                      </div>
                      <div className="flex-1 pl-4">
                        Php {productDetail.price || 0}
                      </div>
                      <div className="flex-1 pl-4">
                        {productDetail.quantity === 0 ? (
                          <span className="bg-red-200 text-red-500 font-medium rounded-full px-4 py-1">
                            Out of stock
                          </span>
                        ) : productDetail.quantity < 10 ? (
                          <span className="bg-orange-200 text-orange-500 font-medium rounded-full px-4 py-1">
                            Low Stock
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-500 font-medium rounded-full px-4 py-1">
                            Active
                          </span>
                        )}
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
                        {user.role === "0" ? (
                          ""
                        ) : (
                          <FaEllipsisV
                            className="h-4 w-2 cursor-pointer"
                            onClick={() => toggleOpen(productDetail.productId)}
                          />
                        )}
                        {isMenuOpen[productDetail.productId] && (
                          <div className="menu-dropdown absolute right-0 w-fit rounded-md shadow-lg bg-white ring-1 ring-f-gray z-50 origin-top-right mr-4">
                            <div
                              className="p-2"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="options-menu"
                            >
                              <a
                                className="block px-4 py-2 text-p-sc md:text-p-sm text-f-gray2 hover:bg-gray-100 rounded-md cursor-pointer"
                                role="menuitem"
                                onClick={() =>
                                  handleEditProduct(productDetail.productId)
                                }
                              >
                                Edit
                              </a>
                              {user.role === "1" && (
                                <a
                                  className="block px-4 py-2 text-p-sc md:text-p-sm text-f-gray2 hover:bg-gray-100 rounded-md cursor-pointer"
                                  role="menuitem"
                                  onClick={handleRequestStock}
                                >
                                  Request Stock
                                </a>
                              )}
                              <a
                                className="block px-4 py-2 text-p-sc md:text-p-sm text-f-gray2 hover:bg-red-500 hover:text-f-light rounded-md cursor-pointer"
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
                      <div className={`py-5 flex border-b text-c-gray3`}>
                        <div className="flex-1 pl-4">
                          <p className="text-p-sc md:text-p-sm">
                            SKU:{" "}
                            <span className="text-f-dark">
                              {productDetail.productSKU}
                            </span>
                          </p>
                        </div>
                        <div className="flex-1 pl-4">
                          <p className="text-p-sc md:text-p-sm">
                            Quantity:{" "}
                            <span className="text-f-dark">
                              {productDetail.quantity}
                            </span>
                          </p>
                        </div>
                        {(productDetail.category === "Medication" ||
                          productDetail.category === "Contact Lens") && (
                          <div className="flex-1 pl-4">
                            <p className="text-p-sc md:text-p-sm">
                              Expiration Date:{" "}
                              <span className="text-f-dark">
                                {productDetail.expirationDate}
                              </span>
                            </p>
                          </div>
                        )}
                        {(productDetail.category === "Eye Glass" ||
                          productDetail.category === "Contact Lens") && (
                          <div className="flex-1 pl-4">
                            <p className="text-p-sc md:text-p-sm">
                              Material:{" "}
                              <span className="text-f-dark">
                                {productDetail.ct_material}
                              </span>
                            </p>
                          </div>
                        )}
                        <div className="flex-1 pl-4">
                          <p className="text-p-sc md:text-p-sm">
                            Brand:{" "}
                            <span className="text-f-dark">
                              {productDetail.brand}
                            </span>
                          </p>
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
                onClose={() => {
                  setIsConfirmationModalOpen(false);
                  setIsSuccess(false);
                }}
                title={"Delete Product"}
                handleDelete={() => handleDelete(productId)}
                isLoading={isLoading}
                actionSuccessMessage={"Product Successfully Deleted!"}
                isSuccessModalOpen={isSuccess}
              />
            )}

            {isRequestOpen && <RequestStock onClose={handleRequestStock} />}
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

export default InventoryTable;
