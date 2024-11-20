import React, { useState } from "react";
import PaymentHistory from "./PaymentHistory";
import { addPurchaseService, addService } from "../../Service/InventoryService";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Loader from "./Loader";
import { addPurchase, addServices } from "../../Slice/InventorySlice";
import SuccessModal from "./SuccessModal";

const PaymentBreakdown = () => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const [isSuccess, setIsSuccess] = useState(false);
  const reduxDispatch = useDispatch();
  const user = useSelector((state) => state.reducer.user.user);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const { patientId } = useParams();
  const patient = patients.find((patient) => patient.patientId === patientId);
  console.log(patient);

  let branchId =
    (user.branches && user.branches.length > 0 && user.branches[0].branchId) ||
    user.userId;
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [selectType, setSelectType] = useState("Service");
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

  const servicePriceMapping = {
    "Basic Eye Exam": 350,
    "Pediatric Eye Exam": 500,
    "Cataract & Glaucoma Assessment": 1000,
    "Low Vision & Strabismus": 1200,
  };

  const handleToggle = (e) => {
    e.preventDefault();
    setHistoryOpen(!isHistoryOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const numericFields = ["product_qty", "product_price", "service_price"];
    const newValue = numericFields.includes(name) ? Number(value) : value;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: newValue };

      if (name === "service_type" && value === "") {
        updatedFormData.service_price = 0;
        updatedFormData.service_other = "";
      }

      if (name === "service_type" && servicePriceMapping[value]) {
        updatedFormData.service_price = servicePriceMapping[value];
      }

      return updatedFormData;
    });
  };
  const handleClose = () => {
    setIsSuccess(false);
  };
  const calculateTotal = () => {
    const productTotal = formData.product_qty * formData.product_price || 0;
    const serviceTotal = parseFloat(formData.service_price) || 0;
    return productTotal + serviceTotal;
  };

  const handleSubmit = async () => {
    console.log("handleSubmit triggered");
    if (
      selectType === "Product" &&
      (!formData.product_name || formData.product_qty <= 0)
    ) {
      alert("Please fill in product details and quantity.");
      return;
    }

    if (selectType === "Service" && !formData.service_type) {
      alert("Please select a service type.");
      return;
    }

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
        console.log(patient.branchId, patient.doctorId);

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
          setIsSuccess(true);
          handleClearForm();
        }
      } else {
        const { service_type, service_price, service_other, ...productData } =
          formData;

        submittedData = productData;
        console.log(submittedData);

        const response = await addPurchaseService(
          submittedData,
          branchId,
          user.userId,
          user.firebaseUid,
          accessToken,
          refreshToken
        );
        if (response) {
          const purchaseId = response.purchaseId;
          const createdAt = response.createdAt;

          reduxDispatch(
            addPurchase({
              submittedData,
              purchaseId: purchaseId,
              createdAt: createdAt,
            })
          );
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const handleClearForm = () => {
    setFormData({
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
          {selectType === "Service" && (
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
                      <option value="" className="text-f-gray">
                        None
                      </option>
                      <option value="Basic Eye Exam">Basic Eye Exam</option>
                      <option value="Pediatric Eye Exam">
                        Pediatric Eye Exam
                      </option>
                      <option value="Cataract & Glaucoma Assessment">
                        Cataract & Glaucoma Assessment
                      </option>
                      <option value="Low Vision & Strabismus">
                        Low Vision & Strabismus
                      </option>
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
                      disabled={!formData.service_type}
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
            Confirm Payment{" "}
            {(formData.product_qty > 0 || formData.service_price > 0) && (
              <>( Php: {calculateTotal()} )</>
            )}
          </button>
        </div>
        <SuccessModal
          isOpen={isSuccess}
          title={"Payment Success"}
          description={`Patient's product or service fee has been paid successfully.`}
          onClose={handleClose}
        />{" "}
        {isHistoryOpen && <PaymentHistory onClose={handleToggle} />}
      </div>
    </>
  );
};

export default PaymentBreakdown;
