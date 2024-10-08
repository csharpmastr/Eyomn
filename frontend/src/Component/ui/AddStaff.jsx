import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FiUser } from "react-icons/fi";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useSelector } from "react-redux";
import Select from "react-select";
import PhList from "../../assets/Data/location_list.json";

const AddStaff = ({ onClose }) => {
  const [image, setImage] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [repeatPass, setRepeatPass] = useState("");
  const [passVisible, setPassVisible] = useState(false);
  const [cpVisible, setCpVisible] = useState(false);
  const user = useSelector((state) => state.reducer.user.user);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    full_name: "",
    birthdate: "",
    province: "",
    municipality: "",
    email: "",
    contact: "",
    role: "",
    emp_type: "",
    password: "",
    clinicId: user.userId,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    if (name === "confirmpassword") {
      setRepeatPass(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedMunicipality(null);
    setFormData((prevData) => ({
      ...prevData,
      province: selectedOption ? selectedOption.value : "",
      municipality: "",
    }));
  };

  const handleMunicipalityChange = (selectedOption) => {
    setSelectedMunicipality(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      municipality: selectedOption ? selectedOption.value : "",
    }));
  };

  const provinceOptions = Object.keys(PhList).reduce((acc, regionKey) => {
    const provinceList = PhList[regionKey].province_list;
    return [
      ...acc,
      ...Object.keys(provinceList).map((provinceName) => ({
        value: provinceName,
        label: provinceName,
      })),
    ];
  }, []);

  const municipalities =
    selectedProvince &&
    Object.keys(
      PhList[
        Object.keys(PhList).find(
          (regionKey) => PhList[regionKey].province_list[selectedProvince.value]
        )
      ].province_list[selectedProvince.value].municipality_list
    ).map((municipalityName) => ({
      value: municipalityName,
      label: municipalityName,
    }));

  const handleNext = () => {
    const isValid = validateForm();
    if (isValid) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const [isMonOn, setIsMonOn] = useState(true);
  const [isTueOn, setIsTueOn] = useState(true);
  const [isWedOn, setIsWedOn] = useState(true);
  const [isThuOn, setIsThuOn] = useState(true);
  const [isFriOn, setIsFriOn] = useState(true);
  const [isSatOn, setIsSatOn] = useState(false);
  const [isSunOn, setIsSunOn] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    if (currentCardIndex === 0) {
      if (
        !formData.full_name ||
        !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(formData.full_name)
      )
        newErrors.full_name = "(Full name is required)";

      if (!formData.birthdate)
        newErrors.birthdate = "(Date of birth is required)";

      if (
        !formData.contact_number ||
        !/^09\d{9}$/.test(formData.contact_number)
      )
        newErrors.contact_number =
          "(A valid 11-digit contact number is required)";
    } else if (currentCardIndex === 1) {
      if (!formData.role) newErrors.role = "(Please select a role)";

      if (!formData.emp_type)
        newErrors.emp_type = "(Please select an employment type)";

      //call validateForm before saving
    } else if (currentCardIndex === 2) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "(Valid email is required)";

      if (
        !formData.password ||
        !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/.test(
          formData.password
        )
      )
        newErrors.password =
          "(Invalid password. Ensure it has at least 8 characters, including uppercase, lowercase, numbers, and special characters)";

      if (formData.password !== repeatPass)
        newErrors.confirmpassword = "(Passwords do not match)";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[500px] md:w-[600px] md:mr-8">
        <header className="px-3 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-lg text-c-secondary font-semibold">
            {currentCardIndex === 0 && "Personal Information & Contact"}
            {currentCardIndex === 1 && "Job Role & Working Hours"}
            {currentCardIndex === 2 && "Login Credentials"}
          </h1>
          <button onClick={onClose}>&times;</button>
        </header>
        <form>
          {currentCardIndex === 0 && (
            <div className="p-6 bg-white h-[600px] overflow-y-scroll">
              <label className="flex items-center mb-8 gap-4">
                {image ? (
                  <img
                    src={image}
                    alt="Staff"
                    className="h-24 w-24 rounded-full object-cover hover:cursor-pointer"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-blue-200 flex justify-center items-center text-gray-500">
                    <FiUser className="w-12 h-12" />
                  </div>
                )}

                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <button
                      type="button"
                      className="text-blue-400 text-lg font-medium"
                      onClick={() =>
                        document.getElementById("imageUpload").click()
                      }
                    >
                      Upload
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                      type="button"
                      className="text-red-400 text-lg font-medium"
                      onClick={handleRemoveImage}
                      disabled={!image}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm">An image of the staff</p>
                </div>
              </label>
              <div className="mb-5">
                <header>
                  <h1 className="text-p-rg font-medium text-c-secondary mb-5">
                    | Personal Information
                  </h1>
                </header>
                <section>
                  <label
                    htmlFor="full_name"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Full Name:{" "}
                    <span className="text-red-400">
                      {(formData.full_name === "" || errors.full_name) &&
                        errors.full_name}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Enter full name of staff"
                  />
                </section>
                <section>
                  <label
                    htmlFor="birthdate"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Date of Birth:{" "}
                    <span className="text-red-400">
                      {(formData.birthdate === "" || errors.birthdate) &&
                        errors.birthdate}
                    </span>
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  />
                </section>
              </div>
              <div>
                <header>
                  <h1 className="text-p-rg font-medium text-c-secondary mb-4">
                    | Contact Information
                  </h1>
                </header>
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label
                      htmlFor="province"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Province
                    </label>
                    <Select
                      id="province"
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      options={provinceOptions}
                      placeholder="Select Province"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      htmlFor="municipality"
                      className="text-p-sm text-c-gray3 font-medium"
                    >
                      Municipality
                    </label>
                    <Select
                      id="municipality"
                      name="municipality"
                      options={municipalities}
                      value={selectedMunicipality}
                      onChange={handleMunicipalityChange}
                      placeholder="Select Municipality"
                      isDisabled={!selectedProvince}
                    />
                  </div>
                </div>
                <section>
                  <label
                    htmlFor="contact_number"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Contact Number:{" "}
                    <span className="text-red-400">
                      {(formData.contact_number === "" ||
                        errors.contact_number) &&
                        errors.contact_number}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Enter contact number"
                  />
                </section>
              </div>
            </div>
          )}
          {currentCardIndex === 1 && (
            <div className="p-6 bg-white h-[600px] overflow-y-scroll">
              <div className="mb-5">
                <header>
                  <h1 className="text-p-rg font-medium text-c-secondary mb-4">
                    | Position Information
                  </h1>
                </header>
                <section>
                  <label
                    htmlFor="role"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Role:{" "}
                    <span className="text-red-400">
                      {(formData.role === "" || errors.role) && errors.role}
                    </span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  >
                    <option value="" disabled className="text-c-gray3">
                      Select Role
                    </option>
                    <option value="Ophthalmologist">Ophthalmologist</option>
                    <option value="Optometrist">Optometrist</option>
                    <option value="Staff">Staff</option>
                  </select>
                </section>
                <section>
                  <label
                    htmlFor="emp_type"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Employment Type{" "}
                    <span className="text-red-400">
                      {(formData.emp_type === "" || errors.emp_type) &&
                        errors.emp_type}
                    </span>
                  </label>
                  <select
                    name="emp_type"
                    value={formData.emp_type}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  >
                    <option value="" disabled className="text-c-gray3">
                      Select Employment Type
                    </option>
                    <option value="fulltime">Full Time</option>
                    <option value="parttime">Part Time</option>
                  </select>
                </section>
              </div>
              <div>
                <header>
                  <h1 className="text-p-rg font-medium text-c-secondary mb-4">
                    | Working Hours
                  </h1>
                </header>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-6 flex items-center bg-${
                        isMonOn ? "blue-500" : "gray-300"
                      } rounded-full p-1 cursor-pointer`}
                      onClick={() => setIsMonOn(!isMonOn)}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                          isMonOn ? "translate-x-6" : "translate-x-0"
                        } transition-transform`}
                      ></div>
                    </div>
                    <label
                      htmlFor="mon"
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Monday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isMonOn ? (
                      <>
                        <input
                          type="time"
                          name="mon_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="mon_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-6 flex items-center bg-${
                        isTueOn ? "blue-500" : "gray-300"
                      } rounded-full p-1 cursor-pointer`}
                      onClick={() => setIsTueOn(!isTueOn)}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                          isTueOn ? "translate-x-6" : "translate-x-0"
                        } transition-transform`}
                      ></div>
                    </div>
                    <label
                      htmlFor="tues"
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Tuesday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isTueOn ? (
                      <>
                        <input
                          type="time"
                          name="tues_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="tues_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-6 flex items-center bg-${
                        isWedOn ? "blue-500" : "gray-300"
                      } rounded-full p-1 cursor-pointer`}
                      onClick={() => setIsWedOn(!isWedOn)}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                          isWedOn ? "translate-x-6" : "translate-x-0"
                        } transition-transform`}
                      ></div>
                    </div>
                    <label
                      htmlFor="wed"
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Wednesday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isWedOn ? (
                      <>
                        <input
                          type="time"
                          name="wed_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="wed_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-6 flex items-center bg-${
                        isThuOn ? "blue-500" : "gray-300"
                      } rounded-full p-1 cursor-pointer`}
                      onClick={() => setIsThuOn(!isThuOn)}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                          isThuOn ? "translate-x-6" : "translate-x-0"
                        } transition-transform`}
                      ></div>
                    </div>
                    <label
                      htmlFor="thu"
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Thursday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isThuOn ? (
                      <>
                        <input
                          type="time"
                          name="thu_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="thu_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-6 flex items-center bg-${
                        isFriOn ? "blue-500" : "gray-300"
                      } rounded-full p-1 cursor-pointer`}
                      onClick={() => setIsFriOn(!isFriOn)}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                          isFriOn ? "translate-x-6" : "translate-x-0"
                        } transition-transform`}
                      ></div>
                    </div>
                    <label
                      htmlFor="fri"
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Friday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isFriOn ? (
                      <>
                        <input
                          type="time"
                          name="fri_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="fri_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-6 flex items-center bg-${
                        isSatOn ? "blue-500" : "gray-300"
                      } rounded-full p-1 cursor-pointer`}
                      onClick={() => setIsSatOn(!isSatOn)}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                          isSatOn ? "translate-x-6" : "translate-x-0"
                        } transition-transform`}
                      ></div>
                    </div>
                    <label
                      htmlFor="sat"
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Saturday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isSatOn ? (
                      <>
                        <input
                          type="time"
                          name="sat_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="sat_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-6 flex items-center ${
                        isSunOn ? "bg-blue-500" : "bg-gray-300"
                      } rounded-full p-1 cursor-pointer`}
                      onClick={() => setIsSunOn(!isSunOn)}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                          isSunOn ? "translate-x-6" : "translate-x-0"
                        } transition-transform`}
                      ></div>
                    </div>
                    <label
                      htmlFor="sun"
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Sunday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isSunOn ? (
                      <>
                        <input
                          type="time"
                          name="sun_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="sun_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentCardIndex === 2 && (
            <div className="p-6 bg-white h-[600px] overflow-y-scroll">
              <div className="mb-5">
                <header>
                  <h1 className="text-p-rg font-medium text-c-secondary mb-4">
                    | Email & Password
                  </h1>
                </header>
                <section>
                  <label
                    htmlFor="email"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Email Address:{" "}
                    <span className="text-red-400">
                      {(formData.email === "" || errors.email) && errors.email}
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Enter email"
                  />
                </section>
                <section>
                  <label
                    htmlFor="password"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Password:{" "}
                    <span className="text-red-400">
                      {(formData.password === "" || errors.password) &&
                        errors.password}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={passVisible ? "text" : "password"}
                      name="password"
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      className="absolute top-4 right-2 text-[#999999]"
                      onClick={() => setPassVisible(!passVisible)}
                    >
                      {passVisible ? (
                        <MdOutlineRemoveRedEye className="w-6 h-6" />
                      ) : (
                        <FaRegEyeSlash className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </section>
                <section>
                  <label
                    htmlFor="confirmpassword"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Confirm Password:{" "}
                    <span className="text-red-400">
                      {(repeatPass === "" || errors.confirmpassword) &&
                        errors.confirmpassword}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={cpVisible ? "text" : "password"}
                      name="confirmpassword"
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      className="absolute top-4 right-2 text-[#999999]"
                      onClick={() => setCpVisible(!cpVisible)}
                    >
                      {cpVisible ? (
                        <MdOutlineRemoveRedEye className="w-6 h-6" />
                      ) : (
                        <FaRegEyeSlash className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}
        </form>
        <footer className="flex justify-end px-3 py-6 bg-white border-2 border-t-f-gray rounded-b-lg">
          {currentCardIndex > 0 && (
            <button
              className="px-8 py-2 text-c-secondary text-p-rg font-semibold rounded-md"
              onClick={handleBack}
            >
              Back
            </button>
          )}

          {currentCardIndex < 2 && (
            <button
              className="ml-2 px-8 py-2 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
              onClick={handleNext}
            >
              Next
            </button>
          )}

          {currentCardIndex === 2 && (
            <button className="ml-2 px-8 py-2 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary">
              Save
            </button>
          )}
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default AddStaff;
