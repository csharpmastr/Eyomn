import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  addProductService,
  updateProductService,
} from "../../Service/InventoryService";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";
import { addProduct, updateProduct } from "../../Slice/InventorySlice";
import { IoMdCloseCircleOutline } from "react-icons/io";
import Modal from "./Modal";
const AddEditProduct = ({ onClose, productDetails, title, productId }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const user = useSelector((state) => state.reducer.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [doesExists, setDoesExists] = useState(false);
  const reduxDispatch = useDispatch();
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const [errors, setErrors] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalDescription, setErrorModalDescription] = useState("");
  const [error, setError] = useState(false);
  let branchId =
    (user.branches && user.branches.length > 0 && user.branches[0].branchId) ||
    user.userId;
  const initialFormData = {
    category: "",
    product_name: "",
    retail_price: "",
    price: "",
    quantity: "",
    brand: "",
    expirationDate: "",

    len_type: "",
    color_material: "",
    eyeglass_category: "",
    // Medication
    prescrip_otc: "",
    md_form: "",
    dosage: "",
    // Contact Lens
    ct_type: "",
    ct_material: "",
    // Other Product
    other_description: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const cleanFormData = (data) => {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value !== "" && value !== null
      )
    );
  };

  useEffect(() => {
    console.log(productDetails);
    console.log(productId);

    if (productDetails) {
      setSelectedCategory(productDetails.category);
      setFormData({
        ...initialFormData,
        ...productDetails,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [productId]);

  const getMinDate = () => {
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    return nextYear.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    const parsedValue =
      name === "price" || name === "quantity" || name.includes("quantity")
        ? Number(value)
        : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;

    setSelectedCategory(selectedValue);

    setFormData((prevData) => ({
      ...prevData,
      category: selectedValue,
    }));
  };
  const resetForm = () => {
    setFormData({
      category: "",
      product_name: "",
      retail_price: "",
      price: "",
      quantity: "",
      brand: "",
      expirationDate: "",

      // Eye Glasses
      len_type: "",
      color_material: "",
      eyeglass_category: "",

      // Medication
      prescrip_otc: "",
      md_form: "",
      dosage: "",

      // Contact Lens
      ct_type: "",
      ct_material: "",

      // Other Product
      other_description: "",
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.product_name || formData.product_name.trim() === "") {
      newErrors.product_name = "(Product name is required)";
    }

    if (!formData.retail_price || formData.retail_price <= 0) {
      newErrors.retail_price = "(Retail Price is required)";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "(Price is required)";
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = "(Quantity is required)";
    }

    if (!formData.brand || formData.brand.trim() === "") {
      newErrors.brand = "(Brand is required)";
    }

    if (
      (selectedCategory === "Medication" ||
        selectedCategory === "Contact Lens") &&
      (!formData.expirationDate || formData.expirationDate === "")
    ) {
      newErrors.expirationDate = "(Expiration date is required)";
    }

    //================================================================================

    if (selectedCategory === "Medication") {
      if (!formData.prescrip_otc || formData.prescrip_otc === "") {
        newErrors.prescrip_otc = "(Please select Prescription or OTC)";
      }

      if (!formData.md_form || formData.md_form === "") {
        newErrors.md_form = "(Medicine form is required)";
      }

      if (!formData.dosage || formData.dosage.trim() === "") {
        newErrors.dosage = "(Dosage and strength are required)";
      }
    }

    if (selectedCategory === "Contact Lens") {
      if (!formData.ct_type || formData.ct_type === "") {
        newErrors.ct_type = "(Contact lens type is required)";
      }

      if (!formData.ct_material || formData.ct_material.trim() === "") {
        newErrors.ct_material = "(Lens material is required)";
      }
    }

    if (selectedCategory === "Eye Glass") {
      if (!formData.eyeglass_category || formData.eyeglass_category === "") {
        newErrors.eyeglass_category = "(Eye glass category is required)";
      }
      if (!formData.len_type || formData.len_type === "") {
        newErrors.len_type = "(Lens type is required)";
      }

      if (!formData.color_material || formData.color_material === "") {
        newErrors.color_material = "(Color / Material is required)";
      }
    }

    if (selectedCategory === "Other") {
      if (!formData.other_description || formData.other_description === "") {
        newErrors.other_description = "(Product description is required)";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddEditProduct = async () => {
    // if (!validateForm()) {
    //   return;
    // }
    setIsLoading(true);
    try {
      const cleanedData = cleanFormData(formData);

      if (!productDetails) {
        const response = await addProductService(
          branchId,
          cleanedData,
          accessToken,
          refreshToken,
          user.firebaseUid
        );

        if (response.status === 200) {
          setIsSuccess(true);
          setModalTitle("Product Added");
          setModalDescription(
            "The product has been successfully added to the system."
          );
          setSelectedCategory("");
          resetForm();
          console.log(response);

          const productId = response.data.productId;
          const productSKU = response.data.productSKU;
          reduxDispatch(
            addProduct({
              ...cleanedData,
              productId,
              isDeleted: false,
              productSKU,
            })
          );
        }
      } else {
        console.log(cleanedData);

        const response = await updateProductService(
          branchId,
          productId,
          cleanedData,
          accessToken,
          refreshToken
        );

        if (response) {
          setIsSuccess(true);
          setModalTitle("Product Updated");
          setModalDescription(
            "The product has been successfully updated in the system."
          );

          reduxDispatch(updateProduct({ ...cleanedData, productId }));
        }
      }
    } catch (error) {
      if (error.status === 409) {
        setErrorModalTitle("Invalid request");
        setErrorModalDescription("The product already exists.");
        setDoesExists(true);
      } else {
        setErrorModalTitle("Invalid request");
        setErrorModalDescription("We can't process your request right now.");
        setError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <>
      {isLoading ? (
        <Loader description={"Saving Product Information, please wait..."} />
      ) : (
        <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
          <div className="w-[380px] md:w-[600px] md:mr-8">
            <header className="px-3 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
              <h1 className="text-p-lg text-c-secondary font-semibold">
                {title}
              </h1>
              <button onClick={onClose}>&times;</button>
            </header>
            <div className="bg-white h-[480px] md:h-[600px] overflow-y-scroll">
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
                    disabled={productDetails}
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
                          Product Name{" "}
                          <span className="text-red-400">
                            {(formData.product_name === "" ||
                              errors.product_name) &&
                              errors.product_name}
                          </span>
                        </label>
                        <input
                          type="text"
                          name="product_name"
                          value={formData.product_name}
                          onChange={handleChange}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.product_name
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
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
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.eyeglass_category
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
                        >
                          <option value="" disabled className="text-c-gray3">
                            Select Eye Glass Category
                          </option>
                          <option value="Graded">Graded</option>
                          <option value="Non Graded">Non Graded</option>
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
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.len_type
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
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
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.color_material
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
                          placeholder="Enter color eme and material"
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
                          htmlFor="product_name"
                          className="text-p-sm text-c-gray3 font-medium"
                        >
                          Product Name{" "}
                          <span className="text-red-400">
                            {(formData.product_name === "" ||
                              errors.product_name) &&
                              errors.product_name}
                          </span>
                        </label>
                        <input
                          type="text"
                          name="product_name"
                          value={formData.product_name}
                          onChange={handleChange}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.product_name
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
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
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.prescrip_otc
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
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
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.md_form
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
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
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.dosage
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
                          placeholder="Enter dosage and strength"
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
                          htmlFor="product_name"
                          className="text-p-sm text-c-gray3 font-medium"
                        >
                          Product Name{" "}
                          <span className="text-red-400">
                            {(formData.product_name === "" ||
                              errors.product_name) &&
                              errors.product_name}
                          </span>
                        </label>
                        <input
                          type="text"
                          name="product_name"
                          value={formData.product_name}
                          onChange={handleChange}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.product_name
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
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
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.ct_type
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
                        >
                          <option value="" disabled className="text-c-gray3">
                            Select Type
                          </option>
                          <option value="Disposable">Disposable</option>
                          <option value="Monthly">Monthly - Reusable</option>
                          <option value="Yearly">Yearly - Reusable</option>
                        </select>
                      </section>
                      <section>
                        <label
                          htmlFor="ct_material"
                          className="text-p-sm text-c-gray3 font-medium"
                        >
                          Lens Material{" "}
                          <span className="text-red-400">
                            {(formData.ct_material === "" ||
                              errors.ct_material) &&
                              errors.ct_material}
                          </span>
                        </label>
                        <input
                          type="text"
                          name="ct_material"
                          value={formData.ct_material}
                          onChange={handleChange}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.ct_material
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
                          placeholder="Enter contact lens material"
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
                          htmlFor="product_name"
                          className="text-p-sm text-c-gray3 font-medium"
                        >
                          Product Name{" "}
                          <span className="text-red-400">
                            {(formData.product_name === "" ||
                              errors.product_name) &&
                              errors.product_name}
                          </span>
                        </label>
                        <input
                          type="text"
                          name="product_name"
                          value={formData.product_name}
                          onChange={handleChange}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.product_name
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
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
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.other_description
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
                          placeholder="Enter product description"
                        />
                      </section>
                    </div>
                  )}
                  {selectedCategory && (
                    <>
                      {selectedCategory === "Medication" ||
                      selectedCategory === "Contact Lens" ? (
                        <section>
                          <label
                            htmlFor="expirationDate"
                            className="text-p-sm text-c-gray3 font-medium"
                          >
                            Expiration Date{" "}
                            <span className="text-red-400">
                              {(formData.expirationDate === "" ||
                                errors.expirationDate) &&
                                errors.expirationDate}
                            </span>
                          </label>
                          <input
                            type="date"
                            name="expirationDate"
                            value={formData.expirationDate}
                            onChange={handleChange}
                            min={getMinDate()}
                            className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                              errors.expirationDate
                                ? "border-red-400 focus:outline-red-400"
                                : "border-c-gray3 focus:outline-c-primary"
                            }`}
                          />
                        </section>
                      ) : (
                        ""
                      )}
                      <div className="flex gap-4">
                        <div className="w-1/2">
                          <label
                            htmlFor="price"
                            className="text-p-sm text-c-gray3 font-medium"
                          >
                            Price{" "}
                            <span className="text-red-400">
                              {(formData.price === "" || errors.price) &&
                                errors.price}
                            </span>
                          </label>
                          <input
                            type="number"
                            name="price"
                            min={0}
                            value={formData.price}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                              errors.price
                                ? "border-red-400 focus:outline-red-400"
                                : "border-c-gray3 focus:outline-c-primary"
                            }`}
                            placeholder="Enter product price"
                          />
                        </div>
                        <div className="w-1/2">
                          <label
                            htmlFor="retail_price"
                            className="text-p-sm text-c-gray3 font-medium"
                          >
                            Retail Price{" "}
                            <span className="text-red-400">
                              {(formData.retail_price === "" ||
                                errors.retail_price) &&
                                errors.retail_price}
                            </span>
                          </label>
                          <input
                            type="number"
                            name="retail_price"
                            min={0}
                            value={formData.retail_price}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                              errors.retail_price
                                ? "border-red-400 focus:outline-red-400"
                                : "border-c-gray3 focus:outline-c-primary"
                            }`}
                            placeholder="Enter retail price"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1/4">
                          <label
                            htmlFor="quantity"
                            className="text-p-sm text-c-gray3 font-medium"
                          >
                            Quantity{" "}
                            <span className="text-red-400">
                              {(formData.quantity === "" || errors.quantity) &&
                                errors.quantity}
                            </span>
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            min={0}
                            value={formData.quantity}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                              errors.quantity
                                ? "border-red-400 focus:outline-red-400"
                                : "border-c-gray3 focus:outline-c-primary"
                            }`}
                            placeholder="0"
                          />
                        </div>
                        <div className="w-3/4">
                          <label
                            htmlFor="eye_brand"
                            className="text-p-sm text-c-gray3 font-medium"
                          >
                            Brand{" "}
                            <span className="text-red-400">
                              {(formData.brand === "" || errors.brand) &&
                                errors.brand}
                            </span>
                          </label>
                          <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                              errors.brand
                                ? "border-red-400 focus:outline-red-400"
                                : "border-c-gray3 focus:outline-c-primary"
                            }`}
                            placeholder="Enter brand"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <footer className="flex justify-end px-3 py-6 bg-white border border-t-f-gray rounded-b-lg">
              <button
                className="ml-2 px-8 py-2 bg-bg-con text-f-light text-p-rg font-semibold rounded-md"
                type="submit"
                onClick={handleAddEditProduct}
              >
                Save
              </button>
            </footer>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={isSuccess}
        onClose={() => {
          if (productDetails) {
            onClose();
          }
          setIsSuccess(false);
        }}
        title={modalTitle}
        description={modalDescription}
      />
      <Modal
        isOpen={doesExists}
        onClose={() => {
          setDoesExists(false) || setError(false);
        }}
        title={errorModalTitle}
        icon={<IoMdCloseCircleOutline className="w-24 h-24 text-red-700" />}
        className="w-[600px] h-auto p-4"
        overlayDescriptionClassName={
          "text-center font-Poppins pt-5 text-black text-[18px]"
        }
        description={errorModalDescription}
      ></Modal>
    </>,
    document.body
  );
};

export default AddEditProduct;
