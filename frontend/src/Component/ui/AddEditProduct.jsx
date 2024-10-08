import React, { useState } from "react";
import ReactDOM from "react-dom";

const AddEditProduct = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    category: "",

    //Eye Glasses
    eye_product_name: "",
    eyeglass_category: "",
    len_type: "",
    color_material: "",
    eye_quantity: "",
    eye_price: "",
    eye_brand: "",

    //Medication
    md_product_name: "",
    prescrip_otc: "",
    md_form: "",
    dosage: "",
    md_expdate: "",
    md_quantity: "",
    md_price: "",
    md_brand: "",

    //Contact Lens
    cl_product_name: "",
    ct_type: "",
    ct_material: "",
    ct_expdate: "",
    ct_quantity: "",
    ct_price: "",
    ct_brand: "",

    //Other Product
    other_product_name: "",
    other_description: "",
    other_quantity: "",
    other_price: "",
    other_brand: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.category) {
      newErrors.category = "(Please select a category)";
    }

    if (selectedCategory === "Eye Glasses") {
      if (
        !formData.eye_product_name ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.eye_product_name)
      )
        newErrors.eye_product_name = "(Product name is required)";

      if (!formData.eyeglass_category)
        newErrors.eyeglass_category = "(Select eyeglass category)";

      if (
        !formData.len_type ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.len_type)
      )
        newErrors.len_type = "(Product lens type is required)";

      if (
        !formData.color_material ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.color_material)
      )
        newErrors.color_material = "(Product material is required)";

      if (!formData.eye_quantity || formData.eye_quantity <= 0)
        newErrors.eye_quantity = "(Input quantity)";

      if (!formData.price || formData.price <= 0)
        newErrors.price = "(Put product price)";

      if (
        !formData.eye_brand ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.eye_brand)
      )
        newErrors.eye_brand = "(Product brand is required)";
    } else if (selectedCategory === "Medication") {
      if (
        !formData.md_product_name ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.md_product_name)
      )
        newErrors.md_product_name = "(Product name is required)";

      if (!formData.prescrip_otc)
        newErrors.prescrip_otc = "(Select prescription or OTC)";

      if (!formData.md_form) newErrors.md_form = "(Select medication form)";

      if (!formData.dosage) newErrors.dosage = "(Input medication dosage)";

      if (!formData.md_expdate)
        newErrors.md_expdate = "(Input medication expiration)";

      if (!formData.md_quantity || formData.md_quantity <= 0)
        newErrors.md_quantity = "(Input quantity)";

      if (!formData.md_price || formData.md_price <= 0)
        newErrors.md_price = "(Put product price)";

      if (
        !formData.md_brand ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.md_brand)
      )
        newErrors.md_brand = "(Product brand is required)";
    } else if (selectedCategory === "Contact Lens") {
      if (
        !formData.cl_product_name ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.cl_product_name)
      )
        newErrors.cl_product_name = "(Product name is required)";

      if (!formData.ct_type) newErrors.ct_type = "(Select contact lens type)";

      if (
        !formData.ct_material ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.ct_material)
      )
        newErrors.ct_material = "(Product material is required)";

      if (!formData.ct_expdate)
        newErrors.ct_expdate = "(Input contact lens expiration)";

      if (!formData.ct_quantity || formData.ct_quantity <= 0)
        newErrors.ct_quantity = "(Input quantity)";

      if (!formData.ct_price || formData.ct_price <= 0)
        newErrors.ct_price = "(Put product price)";

      if (
        !formData.ct_brand ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.ct_brand)
      )
        newErrors.ct_brand = "(Product brand is required)";
    } else if (selectedCategory === "Other") {
      if (
        !formData.other_product_name ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.other_product_name)
      )
        newErrors.other_product_name = "(Product name is required)";

      if (
        !formData.other_description ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.other_description)
      )
        newErrors.other_description = "(Product description is required)";

      if (!formData.other_quantity || formData.other_quantity <= 0)
        newErrors.other_quantity = "(Input quantity)";

      if (!formData.other_price || formData.other_price <= 0)
        newErrors.other_price = "(Put product price)";

      if (
        !formData.other_brand ||
        !/^[a-zA-Z0-9À-ÿ\\s,'-]{2,}$/.test(formData.other_brand)
      )
        newErrors.other_brand = "(Product brand is required)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
              <span className="text-red-400 text-p-sm">
                {(formData.first_name === "" || errors.first_name) &&
                  errors.first_name}
              </span>
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
                      htmlFor="eye_product_name"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Product Name{" "}
                      <span className="text-red-400">
                        {(formData.eye_product_name === "" ||
                          errors.eye_product_name) &&
                          errors.eye_product_name}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="eye_product_name"
                      value={formData.eye_product_name}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter product name"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="eyeglass_category"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Eye Glass Category{" "}
                      <span className="text-red-400">
                        {(formData.eyeglass_category === "" ||
                          errors.eyeglass_category) &&
                          errors.eyeglass_category}
                      </span>
                    </label>
                    <select
                      name="eyeglass_category"
                      value={formData.eyeglass_category}
                      onChange={handleChange}
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
                      Lens Type{" "}
                      <span className="text-red-400">
                        {(formData.len_type === "" || errors.len_type) &&
                          errors.len_type}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="len_type"
                      value={formData.len_type}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Single Vision / Bifocal / Progressive / Special Coatings"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="color_material"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Color/Material{" "}
                      <span className="text-red-400">
                        {(formData.color_material === "" ||
                          errors.color_material) &&
                          errors.color_material}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="color_material"
                      value={formData.color_material}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter color eme and material"
                    />
                  </section>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="eye_quantity"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Quantity{" "}
                        <span className="text-red-400">
                          {(formData.eye_quantity === "" ||
                            errors.eye_quantity) &&
                            errors.eye_quantity}
                        </span>
                      </label>
                      <input
                        type="number"
                        name="eye_quantity"
                        min={0}
                        value={formData.eye_quantity}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="eye_price"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Price{" "}
                        <span className="text-red-400">
                          {(formData.eye_price === "" || errors.eye_price) &&
                            errors.eye_price}
                        </span>
                      </label>
                      <input
                        type="text"
                        name="eye_price"
                        value={formData.eye_price}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter product price"
                      />
                    </div>
                  </div>
                  <section>
                    <label
                      htmlFor="eye_brand"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Brand{" "}
                      <span className="text-red-400">
                        {(formData.eye_brand === "" || errors.eye_brand) &&
                          errors.eye_brand}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="eye_brand"
                      value={formData.eye_brand}
                      onChange={handleChange}
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
                      | Medication Product Details
                    </h1>
                  </header>
                  <section>
                    <label
                      htmlFor="md_product_name"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Product Name{" "}
                      <span className="text-red-400">
                        {(formData.md_product_name === "" ||
                          errors.md_product_name) &&
                          errors.md_product_name}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="md_product_name"
                      value={formData.md_product_name}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter medication product name"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="prescrip_otc"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Prescription or OTC{" "}
                      <span className="text-red-400">
                        {(formData.prescrip_otc === "" ||
                          errors.prescrip_otc) &&
                          errors.prescrip_otc}
                      </span>
                    </label>
                    <select
                      name="prescrip_otc"
                      value={formData.prescrip_otc}
                      onChange={handleChange}
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
                      Medicine Form{" "}
                      <span className="text-red-400">
                        {(formData.md_form === "" || errors.md_form) &&
                          errors.md_form}
                      </span>
                    </label>
                    <select
                      name="md_form"
                      value={formData.md_form}
                      onChange={handleChange}
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
                      Dosage and Strength{" "}
                      <span className="text-red-400">
                        {(formData.dosage === "" || errors.dosage) &&
                          errors.dosage}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter dosage and strength"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="md_expdate"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Expiration Date{" "}
                      <span className="text-red-400">
                        {(formData.md_expdate === "" || errors.md_expdate) &&
                          errors.md_expdate}
                      </span>
                    </label>
                    <input
                      type="date"
                      name="md_expdate"
                      value={formData.md_expdate}
                      onChange={handleChange}
                      className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </section>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="md_quantity"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Quantity{" "}
                        <span className="text-red-400">
                          {(formData.md_quantity === "" ||
                            errors.md_quantity) &&
                            errors.md_quantity}
                        </span>
                      </label>
                      <input
                        type="number"
                        name="md_quantity"
                        min={0}
                        value={formData.md_quantity}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="md_price"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Pricey{" "}
                        <span className="text-red-400">
                          {(formData.md_price === "" || errors.md_price) &&
                            errors.md_price}
                        </span>
                      </label>
                      <input
                        type="text"
                        name="md_price"
                        value={formData.md_price}
                        onChange={handleChange}
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
                      Brand{" "}
                      <span className="text-red-400">
                        {(formData.md_brand === "" || errors.md_brand) &&
                          errors.md_brand}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="md_brand"
                      value={formData.md_brand}
                      onChange={handleChange}
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
                      | Contact Lens Details
                    </h1>
                  </header>
                  <section>
                    <label
                      htmlFor="cl_product_name"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Product Name{" "}
                      <span className="text-red-400">
                        {(formData.cl_product_name === "" ||
                          errors.cl_product_name) &&
                          errors.cl_product_name}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="cl_product_name"
                      value={formData.cl_product_name}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter contact lens name"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="ct_type"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Type of Lens{" "}
                      <span className="text-red-400">
                        {(formData.ct_type === "" || errors.ct_type) &&
                          errors.ct_type}
                      </span>
                    </label>
                    <select
                      name="ct_type"
                      value={formData.ct_type}
                      onChange={handleChange}
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
                      Lens Material{" "}
                      <span className="text-red-400">
                        {(formData.ct_material === "" || errors.ct_material) &&
                          errors.ct_material}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="ct_material"
                      value={formData.ct_material}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter contact lens material"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="ct_expdate"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Expiration Date{" "}
                      <span className="text-red-400">
                        {(formData.ct_expdate === "" || errors.ct_expdate) &&
                          errors.ct_expdate}
                      </span>
                    </label>
                    <input
                      type="date"
                      name="ct_expdate"
                      value={formData.ct_expdate}
                      onChange={handleChange}
                      className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </section>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="ct_quantity"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Quantity{" "}
                        <span className="text-red-400">
                          {(formData.ct_quantity === "" ||
                            errors.ct_quantity) &&
                            errors.ct_quantity}
                        </span>
                      </label>
                      <input
                        type="number"
                        name="ct_quantity"
                        min={0}
                        value={formData.ct_quantity}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="ct_price"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Price{" "}
                        <span className="text-red-400">
                          {(formData.ct_price === "" || errors.ct_price) &&
                            errors.ct_price}
                        </span>
                      </label>
                      <input
                        type="text"
                        name="ct_price"
                        value={formData.ct_price}
                        onChange={handleChange}
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
                      Brand{" "}
                      <span className="text-red-400">
                        {(formData.ct_brand === "" || errors.ct_brand) &&
                          errors.ct_brand}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="ct_brand"
                      value={formData.ct_brand}
                      onChange={handleChange}
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
                      Product Name{" "}
                      <span className="text-red-400">
                        {(formData.other_product_name === "" ||
                          errors.other_product_name) &&
                          errors.other_product_name}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="other_product_name"
                      value={formData.other_product_name}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter product name"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="other_description"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Product Description{" "}
                      <span className="text-red-400">
                        {(formData.other_description === "" ||
                          errors.other_description) &&
                          errors.other_description}
                      </span>
                    </label>
                    <textarea
                      type="text"
                      name="other_description"
                      value={formData.other_description}
                      onChange={handleChange}
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
                        Quantity{" "}
                        <span className="text-red-400">
                          {(formData.other_quantity === "" ||
                            errors.other_quantity) &&
                            errors.other_quantity}
                        </span>
                      </label>
                      <input
                        type="number"
                        name="other_quantity"
                        min={0}
                        value={formData.other_quantity}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="other_price"
                        className="text-p-sm text-c-gray3 font-medium"
                      >
                        Price{" "}
                        <span className="text-red-400">
                          {(formData.other_price === "" ||
                            errors.other_price) &&
                            errors.other_price}
                        </span>
                      </label>
                      <input
                        type="text"
                        name="other_price"
                        value={formData.other_price}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter product price"
                      />
                    </div>
                  </div>
                  <section>
                    <label
                      htmlFor="other_brand"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Brand{" "}
                      <span className="text-red-400">
                        {(formData.other_brand === "" || errors.other_brand) &&
                          errors.other_brand}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="other_brand"
                      value={formData.other_brand}
                      onChange={handleChange}
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
