import React, { useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import PhList from "../../assets/Data/location_list.json";
import { useAddPatient } from "../../Hooks/useAddPatient";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";

const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const AddEditPatient = ({ onClose, title }) => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.reducer.user.user);
  const { addPatientHook, isLoading, error } = useAddPatient();
  const branches = user.branches;
  const doctorId = user.userId;
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
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
    reason_visit: "check up",
  });
  const handleChangeBranch = (e) => {
    const branchId = e.target.value;

    if (errors.branch) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        branch: "",
      }));
    }

    setSelectedBranchId(branchId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "birthdate") {
        updatedData.age = calculateAge(value);
      }

      return updatedData;
    });
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
      if (!selectedBranchId) newErrors.branch = "Please select a branch";
      if (
        !formData.first_name ||
        !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(formData.first_name)
      )
        newErrors.first_name = "(First name is required)";

      if (
        !formData.last_name ||
        !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(formData.last_name)
      )
        newErrors.last_name = "(Last name is required)";

      if (!formData.sex) newErrors.sex = "(Sex is required)";

      if (!formData.birthdate)
        newErrors.birthdate = "(Date of birth is required)";

      //call validateForm before saving
    } else if (currentCardIndex === 1) {
      if (!formData.civil_status)
        newErrors.civil_status = "(Civil status is required)";

      if (
        !formData.contact_number ||
        !/^09\d{9}$/.test(formData.contact_number)
      )
        newErrors.contact_number =
          "(A valid 11-digit contact number is required)";

      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "(Valid email is required)";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await addPatientHook(
        formData,
        doctorId,
        selectedBranchId
      );
      if (response) {
        setIsSuccess(true);
      }
    } catch (error) {}
  };
  return (
    <>
      {isLoading ? (
        <Loader description={"Saving Patient Information, please wait..."} />
      ) : (
        <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
          <div className="w-[380px] md:w-[600px]">
            <header className="p-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
              <h1 className="text-p-rg md:text-p-lg text-c-secondary font-medium">
                {title}
              </h1>
              <button onClick={onClose}>&times;</button>
            </header>
            <form className="bg-white h-[500px] md:h-[600px] overflow-y-scroll">
              {currentCardIndex == 0 ? (
                <div className="p-3 md:p-6 ">
                  <header className="flex justify-between">
                    <h1
                      className={`text-p-sm md:text-p-rg font-medium text-c-secondary flex justify-center items-center ${
                        user.role === "2" ? "" : "mb-5"
                      }`}
                    >
                      | Personal Information
                    </h1>
                    {user.role === "2" && (
                      <div className="flex flex-col items-end">
                        <span className="text-red-400 text-right">
                          {(selectedBranchId === "" || errors.branch) &&
                            errors.branch}
                        </span>
                        <select
                          name="branchId"
                          value={selectedBranchId}
                          onChange={handleChangeBranch}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.branch
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
                        >
                          <option value="" disabled className="text-c-gray3">
                            Select Branch
                          </option>
                          {branches.map((branch, key) => (
                            <option key={key} value={branch.branchId}>
                              {branch.branchName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </header>
                  <section>
                    <label
                      htmlFor="first_name"
                      className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                    >
                      First Name{" "}
                      <span className="text-red-400">
                        {(formData.first_name === "" || errors.first_name) &&
                          errors.first_name}
                      </span>
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
                      placeholder="Enter first Name"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="last_name"
                      className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                    >
                      Last Name{" "}
                      <span className="text-red-400">
                        {(formData.last_name === "" || errors.last_name) &&
                          errors.last_name}
                      </span>
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
                      placeholder="Enter last Name"
                    />
                  </section>
                  <section>
                    <label
                      htmlFor="middle_name"
                      className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
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
                  <section>
                    <label
                      htmlFor="birthdate"
                      className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                    >
                      Date of Birth{" "}
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
                      max={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 2)
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                      min={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 120)
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                      className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                        errors.birthdate
                          ? "border-red-400 focus:outline-red-400"
                          : "border-c-gray3 focus:outline-c-primary"
                      }`}
                    />
                  </section>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="age"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        min={0}
                        value={formData.age}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                        disabled
                        placeholder="Enter age"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="sex"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Sex{" "}
                        <span className="text-red-400">
                          {(formData.sex === "" || errors.sex) && errors.sex}
                        </span>
                      </label>
                      <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark ${
                          errors.sex
                            ? "border-red-400 focus:outline-red-400"
                            : "border-c-gray3 focus:outline-c-primary"
                        }`}
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Sex
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="None">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 md:p-6">
                  <div className="mb-4">
                    <header>
                      <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary mb-4">
                        | Status Information
                      </h1>
                    </header>
                    <section>
                      <label
                        htmlFor="civil_status"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Civil Status{" "}
                        <span className="text-red-400">
                          {(formData.civil_status === "" ||
                            errors.civil_status) &&
                            errors.civil_status}
                        </span>
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
                          Select Status
                        </option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </section>
                    <section>
                      <label
                        htmlFor="occupation"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Occupation (Optional)
                      </label>
                      <select
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                          errors.occupation
                            ? "border-red-400 focus:outline-red-400"
                            : "border-c-gray3 focus:outline-c-primary"
                        }`}
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select occupation
                        </option>
                        <option value="Employed">Employed</option>
                        <option value="Unemployed">Unemployed</option>
                      </select>
                    </section>
                  </div>
                  <div>
                    <header>
                      <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary mb-4">
                        | Contact Information
                      </h1>
                    </header>
                    <div className="flex gap-4 mb-4">
                      <div className="w-1/2">
                        <label
                          htmlFor="province"
                          className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
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
                          className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
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
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Contact Number{" "}
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
                        className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                          errors.contact_number
                            ? "border-red-400 focus:outline-red-400"
                            : "border-c-gray3 focus:outline-c-primary"
                        }`}
                        placeholder="Enter contact number"
                      />
                    </section>
                    <section>
                      <label
                        htmlFor="email"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Email Address{" "}
                        <span className="text-red-400">
                          {(formData.email === "" || errors.email) &&
                            errors.email}
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark ${
                          errors.email
                            ? "border-red-400 focus:outline-red-400"
                            : "border-c-gray3 focus:outline-c-primary"
                        }`}
                        placeholder="Enter email address"
                      />
                    </section>
                  </div>
                </div>
              )}
            </form>
            <footer className="flex justify-end px-4 py-3 gap-4 bg-white border border-t-f-gray rounded-b-lg">
              {currentCardIndex == 0 ? (
                <button
                  className="px-4 lg:px-12 py-2 text-f-dark text-p-sm md:text-p-rg font-medium rounded-md border shadow-sm hover:bg-sb-org"
                  onClick={onClose}
                >
                  Cancel
                </button>
              ) : (
                <button
                  className="px-4 lg:px-12 py-2 text-f-dark text-p-sm md:text-p-rg font-medium rounded-md border shadow-sm hover:bg-sb-org"
                  onClick={handleBack}
                  disabled={currentCardIndex === 0}
                >
                  Go Back
                </button>
              )}
              {currentCardIndex == 0 ? (
                <button
                  className="px-4 lg:px-12 py-2 bg-bg-con  text-f-light text-p-sm md:text-p-rg font-medium rounded-md  hover:bg-opacity-75"
                  onClick={handleNext}
                  disabled={currentCardIndex === 1}
                >
                  Continue
                </button>
              ) : (
                <button
                  className="px-4 lg:px-12 py-2 bg-bg-con text-f-light text-p-sm md:text-p-rg font-medium rounded-md  hover:bg-opacity-75"
                  onClick={handleSubmit}
                  disabled={currentCardIndex !== 1}
                >
                  Add Patient
                </button>
              )}
            </footer>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={isSuccess}
        title={"Patient Added!"}
        description={`The patient has been successfully registered in the system.`}
        onClose={() => onClose()}
      />
    </>
  );
};

export default AddEditPatient;
