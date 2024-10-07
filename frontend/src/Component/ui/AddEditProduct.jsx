import React, { useState } from "react";
import ReactDOM from "react-dom";

const AddEditProduct = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[400px] md:w-[600px] md:mr-8">
        <header className="px-3 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-lg text-c-secondary font-semibold">
            Manage Product
          </h1>
          <button onClick={onClose}>&times;</button>
        </header>
        <div className="bg-white h-[600px] overflow-y-scroll">
          <div className="p-3 md:p-8">
            <section>
              <header>
                <h1 className="text-p-rg font-semibold text-c-secondary">
                  | Product Category
                </h1>
              </header>
              <select
                name="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="mt-2 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-5 focus:outline-c-primary"
              >
                <option value="" disabled className="text-c-gray3">
                  Select Category
                </option>
                <option value="Eye Glass">Eye Glass</option>
                <option value="Contact Lens">Contact Lens</option>
                <option value="Medication">Medication</option>
                <option value="Other">Other</option>
              </select>
            </section>
            <div>
              {selectedCategory === "Eye Glass" && (
                <div>
                  <header>
                    <h1 className="text-p-rg font-semibold text-c-secondary mb-5">
                      | Eye Glass Details
                    </h1>
                  </header>
                  <section>
                    <label
                      htmlFor="product_name"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Product Name:
                    </label>
                    <input
                      type="text"
                      name="product_name"
                      //value={formData.product_name}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter product name"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="eyeglass_category"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Eye Glass Category:
                    </label>
                    <select
                      name="eyeglass_category"
                      //value={formData.eyeglass_category}
                      //onChange={handleChange}
                      className="mt-2 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-5 focus:outline-c-primary"
                    >
                      <option value="" disabled className="text-c-gray3">
                        Select Eye Glass Category
                      </option>
                      <option value="graded">Graded</option>
                      <option value="not_graded">Not Graded</option>
                    </select>
                  </section>
                  <section>
                    <label
                      htmlFor="len_type"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Lens Type:
                    </label>
                    <input
                      type="text"
                      name="color_material"
                      //value={formData.color_material}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Single Vision / Bifocal / Progressive / Special Coatings"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="color_material"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Color/Material:
                    </label>
                    <input
                      type="text"
                      name="len_type"
                      //value={formData.color_material}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter color eme and material"
                    />
                  </section>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="quantity"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Quantity:
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        min={0}
                        //  value={formData.quantity}
                        //  onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="price"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Price:
                      </label>
                      <input
                        type="text"
                        name="price"
                        //value={formData.price}
                        //onChange={handleChange}
                        className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter product price"
                      />
                    </div>
                  </div>
                  <section>
                    <label
                      htmlFor="brand"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Brand:
                    </label>
                    <input
                      type="text"
                      name="brand"
                      //value={formData.brand}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter brand"
                    />
                  </section>
                </div>
              )}
              {selectedCategory === "Contact Lens" && (
                <div>
                  <header>
                    <h1 className="text-p-rg font-semibold text-c-secondary mb-5">
                      | Medication Product Details
                    </h1>
                  </header>
                  <section>
                    <label
                      htmlFor="product_name"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Product Name:
                    </label>
                    <input
                      type="text"
                      name="md_product_name"
                      //value={formData.md_product_name}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter medication product name"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="prescrip_otc"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Prescription or OTC:
                    </label>
                    <select
                      name="prescrip_otc"
                      //value={formData.prescrip_otc}
                      //onChange={handleChange}
                      className="mt-2 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-5 focus:outline-c-primary"
                    >
                      <option value="" disabled className="text-c-gray3">
                        Select Type
                      </option>
                      <option value="prescription">Prescription</option>
                      <option value="otc">OTC</option>
                    </select>
                  </section>
                  <section>
                    <label
                      htmlFor="md_form"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Form:
                    </label>
                    <select
                      name="md_form"
                      //value={formData.md_form}
                      //onChange={handleChange}
                      className="mt-2 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-5 focus:outline-c-primary"
                    >
                      <option value="" disabled className="text-c-gray3">
                        Select Form
                      </option>
                      <option value="eye drop">Eye Drop</option>
                      <option value="-">-</option>
                    </select>
                  </section>
                  <section>
                    <label
                      htmlFor="dosage"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Dosage and Strength:
                    </label>
                    <input
                      type="text"
                      name="dosage"
                      //value={formData.dosage}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter dosage and strength"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="expdate"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Expiration Date:
                    </label>
                    <input
                      type="date"
                      name="expdate"
                      //  value={formData.expdate}
                      //  onChange={handleChange}
                      className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </section>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="md_quantity"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Quantity:
                      </label>
                      <input
                        type="number"
                        name="md_quantity"
                        min={0}
                        //  value={formData.md_quantity}
                        //  onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="md_price"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Price:
                      </label>
                      <input
                        type="text"
                        name="md_price"
                        //value={formData.md_price}
                        //onChange={handleChange}
                        className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter product price"
                      />
                    </div>
                  </div>
                  <section>
                    <label
                      htmlFor="md_brand"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Brand:
                    </label>
                    <input
                      type="text"
                      name="md_brand"
                      //value={formData.md_brand}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter brand"
                    />
                  </section>
                </div>
              )}
              {selectedCategory === "Medication" && (
                <div>
                  <header>
                    <h1 className="text-p-rg font-semibold text-c-secondary mb-5">
                      | Contact Lens Details
                    </h1>
                  </header>
                  <section>
                    <label
                      htmlFor="cl_product_name"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Product Name:
                    </label>
                    <input
                      type="text"
                      name="cl_product_name"
                      //value={formData.cl_product_name}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter contact lens name"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="ct_type"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Type of Lens:
                    </label>
                    <select
                      name="ct_type"
                      //value={formData.ct_type}
                      //onChange={handleChange}
                      className="mt-2 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-5 focus:outline-c-primary"
                    >
                      <option value="" disabled className="text-c-gray3">
                        Select Type
                      </option>
                      <option value="disposable">Disposable</option>
                      <option value="monthly">Monthly - Reusable</option>
                      <option value="yearly">Yearly - Reusable</option>
                    </select>
                  </section>
                  <section>
                    <label
                      htmlFor="ct_material"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Lens Material:
                    </label>
                    <input
                      type="text"
                      name="ct_material"
                      //value={formData.ct_material}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter contact lens material"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="ct_expdate"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Expiration Date:
                    </label>
                    <input
                      type="date"
                      name="ct_expdate"
                      //  value={formData.ct_expdate}
                      //  onChange={handleChange}
                      className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </section>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="ct_quantity"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Quantity:
                      </label>
                      <input
                        type="number"
                        name="ct_quantity"
                        min={0}
                        //  value={formData.ct_quantity}
                        //  onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="ct_price"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Price:
                      </label>
                      <input
                        type="text"
                        name="ct_price"
                        //value={formData.ct_price}
                        //onChange={handleChange}
                        className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter product price"
                      />
                    </div>
                  </div>
                  <section>
                    <label
                      htmlFor="ct_brand"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Brand:
                    </label>
                    <input
                      type="text"
                      name="ct_brand"
                      //value={formData.ct_brand}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter brand"
                    />
                  </section>
                </div>
              )}
              {selectedCategory === "Other" && (
                <div>
                  <header>
                    <h1 className="text-p-rg font-semibold text-c-secondary mb-5">
                      | Product Details
                    </h1>
                  </header>
                  <section>
                    <label
                      htmlFor="other_product_name"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Product Name:
                    </label>
                    <input
                      type="text"
                      name="other_product_name"
                      //value={formData.other_product_name}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter product name"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="other_description"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Product Description:
                    </label>
                    <textarea
                      type="text"
                      name="other_description"
                      //value={formData.other_description}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 h-24 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter product description"
                    />
                  </section>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="other_quantity"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Quantity:
                      </label>
                      <input
                        type="number"
                        name="other_quantity"
                        min={0}
                        //  value={formData.other_quantity}
                        //  onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="other_price"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Price:
                      </label>
                      <input
                        type="text"
                        name="other_price"
                        //value={formData.other_price}
                        //onChange={handleChange}
                        className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter product price"
                      />
                    </div>
                  </div>
                  <section>
                    <label
                      htmlFor="ct_brand"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Brand:
                    </label>
                    <input
                      type="text"
                      name="ct_brand"
                      //value={formData.ct_brand}
                      //onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter brand"
                    />
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
        <footer className="flex justify-end px-3 py-6 bg-white border border-t-f-gray rounded-b-lg">
          <button className="ml-2 px-8 py-2 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary">
            Save
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default AddEditProduct;
