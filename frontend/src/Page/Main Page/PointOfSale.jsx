import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import PosTable from "../../Component/ui/PosTable";
import { useDispatch, useSelector } from "react-redux";
import { useAddPurchase } from "../../Hooks/useAddPurchase";
import Loader from "../../Component/ui/Loader";
import SuccessModal from "../../Component/ui/SuccessModal";
import { addPurchase, addServices } from "../../Slice/InventorySlice";
import ErrorModal from "../../Component/ui/ErrorModal";
import { useNavigate } from "react-router-dom";
import { addService } from "../../Service/InventoryService";

const PointOfSale = ({ onClose, patient }) => {
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

    const filteredPurchaseDetails = selectedProducts.filter(
      (item) => item.type !== "service"
    );

    if (filteredPurchaseDetails.length === 0 && !formData.service_type) {
      setIsError(true);
      alert("No valid products or services available for purchase.");
      return;
    }

    const payload = {
      purchaseDetails: selectedProducts
        .filter((item) => item.type !== "service")
        .map(({ productId, productSKU, quantity, price }) => ({
          productId,
          productSKU,
          quantity,
          totalAmount: price * quantity,
        })),

      service: formData.service_type ? formData : {},
    };

    payload.service = formData.service_type ? formData : {};

    console.log(payload);

    try {
      if (patient) {
        const response = await addPurchaseHook(
          payload,
          patient.doctorId,
          user.userId,
          branchId,
          patient.patientId
        );

        if (response) {
          setIsSuccess(true);
          const { purchaseId, createdAt, serviceId } = response;
          if (purchaseId) {
            reduxDispatch(
              addPurchase({
                purchaseDetails: payload.purchaseDetails || [],
                createdAt,
                purchaseId,
                patientId: patient.patientId,
                doctorId: patient.doctorId,
              })
            );
          }

          if (serviceId) {
            reduxDispatch(
              addServices({
                ...formData,
                id: serviceId,
                createdAt,
                patientId: patient.patientId,
                doctorId: patient.doctorId,
              })
            );
          }
          setFormData([]);
          setSelectedProducts([]);
        }
      } else {
        console.log("here");

        const response = await addPurchaseHook(
          payload,
          null,
          user.userId,
          branchId,
          null
        );

        if (response) {
          setIsSuccess(true);
          const { purchaseId, createdAt, serviceId } = response;

          setSelectedProducts([]);

          if (purchaseId) {
            reduxDispatch(
              addPurchase({
                purchaseDetails: payload.purchaseDetails || [],
                createdAt,
                purchaseId,
              })
            );
            console.log("added");
          }
        }
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

  const calculateProductSubtotal = () => {
    return selectedProducts
      .filter((product) => product.type !== "service")
      .reduce((total, product) => total + product.price * product.quantity, 0)
      .toFixed(2);
  };

  const calculateServiceSubtotal = () => {
    return selectedProducts
      .filter((product) => product.type === "service")
      .reduce((total, service) => total + (service.price || 0), 0)
      .toFixed(2);
  };

  const services = [
    "Basic Eye Exam",
    "Pediatric Eye Exam",
    "Cataract & Glaucoma Assessment",
    "Low Vision & Strabismus",
    "Custom",
  ];

  const servicePrices = {
    "Basic Eye Exam": 350,
    "Pediatric Eye Exam": 500,
    "Cataract & Glaucoma Assessment": 1000,
    "Low Vision & Strabismus": 1200,
  };

  const [formData, setFormData] = useState({
    service_type: "",
    service_price: 0,
    service_additional: "",
  });

  const handleServiceSelection = (service) => {
    setFormData((prev) => ({
      ...prev,
      service_type: service,
      service_price: service === "Custom" ? 0 : servicePrices[service],
      // service_other: service === "Custom" ? "" : prev.service_other,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "service_price" ? parseFloat(value) : value,
    }));
  };

  const handleServiceAvail = () => {
    if (!formData.service_type) return;

    if (formData.service_type === "Custom") {
      if (!formData.service_additional.trim()) {
        alert("Please specify the custom service name.");
        return;
      }

      if (formData.service_price <= 0) {
        alert("Please specify a valid price for the custom service.");
        return;
      }
    }

    const serviceName =
      formData.service_type === "Custom"
        ? formData.service_other
        : formData.service_type;

    const isServiceAlreadySelected = selectedProducts.some(
      (item) => item.product_name === serviceName
    );

    if (!isServiceAlreadySelected) {
      setSelectedProducts((prevProducts) => [
        ...prevProducts,
        {
          product_name: serviceName,
          price: formData.service_price,
          quantity: 1,
          type: "service",
        },
      ]);
    }
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
                <div className="w-full">
                  <section className="w-full grid grid-cols-3 2xl:grid-cols-5 gap-3 text-f-dark font-medium">
                    {services.map((service) => (
                      <button
                        key={service}
                        className={`flex-1 py-5 rounded-md text-p-sc md:text-p-sm ${
                          formData.service_type === service
                            ? "bg-c-branch text-f-light"
                            : "bg-zinc-200 text-f-gray2 hover:bg-hover-branch hover:text-c-gray3"
                        }`}
                        onClick={() => handleServiceSelection(service)}
                      >
                        {service}
                      </button>
                    ))}
                  </section>
                  <div className="mt-6 border-2 border-dashed border-f-gray rounded-md p-6">
                    <section>
                      <p className="text-c-gray3 font-medium text-p-sm">
                        Service Type:
                      </p>
                      {formData.service_type === "Custom" ? (
                        <input
                          type="text"
                          className="mt-1 w-2/6 px-4 py-3 border rounded-lg text-f-dark focus:outline-c-primary"
                          placeholder="Enter service type"
                        />
                      ) : (
                        <h6 className="text-c-primary font-medium text-p-lg">
                          {formData.service_type}
                        </h6>
                      )}
                    </section>
                    <hr className="border-f-gray my-4" />
                    <section className="w-2/6 mb-4">
                      <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                        Service Price
                      </label>
                      <input
                        type="number"
                        name="service_price"
                        value={formData.service_price}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-4 py-3 border rounded-lg text-f-dark focus:outline-c-primary"
                        placeholder="Enter amount"
                        min={0}
                        disabled={!formData.service_type}
                      />
                    </section>
                    <section className="w-full mb-4">
                      <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                        Additional Info (Optional)
                      </label>
                      <textarea
                        name="service_additional"
                        value={formData.service_additional}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-4 py-3 border rounded-lg text-f-dark focus:outline-c-primary resize-none"
                        placeholder="Leave blank if not applicable"
                        rows={3}
                      />
                    </section>
                    <div className="w-full flex justify-end">
                      <button
                        className="w-fit rounded-full bg-c-primary hover:opacity-75 px-12 py-3 h-fit text-f-light"
                        onClick={handleServiceAvail}
                      >
                        Service Avail
                      </button>
                    </div>
                  </div>
                </div>
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
              {selectedProducts.map((item) => (
                <div
                  className="px-6 py-6 border-f-gray border-b flex gap-8"
                  key={item.productId}
                >
                  <button
                    onClick={() => handleDeleteProduct(item.productId)}
                    className="text-2xl hover:text-red-500"
                  >
                    &times;
                  </button>
                  <div className="w-full flex justify-between items-start">
                    <section>
                      <h1 className="text-p-sm md:text-p-rg font-medium mb-1">
                        {item.product_name}
                      </h1>
                      <p className="text-f-gray2">
                        {item.type === "service" ? "Service Fee" : "Php"}{" "}
                        {item.price}
                      </p>
                    </section>
                    {item.type !== "service" && (
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="w-8 h-8 border bg-white rounded-md text-f-dark flex items-center justify-center focus:outline-none"
                          onClick={() =>
                            handleQuantityChange("decrease", item.productId)
                          }
                        >
                          -
                        </button>

                        <input
                          type="text"
                          value={item.quantity}
                          className="w-10 h-8 text-center text-p-lg font-semibold bg-white text-f-dark focus:outline-c-primary"
                        />

                        <button
                          type="button"
                          className="w-8 h-8 border bg-c-primary rounded-md text-f-light flex items-center justify-center focus:outline-none"
                          onClick={() =>
                            handleQuantityChange("increase", item.productId)
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <div className="mx-6 py-4 mb-4 border-t border-f-gray">
                <div className="flex flex-col gap-2">
                  <section className="text-p-sm text-f-gray2 font-normal w-full flex justify-between">
                    <p>Subtotal (Items):</p>
                    <p>Php. {calculateProductSubtotal()}</p>
                  </section>
                  <section className="text-p-sm text-f-gray2 font-normal w-full flex justify-between">
                    <p>Subtotal (Service):</p>
                    <p>Php. {calculateServiceSubtotal()}</p>
                  </section>
                  <section className="text-p-rg text-f-dark font-medium w-full flex justify-between">
                    <p>Total:</p>
                    <p className="font-semibold text-c-primary">
                      Php.{" "}
                      {(
                        parseFloat(calculateProductSubtotal()) +
                        parseFloat(calculateServiceSubtotal())
                      ).toFixed(2)}
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
