import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import PosTable from "../../Component/ui/PosTable";
import { useDispatch, useSelector } from "react-redux";
import { useAddPurchase } from "../../Hooks/useAddPurchase";
import Loader from "../../Component/ui/Loader";
import SuccessModal from "../../Component/ui/SuccessModal";
import { addPurchase } from "../../Slice/InventorySlice";
import ErrorModal from "../../Component/ui/ErrorModal";
import { useNavigate } from "react-router-dom";

const PointOfSale = ({ onClose }) => {
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectType, setSelectType] = useState("Product");
  const reduxDispatch = useDispatch();
  const user = useSelector((state) => state.reducer.user.user);
  const { addPurchaseHook, isLoading, error } = useAddPurchase();
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  let branchId =
    (user.branches && user.branches.length > 0 && user.branches[0].branchId) ||
    user.userId ||
    null;

  const handleProductSelect = (product) => {
    const existingProductIndex = selectedProducts.findIndex(
      (item) => item.productId === product.productId
    );

    if (existingProductIndex > -1) {
      const updatedProducts = [...selectedProducts];
      const existingProduct = updatedProducts[existingProductIndex];

      if (existingProduct.quantity < product.quantity) {
        updatedProducts[existingProductIndex].quantity += 1;
      } else {
        return;
      }

      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { ...product, quantity: 1, maxQuantity: product.quantity },
      ]);
    }
  };
  const handlePurchase = async () => {
    if (selectedProducts.length === 0) {
      setIsError(true);
      return;
    }

    const purchaseDetails = selectedProducts.map(
      ({ productId, productSKU, quantity, price }) => ({
        productId,
        productSKU,
        quantity,
        totalAmount: price * quantity,
      })
    );
    try {
      const response = await addPurchaseHook(purchaseDetails, branchId);
      if (response) {
        const purchaseId = response.purchaseId;
        const createdAt = response.createdAt;
        setIsSuccess(true);
        setSelectedProducts([]);
        reduxDispatch(addPurchase({ purchaseDetails, createdAt, purchaseId }));
      }
    } catch (error) {
      setIsError(true);
    }
  };
  const handleQuantityChange = (action, productId) => {
    setSelectedProducts((prevProducts) => {
      return prevProducts
        .map((product) => {
          if (product.productId === productId) {
            const newQuantity =
              action === "increase"
                ? Math.min(product.quantity + 1, product.maxQuantity)
                : Math.max(product.quantity - 1, 0);
            return { ...product, quantity: newQuantity };
          }
          return product;
        })
        .filter((product) => product.quantity > 0);
    });
  };
  const handleClose = () => {
    setIsSuccess(false);
  };
  const handleCloseError = () => {
    setIsError(false);
  };
  const handleDeleteProduct = (productId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((product) => product.productId !== productId)
    );
  };

  const calculateTotalPrice = () => {
    return selectedProducts
      .reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <>
      {isLoading && (
        <Loader description={"Saving Purchase Information, please wait..."} />
      )}
      <div className="fixed top-0 left-0 flex items-center justify-center p-5 md:p-10 lg:px-28 lg:py-10 h-screen w-screen bg-zinc-800 bg-opacity-50 z-50 font-Poppins">
        <div className="flex flex-col md:flex-row h-full w-full bg-bg-mc rounded-lg">
          <div className="flex flex-col w-full md:w-3/4 p-4 md:p-6 2xl:p-8">
            <div className="flex flex-row gap-3 mb-6 items-center">
              <nav className="w-2/5">
                <div className="flex gap-2 bg-white shadow-md shadow-gray-200 p-2 text-p-sm md:text-p-rg rounded-lg w-fit font-medium border">
                  <button
                    className={`px-2 py-1 rounded-md ${
                      selectType === "Product"
                        ? "bg-c-primary text-f-light"
                        : "bg-none text-p-sc md:text-p-sm text-f-gray"
                    }`}
                    onClick={() => setSelectType("Product")}
                  >
                    Product
                  </button>
                  <button
                    className={`px-2 py-1 rounded-md ${
                      selectType === "Service"
                        ? "bg-c-primary text-f-light"
                        : "bg-none text-p-sc md:text-p-sm text-f-gray"
                    }`}
                    onClick={() => setSelectType("Service")}
                  >
                    Service
                  </button>
                </div>
              </nav>
              <div className="w-3/5 flex gap-4">
                <div className="flex justify-center items-center rounded-lg px-4 border font-normal hover:cursor-pointer bg-white h-12">
                  <select
                    className={`hover:cursor-pointer focus:outline-none w-fit bg-white ${
                      sortOption === "" ? "text-f-gray" : "text-f-dark"
                    }`}
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="" disabled selected>
                      Sort by
                    </option>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                    <option value="price-l">Low (Price)</option>
                    <option value="price-h">High (Price)</option>
                  </select>
                </div>
                <div className="flex flex-row border px-4 rounded-lg justify-center items-center w-full gap-2 bg-white h-12">
                  <IoMdSearch className="h-6 w-6 text-f-dark" />
                  <input
                    type="text"
                    className="w-full focus:outline-none placeholder-f-gray2 text-p-sm md:text-p-rg"
                    placeholder="Search product... "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="overflow-auto w-full">
              {selectType === "Product" ? (
                <PosTable
                  onProductSelect={handleProductSelect}
                  searchTerm={searchTerm}
                  sortOption={sortOption}
                />
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="w-full md:w-2/5 h-full bg-white border-l flex flex-col rounded-r-md">
            <header className="p-6 flex justify-between items-center border-b">
              <article className="text-p-sc md:text-p-sm font-medium">
                <p className="text-f-gray2">
                  Dispense To:
                  <br />
                  <span className="text-f-dark">WalkIn/PatientName</span>
                </p>
              </article>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-md border hover:bg-zinc-50"
              >
                &times;
              </button>
            </header>
            <div className="h-full overflow-auto">
              {selectedProducts.map((product) => (
                <div
                  className="px-6 py-6 border-f-gray border-b flex gap-8"
                  key={product.productId}
                >
                  <button
                    onClick={() => handleDeleteProduct(product.productId)}
                    className="text-2xl hover:text-red-500"
                  >
                    &times;
                  </button>
                  <div className="w-full flex justify-between items-start">
                    <section>
                      <h1 className="text-p-sm md:text-p-rg font-medium mb-1">
                        {product.product_name}
                      </h1>
                      <p className="text-f-gray2">Php {product.price}</p>
                    </section>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="w-8 h-8 border bg-white rounded-md text-f-dark flex items-center justify-center focus:outline-none"
                        onClick={() =>
                          handleQuantityChange("decrease", product.productId)
                        }
                      >
                        -
                      </button>

                      <input
                        type="text"
                        value={product.quantity}
                        className="w-10 h-8 text-center text-p-lg font-semibold bg-white text-f-dark focus:outline-c-primary"
                      />

                      <button
                        type="button"
                        className="w-8 h-8 border bg-c-primary rounded-md text-f-light flex items-center justify-center focus:outline-none"
                        onClick={() =>
                          handleQuantityChange("increase", product.productId)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <div className="mx-6 py-4 mb-4 border-t border-f-gray">
                <div className="flex flex-col gap-2">
                  <section className="text-p-sm text-f-gray2 font-normal w-full flex justify-between">
                    <p>Subtotal (Items):</p>
                    <p>Php. 0.00</p>
                  </section>
                  <section className="text-p-sm text-f-gray2 font-normal w-full flex justify-between">
                    <p>Subtotal (Service):</p>
                    <p>Php. 0.00</p>
                  </section>
                  <section className="text-p-rg text-f-dark font-medium w-full flex justify-between">
                    <p>Total:</p>
                    <p className="font-semibold text-c-primary">
                      Php. {calculateTotalPrice()}
                    </p>
                  </section>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  className="w-full py-3 bg-bg-con rounded-md text-f-light text-p-sm md:text-p-rg font-medium hover:bg-opacity-75 active:bg-pressed-branch"
                  onClick={handlePurchase}
                >
                  Process Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal
        title={"Purchase Added Successfully"}
        description={
          "Your purchase has been added successfully. Thank you for your order!"
        }
        isOpen={isSuccess}
        onClose={handleClose}
      />

      <ErrorModal
        title={"No Products Selected"}
        description={
          "Please select at least one product before proceeding to checkout."
        }
        isOpen={isError}
        onClose={handleCloseError}
      />
    </>
  );
};

export default PointOfSale;
