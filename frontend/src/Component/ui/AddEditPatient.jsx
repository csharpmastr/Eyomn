import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import PhList from "../../assets/Data/location_list.json";
import { useAddPatient } from "../../Hooks/useAddPatient";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";
import Cookies from "universal-cookie";
import { updatePatientData } from "../../Service/PatientService";
import { updatePatient } from "../../Slice/PatientSlice";

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

  return age.toString();
};

const AddEditPatient = ({ onClose, title, patient }) => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.reducer.user.user);
  const { addPatientHook, isLoading, error } = useAddPatient();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const branches = user.branches;
  const doctorId = user.role === "3" ? patient.doctorId : user.userId;
  const reduxDispatch = useDispatch();
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

  useEffect(() => {
    if (patient) {
      setFormData({ ...patient });
      setSelectedBranchId(patient.branchId);
      console.log(patient.branchId);
      if (patient.province) {
        const initialProvince = {
          value: patient.province,
          label: patient.province,
        };
        setSelectedProvince(initialProvince);
      }

      if (patient.municipality) {
        const initialMunicipality = {
          value: patient.municipality,
          label: patient.municipality,
        };
        setSelectedMunicipality(initialMunicipality);
      }
    }
  }, [patient]);

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
        updatedData.age = `${calculateAge(value)}`;
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
      if (!selectedBranchId)
        newErrors.branch = "Please select a branch to continue.";

      if (
        !formData.first_name ||
        !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(formData.first_name)
      )
        newErrors.first_name =
          "Enter a valid first name (at least 2 characters).";

      if (
        !formData.last_name ||
        !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(formData.last_name)
      )
        newErrors.last_name =
          "Enter a valid last name (at least 2 characters).";

      if (!formData.sex) newErrors.sex = "Please select your gender.";

      if (!formData.birthdate)
        newErrors.birthdate = "Enter your date of birth.";
    } else if (currentCardIndex === 1) {
      if (!formData.civil_status)
        newErrors.civil_status = "Please select your civil status.";

      if (
        !formData.contact_number ||
        !/^09\d{9}$/.test(formData.contact_number)
      )
        newErrors.contact_number =
          "Enter a valid contact number (11 digits starting with 09).";

      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email =
          "Enter a valid email address (e.g., example@mail.com).";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const sanitizeFormData = (formData) => {
    const {
      patientId,
      doctorId,
      organizationId,
      branchId,
      createdAt,
      isDeleted,
      authorizedDoctor,
      ...sanitizedData
    } = formData;
    return sanitizedData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (!patient) {
        const response = await addPatientHook(
          formData,
          doctorId,
          selectedBranchId
        );
        if (response) {
          setIsSuccess(true);
        }
      } else {
        console.log("Updating an existing patient");
        const sanitizedData = sanitizeFormData(formData);
        console.log(sanitizedData);

        setIsUpdateLoading(true);

        const response = await updatePatientData(
          sanitizedData,
          patient.patientId,
          user.firebaseUid
        );
        if (response) {
          reduxDispatch(
            updatePatient({
              patientId: patient.patientId,
              data: sanitizedData,
            })
          );
          setIsSuccess(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdateLoading(false);
    }
  };
  return (
    <>
      {isLoading || isUpdateLoading ? (
        <Loader description={"Saving Patient Information, please wait..."} />
      ) : (
        <div className="fixed top-0 left-0 flex items-center justify-center md:justify-end p-5 md:p-3 h-screen w-screen bg-zinc-800 bg-opacity-50 z-50 font-Poppins">
          <div className="w-full md:w-[600px] h-fit md:h-full flex flex-col justify-between bg-white rounded-lg">
            <div className="h-full overflow-y-scroll">
              <header className="px-4 py-6 border-b flex justify-between items-center">
                <h1 className="text-p-rg md:text-p-lg text-f-dark font-medium">
                  {title}
                </h1>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-md border hover:bg-zinc-50"
                >
                  &times;
                </button>
              </header>
              <form>
                <section className="flex justify-center gap-10 my-6">
                  <div className="flex flex-col items-center gap-3">
                    <div className="border border-f-gray w-10 h-10 rounded-lg"></div>
                    <h1
                      className={`font-medium flex justify-center items-center ${
                        currentCardIndex === 0
                          ? "text-c-secondary text-p-sm md:text-p-rg transition-all duration-200 ease-in-out"
                          : "text-c-gray3 text-p-sc md:text-p-sm"
                      }`}
                    >
                      Personal Information
                    </h1>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="border border-f-gray w-10 h-10 rounded-lg"></div>
                    <h1
                      className={`font-medium flex justify-center items-center text-center ${
                        currentCardIndex === 1
                          ? "text-c-secondary text-p-sm md:text-p-rg transition-all duration-200 ease-in-out"
                          : "text-c-gray3 text-p-sc md:text-p-sm"
                      }`}
                    >
                      Status & Contact <br /> Information
                    </h1>
                  </div>
                </section>
                {currentCardIndex === 0 ? (
                  <div className="px-3 md:px-6 transition-all duration-200 ease-in-out">
                    {user.role === "2" && (
                      <section className="mb-4">
                        <label
                          htmlFor="first_name"
                          className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                        >
                          Branch patient{" "}
                          <span className="text-blue-500">*</span>
                        </label>
                        <div>
                          <select
                            name="branchId"
                            value={selectedBranchId}
                            onChange={handleChangeBranch}
                            className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark ${
                              errors.branch
                                ? "border-red-400 focus:outline-red-400"
                                : "border-f-gray focus:outline-c-primary"
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
                          <p className="text-red-400 text-p-sm mt-1">
                            {(selectedBranchId === "" || errors.branch) &&
                              errors.branch}
                          </p>
                        </div>
                      </section>
                    )}
                    <section className="mb-4">
                      <label
                        htmlFor="first_name"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        First Name <span className="text-blue-500">*</span>
                      </label>
                      <div>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark ${
                            errors.first_name
                              ? "border-red-400 focus:outline-red-400"
                              : "border-f-gray focus:outline-c-primary"
                          }`}
                          placeholder="Enter first Name"
                        />
                        <p className="text-red-400 text-p-sm mt-1">
                          {(formData.first_name === "" || errors.first_name) &&
                            errors.first_name}
                        </p>
                      </div>
                    </section>
                    <section className="mb-4">
                      <label
                        htmlFor="last_name"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Last Name <span className="text-blue-500">*</span>
                      </label>
                      <div>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark ${
                            errors.last_name
                              ? "border-red-400 focus:outline-red-400"
                              : "border-f-gray focus:outline-c-primary"
                          }`}
                          placeholder="Enter last Name"
                        />
                        <p className="text-red-400 text-p-sm mt-1">
                          {(formData.last_name === "" || errors.last_name) &&
                            errors.last_name}
                        </p>
                      </div>
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
                        className="mt-1 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
                      />
                    </section>
                    <div className="flex gap-4 mb-4">
                      <section className="w-3/4">
                        <label
                          htmlFor="birthdate"
                          className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                        >
                          Date of Birth <span className="text-blue-500">*</span>
                        </label>
                        <div>
                          <input
                            type="date"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleChange}
                            max={
                              new Date(
                                new Date().setFullYear(
                                  new Date().getFullYear() - 2
                                )
                              )
                                .toISOString()
                                .split("T")[0]
                            }
                            min={
                              new Date(
                                new Date().setFullYear(
                                  new Date().getFullYear() - 120
                                )
                              )
                                .toISOString()
                                .split("T")[0]
                            }
                            className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark ${
                              errors.birthdate
                                ? "border-red-400 focus:outline-red-400"
                                : "border-f-gray focus:outline-c-primary"
                            }`}
                          />
                          <p className="text-red-400 text-p-sm mt-1">
                            {(formData.birthdate === "" || errors.birthdate) &&
                              errors.birthdate}
                          </p>
                        </div>
                      </section>
                      <div className="w-1/4">
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
                          className="mt-1 w-full px-4 py-3 border rounded-md text-f-dark border-f-gray focus:outline-c-primary"
                          disabled
                          placeholder="Age"
                        />
                      </div>
                    </div>
                    <section>
                      <label
                        htmlFor="sex"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Sex <span className="text-blue-500">*</span>
                      </label>
                      <div>
                        <select
                          name="sex"
                          value={formData.sex}
                          onChange={handleChange}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark ${
                            errors.sex
                              ? "border-red-400 focus:outline-red-400"
                              : "border-f-gray focus:outline-c-primary"
                          }`}
                        >
                          <option value="" disabled className="text-c-gray3">
                            Select Sex
                          </option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="None">Prefer not to say</option>
                        </select>
                        <p className="text-red-400 text-p-sm mt-1">
                          {(formData.sex === "" || errors.sex) && errors.sex}
                        </p>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="p-3 md:p-6 transition-all duration-200 ease-in-out">
                    <section className="mb-4">
                      <label
                        htmlFor="civil_status"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Civil Status <span className="text-blue-500">*</span>
                      </label>
                      <div>
                        <select
                          name="civil_status"
                          value={formData.civil_status}
                          onChange={handleChange}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark ${
                            errors.civil_status
                              ? "border-red-400 focus:outline-red-400"
                              : "border-f-gray focus:outline-c-primary"
                          }`}
                        >
                          <option value="" disabled className="text-c-gray3">
                            Select Status
                          </option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                        <p className="text-red-400 text-p-sm mt-1">
                          {(formData.civil_status === "" ||
                            errors.civil_status) &&
                            errors.civil_status}
                        </p>
                      </div>
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
                        className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark ${
                          errors.occupation
                            ? "border-red-400 focus:outline-red-400"
                            : "border-f-gray focus:outline-c-primary"
                        }`}
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select occupation
                        </option>
                        <option value="Employed">Employed</option>
                        <option value="Unemployed">Unemployed</option>
                      </select>
                    </section>
                    <hr className="border-f-gray mb-8 mt-10" />
                    <div className="flex gap-4 mb-4">
                      <div className="w-1/2">
                        <label
                          htmlFor="province"
                          className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                        >
                          Province <span className="text-blue-500">*</span>
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
                          Municipality <span className="text-blue-500">*</span>
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
                    <section className="mb-4">
                      <label
                        htmlFor="contact_number"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Contact Number <span className="text-blue-500">*</span>
                      </label>
                      <div>
                        <input
                          type="text"
                          name="contact_number"
                          value={formData.contact_number}
                          onChange={handleChange}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark ${
                            errors.contact_number
                              ? "border-red-400 focus:outline-red-400"
                              : "border-f-gray focus:outline-c-primary"
                          }`}
                          placeholder="Enter contact number"
                        />
                        <p className="text-red-400 text-p-sm mt-1">
                          {(formData.contact_number === "" ||
                            errors.contact_number) &&
                            errors.contact_number}
                        </p>
                      </div>
                    </section>
                    <section>
                      <label
                        htmlFor="email"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Email Address <span className="text-blue-500">*</span>
                      </label>
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark ${
                            errors.email
                              ? "border-red-400 focus:outline-red-400"
                              : "border-f-gray focus:outline-c-primary"
                          }`}
                          placeholder="Enter email address"
                        />
                        <p className="text-red-400 text-p-sm mt-1">
                          {(formData.email === "" || errors.email) &&
                            errors.email}
                        </p>
                      </div>
                    </section>
                  </div>
                )}
              </form>
            </div>
            <footer className="flex justify-end p-6 gap-4">
              {currentCardIndex === 0 ? (
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
                  className="px-4 lg:px-12 py-2 bg-bg-con  text-f-light text-p-sm md:text-p-rg font-medium rounded-md shadow-sm hover:bg-opacity-75 active:bg-pressed-branch"
                  onClick={handleNext}
                  disabled={currentCardIndex === 1}
                >
                  Continue
                </button>
              ) : (
                <>
                  {patient ? (
                    <>
                      <button
                        className="px-4 lg:px-12 py-2 bg-bg-con text-f-light text-p-sm md:text-p-rg font-medium rounded-md  hover:bg-opacity-75 active:bg-pressed-branch"
                        onClick={handleSubmit}
                        disabled={currentCardIndex !== 1}
                      >
                        Update Patient
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-4 lg:px-12 py-2 bg-bg-con text-f-light text-p-sm md:text-p-rg font-medium rounded-md  hover:bg-opacity-75"
                        onClick={handleSubmit}
                        disabled={currentCardIndex !== 1}
                      >
                        Add Patient
                      </button>
                    </>
                  )}
                </>
              )}
            </footer>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={isSuccess}
        title={patient ? `Patient Updated` : "Patient Added!"}
        description={
          patient
            ? `The patient data has been successfully updated in the system.`
            : `The patient has been successfully registered in the system.`
        }
        onClose={() => onClose()}
      />
    </>
  );
};

export default AddEditPatient;
