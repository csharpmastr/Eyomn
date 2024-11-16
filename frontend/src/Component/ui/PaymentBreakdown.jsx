import React, { useState } from "react";

const PaymentBreakdown = () => {
  const [selectType, setSelectType] = useState("Product");
  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    product_description: "",
    product_price: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (selectType === "Product") {
      console.log("Product Data:", formData);
    } else {
      console.log("Service Data: TBD");
    }
  };

  return (
    <>
      <header className="flex w-full h-fit justify-between items-center mb-4">
        <h1 className="text-p-sm md:text-p-rg font-medium text-f-dark">
          Payment Breakdown
        </h1>
        <button>History</button>
      </header>
      <div className="w-full flex items-center justify-center my-4">
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
      <div className="w-full h-full">
        {selectType === "Product" ? (
          <>
            <div className="flex gap-4 w-full">
              <section className="w-1/2">
                <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                  Brand
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
            <div className="w-full">
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
            </div>
            <div className="w-full flex gap-4 items-end">
              <section className="w-1/3">
                <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                  Product Price
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
              <button
                className="w-2/3 rounded-md bg-c-primary py-3 h-fit text-f-light"
                onClick={handleSubmit}
              >
                Save Payment
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-full gap-4 flex">
              <section className="w-1/2">
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
                    Select Category
                  </option>
                  <option value="Eye Glass">Consulation</option>
                  <option value="Contact Lens">Checkup</option>
                </select>
              </section>
              <section className="w-1/2">
                <label className="text-p-sc md:text-p-sm text-c-gray3 font-medium">
                  Other
                </label>
                <input
                  type="text"
                  name="service_other"
                  value={formData.service_other}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                  placeholder="If option not available"
                />
              </section>
            </div>
            <div>dasdasdas Ano lalagay</div>
            <div>bagyuhan na </div>
            <div>bukas ko na to ausin</div>
            <button
              className="w-full rounded-md bg-c-primary py-3 h-fit text-f-light"
              onClick={handleSubmit}
            >
              Save Service Payment
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default PaymentBreakdown;
