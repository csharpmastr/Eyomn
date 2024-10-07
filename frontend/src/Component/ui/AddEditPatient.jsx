import React, { useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import PhList from "../../assets/Data/location_list.json";
import ReactDOM from "react-dom";

const AddEditPatient = ({ onClose }) => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const user = useSelector((state) => state.reducer.user.user);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    age: "",
    sex: "",
    birthdate: "",
    civil_status: "",
    occupation: "",
    province: "",
    municipality: "",
    contact_number: "",
    email: "",
    doctorId: "",
    reason_visit: "",
    clinicId: user.clinicId,
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

  const validateForm = () => {
    let newErrors = {};

    if (currentCardIndex === 0) {
      if (!formData.first_name)
        newErrors.first_name = "First name is required.";
      if (!formData.last_name) newErrors.last_name = "Last name is required.";
      if (!formData.age || formData.age <= 0)
        newErrors.age = "Age is required.";
      if (!formData.sex) newErrors.sex = "Sex is required.";
      if (!formData.birthdate)
        newErrors.birthdate = "Date of birth is required.";
    } else if (currentCardIndex === 1) {
      if (!formData.civil_status)
        newErrors.civil_status = "Civil status is required.";
      if (!formData.contact_number)
        newErrors.contact_number = "Contact number is required.";
      if (
        !formData.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        newErrors.email = "Valid email is required.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[400px] md:w-[600px] md:mr-8">
        <header className="px-3 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-lg text-c-secondary font-semibold">
            Patient Information
          </h1>
          <button onClick={onClose}>&times;</button>
        </header>
        <div className="bg-white h-[600px] overflow-y-scroll">
          {currentCardIndex == 0 ? (
            <div className="p-3 md:p-8">
              <header>
                <h1 className="text-p-rg font-medium text-c-secondary mb-5">
                  | Personal Information
                </h1>
              </header>
              <section>
                <label
                  htmlFor="first_name"
                  className="text-p-sm text-c-gray3 font-medium"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                    errors.first_name
                      ? "border-red-400 focus:outline-red-400"
                      : "border-c-gray3 focus:outline-c-primary"
                  }`}
                  placeholder={
                    errors.first_name ? errors.first_name : "Enter first Name"
                  }
                />
              </section>
              <section>
                <label
                  htmlFor="last_name"
                  className="text-p-sm text-c-gray3 font-medium"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                    errors.last_name
                      ? "border-red-400 focus:outline-red-400"
                      : "border-c-gray3 focus:outline-c-primary"
                  }`}
                  placeholder={
                    errors.last_name ? errors.last_name : "Enter last Name"
                  }
                />
              </section>
              <section>
                <label
                  htmlFor="middle_name"
                  className="text-p-sm text-c-gray3 font-medium"
                >
                  Middle Name (Optional)
                </label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  placeholder="Enter middle name"
                />
              </section>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label
                    htmlFor="age"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    min={0}
                    value={formData.age}
                    onChange={handleChange}
                    className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                      errors.age
                        ? "border-red-400 focus:outline-red-400"
                        : "border-c-gray3 focus:outline-c-primary"
                    }`}
                    placeholder={errors.age ? errors.age : "Enter age"}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="sex"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Sex
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                      errors.sex
                        ? "border-red-400 focus:outline-red-400"
                        : "border-c-gray3 focus:outline-c-primary"
                    }`}
                  >
                    <option value="" disabled className="text-c-gray3">
                      {errors.sex ? errors.sex : "Select Sex"}
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <section>
                <label
                  htmlFor="birthdate"
                  className="text-p-sm text-c-gray3 font-medium"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                    errors.birthdate
                      ? "border-red-400 focus:outline-red-400"
                      : "border-c-gray3 focus:outline-c-primary"
                  }`}
                />
              </section>
            </div>
          ) : (
            <div className="p-3 md:p-8">
              <div className="mb-4">
                <header>
                  <h1 className="text-p-rg font-medium text-c-secondary mb-4">
                    | Status Information
                  </h1>
                </header>
                <section>
                  <label
                    htmlFor="civil_status"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Civil Status
                  </label>
                  <select
                    name="civil_status"
                    value={formData.civil_status}
                    onChange={handleChange}
                    className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                      errors.civil_status
                        ? "border-red-400 focus:outline-red-400"
                        : "border-c-gray3 focus:outline-c-primary"
                    }`}
                  >
                    <option value="" disabled className="text-c-gray3">
                      {errors.civil_status
                        ? errors.civil_status
                        : "Select Status"}
                    </option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </section>
                <section>
                  <label
                    htmlFor="occupation"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Occupation (Optional)
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Enter occupation"
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
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                      errors.contact_number
                        ? "border-red-400 focus:outline-red-400"
                        : "border-c-gray3 focus:outline-c-primary"
                    }`}
                    placeholder={
                      errors.contact_number
                        ? errors.contact_number
                        : "Enter contact number"
                    }
                  />
                </section>
                <section>
                  <label
                    htmlFor="email"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                      errors.email
                        ? "border-red-400 focus:outline-red-400"
                        : "border-c-gray3 focus:outline-c-primary"
                    }`}
                    placeholder={
                      errors.email ? errors.email : "Enter email address"
                    }
                  />
                </section>
              </div>
            </div>
          )}
        </div>
        <footer className="flex justify-end px-3 py-6 bg-white border border-t-f-gray rounded-b-lg">
          {currentCardIndex == 0 ? (
            ""
          ) : (
            <button
              className="px-8 py-2 text-c-secondary text-p-rg font-semibold rounded-md"
              onClick={handleBack}
              disabled={currentCardIndex === 0}
            >
              Back
            </button>
          )}
          {currentCardIndex == 0 ? (
            <button
              className="ml-2 px-8 py-2 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
              onClick={handleNext}
              disabled={currentCardIndex === 1}
            >
              Next
            </button>
          ) : (
            <button
              className="ml-2 px-8 py-2 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
              onClick={handleNext}
              disabled={currentCardIndex === 1}
            >
              Save
            </button>
          )}
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default AddEditPatient;
