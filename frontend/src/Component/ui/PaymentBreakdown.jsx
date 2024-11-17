import React, { useState } from "react";
import PaymentHistory from "./PaymentHistory";
import { addService } from "../../Service/InventoryService";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Loader from "./Loader";
import { addServices } from "../../Slice/InventorySlice";

const PaymentBreakdown = () => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const reduxDispatch = useDispatch();
  const user = useSelector((state) => state.reducer.user.user);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const { patientId } = useParams();
  const patient = patients.find((patient) => patient.patientId === patientId);
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [selectType, setSelectType] = useState("Product");
  const [formData, setFormData] = useState({
    date: today,
    product_code: "",
    product_name: "",
    category: "",
    product_description: "",
    product_qty: 0,
    product_price: 0,
    service_type: "",
    service_price: 0,
    service_other: "",
  });

  const handleToggle = () => setHistoryOpen(!isHistoryOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const numericFields = ["product_qty", "product_price", "service_price"];
    const newValue = numericFields.includes(name) ? Number(value) : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const calculateTotal = () => {
    const productTotal = formData.product_qty * formData.product_price || 0;
    const serviceTotal = parseFloat(formData.service_price) || 0;
    return productTotal + serviceTotal;
  };

  const handleSubmit = async () => {
    console.log(`${selectType} Data:`);
    console.log("Total Payment:", calculateTotal());
    setIsLoading(true);
    let submittedData = { ...formData };

    try {
      if (selectType === "Service") {
        const {
          product_name,
          category,
          product_description,
          product_qty,
          product_price,
          product_code,
          ...serviceData
        } = formData;

        submittedData = serviceData;

        const response = await addService(
          patient.branchId,
          patient.doctorId,
          patientId,
          submittedData,
          user.firebaseUid,
          accessToken,
          refreshToken
        );
        if (response) {
          reduxDispatch(
            addServices({ ...submittedData, id: response.serviceId })
          );
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <header className="flex w-full h-fit justify-between items-center mb-4">
        <h1 className="text-p-sm md:text-p-rg font-medium text-f-dark">
          Payment Breakdown
        </h1>
        <button
          onClick={handleToggle}
          className="bg-c-branch px-4 py-1 rounded-md text-f-light"
        >
          History
        </button>
      </header>
      <div className="w-full flex items-center justify-center my-6">
        <div className="bg-zinc-100 border p-1 text-p-sm rounded-md">
          <button
            className={`px-2 py-1 rounded-sm ${
              selectType === "Product" ? "bg-zinc-200" : ""
            }`}
            onClick={() => setSelectType("Product")}
          >
            Product
          </button>
          <button
            className={`px-2 py-1 rounded-sm ${
              selectType === "Service" ? "bg-zinc-200" : ""
            }`}
            onClick={() => setSelectType("Service")}
          >
            Service
          </button>
        </div>
      </div>
      <div className="w-full h-full flex-col flex justify-between">
        <div className="w-full flex flex-col gap-2">
          <div className="flex gap-4 w-full">
            <section className="w-1/2">
              <label
                htmlFor="date"
                className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
              >
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
              />
            </section>
          </div>

          {selectType === "Product" ? (
            <>
              <div className="flex gap-4 w-full">
                <section className="w-1/2">
                  <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                    placeholder="Enter product name"
                  />
                </section>
                <section className="w-1/2">
                  <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="Eye Glass">Eye Glass</option>
                    <option value="Contact Lens">Contact Lens</option>
                    <option value="Medication">Medication</option>
                    <option value="Other">Other</option>
                  </select>
                </section>
              </div>
              <section className="w-full">
                <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                  Description
                </label>
                <textarea
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary resize-none"
                  placeholder="Enter product description"
                  rows={2}
                />
              </section>
              <div className="w-full flex gap-4">
                <section className="w-2/5">
                  <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="product_qty"
                    min={0}
                    value={formData.product_qty}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                    placeholder="Enter quantity"
                  />
                </section>
                <section className="w-3/5">
                  <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                    Price
                  </label>
                  <input
                    type="number"
                    name="product_price"
                    min={0}
                    value={formData.product_price}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                    placeholder="Enter price"
                  />
                </section>
              </div>
            </>
          ) : (
            <>
              <div className="w-full gap-4 flex flex-col">
                <div className="w-full flex gap-4">
                  <section className="w-3/5">
                    <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                      Service Type
                    </label>
                    <select
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                    >
                      <option value="" disabled>
                        Select Service Type
                      </option>
                      <option value="Consultation">Consultation</option>
                      <option value="Checkup">Checkup</option>
                    </select>
                  </section>
                  <section className="w-2/5">
                    <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                      Service Price
                    </label>
                    <input
                      type="number"
                      name="service_price"
                      min={0}
                      value={formData.service_price}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                      placeholder="Enter amount"
                    />
                  </section>
                </div>
                <section className="w-full">
                  <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                    Other
                  </label>
                  <textarea
                    name="service_other"
                    value={formData.service_other}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary resize-none"
                    placeholder="If option not available"
                    rows={2}
                  />
                </section>
              </div>
            </>
          )}
        </div>
        <div className="w-full py-4">
          <button
            className="w-full rounded-md bg-c-primary py-3 h-fit text-f-light"
            onClick={handleSubmit}
          >
            Save Payment{" "}
            {(formData.product_qty > 0 || formData.service_price > 0) && (
              <>( Php: {calculateTotal()} )</>
            )}
          </button>
        </div>
        {isHistoryOpen && <PaymentHistory onClose={handleToggle} />}
      </div>
    </>
  );
};

export default PaymentBreakdown;
