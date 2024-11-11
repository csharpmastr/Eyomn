import React, { useState } from "react";
import { IoMdCloseCircleOutline, IoMdSearch } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import PosTable from "../../Component/ui/PosTable";
import { useDispatch, useSelector } from "react-redux";
import { useAddPurchase } from "../../Hooks/useAddPurchase";
import Loader from "../../Component/ui/Loader";
import SuccessModal from "../../Component/ui/SuccessModal";
import { addPurchase } from "../../Slice/InventorySlice";
import Modal from "../../Component/ui/Modal";

const PointOfSale = () => {
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const reduxDispatch = useDispatch();
  const user = useSelector((state) => state.reducer.user.user);
  const { addPurchaseHook, isLoading, error } = useAddPurchase();
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };
  const handlePurchase = async () => {
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
                ? product.quantity + 1
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
      <div className="text-f-dark font-Poppins flex flex-col md:flex-row h-full">
        <div className="flex flex-col w-full md:w-3/4 p-4 md:p-6 2xl:p-8">
          <div className="flex flex-row gap-3 mb-6">
            <div className="flex justify-center items-center rounded-md px-4 py-3 border border-f-gray bg-bg-sub text-c-gray3 font-normal hover:cursor-pointer">
              <select
                className="hover:cursor-pointer focus:outline-none bg-bg-sub w-fit"
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
            <div className="flex flex-row border border-f-gray bg-bg-sub px-4 rounded-md justify-center items-center w-full gap-2">
              <IoMdSearch className="h-8 w-8 text-c-secondary" />
              <input
                type="text"
                className="w-full focus:outline-none placeholder-f-gray2 bg-bg-sub text-p-sm md:text-p-rg"
                placeholder="Search product... "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-auto w-full">
            <PosTable
              onProductSelect={handleProductSelect}
              searchTerm={searchTerm}
              sortOption={sortOption}
            />
          </div>
        </div>
        <div className="w-full md:w-2/5 h-full border border-l-f-gray bg-white flex flex-col">
          <header className="p-6">
            <h1 className="text-p-rg md:text-p-lg font-semibold text-f-dark">
              Checkout List
            </h1>
          </header>
          <div className="h-full overflow-y-scroll">
            {selectedProducts.map((product) => (
              <div
                className="px-6 py-6 border-f-gray border-b flex gap-8 "
                key={product.productId}
              >
                <button
                  onClick={() => handleDeleteProduct(product.productId)}
                  className="text-2xl"
                >
                  &times;
                </button>
                <div className="w-full">
                  <div className="flex justify-between">
                    <h1 className="text-p-sm md:text-p-rg font-semibold">
                      {product.product_name}
                    </h1>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="w-8 h-8 border border-c-gray3 rounded-md text-f-dark flex items-center justify-center focus:outline-none"
                        onClick={() =>
                          handleQuantityChange("decrease", product.productId)
                        }
                      >
                        -
                      </button>

                      <input
                        type="text"
                        value={product.quantity}
                        className="w-12 h-8 text-center border rounded-md border-c-gray3 text-f-dark focus:outline-c-primary"
                        readOnly
                      />

                      <button
                        type="button"
                        className="w-8 h-8 border border-c-gray3 rounded-md text-f-dark flex items-center justify-center focus:outline-none"
                        onClick={() =>
                          handleQuantityChange("increase", product.productId)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-f-gray2">Php {product.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <div className="rounded-lg bg-bg-sb p-6 mx-6 mb-4 shadow-md">
              <div className="flex justify-between text-rg">
                <p className="text-c-gray3">Total</p>
                <p className="font-semibold text-f-dark">
                  Php. {calculateTotalPrice()}
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                className="w-full h-12 bg-bg-con text-f-light text-p-sm md:text-p-rg font-semibold rounded-md"
                onClick={handlePurchase}
              >
                Process Checkout
              </button>
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
      <Modal
        isOpen={isError}
        onClose={handleCloseError}
        title={"Invalid Request"}
        description={"We can't process your request at this moment."}
        icon={<IoMdCloseCircleOutline className="w-24 h-24 text-red-700" />}
        className="w-[600px] h-auto p-4"
        overlayDescriptionClassName={
          "text-center font-Poppins pt-5 text-black text-[18px]"
        }
      />
    </>
  );
};

export default PointOfSale;
