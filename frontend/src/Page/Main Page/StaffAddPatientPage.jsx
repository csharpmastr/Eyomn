import React, { useState } from "react";
import Select from "react-select";
import PhList from "../../assets/Data/location_list.json";
import SubmitButton from "../../Component/ui/SubmitButton";
import { useSelector } from "react-redux";
import { addPatientService } from "../../Service/PatientService";
import { useAddPatient } from "../../Hooks/useAddPatient";
import Loader from "../../Component/ui/Loader";
import SuccessModal from "../../Component/ui/SuccessModal";

const StaffAddPatientPage = () => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const { addPatientHook, isLoading, error } = useAddPatient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [errors, setErrors] = useState({});
  const doctorsList = useSelector((state) => state.reducer.doctor.doctor);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const branch = useSelector((state) => state.reducer.user.user.branches);
  const branchId = branch[0].branchId;
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
    reason_visit: "",
  });

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const selected = doctorsList.find((doc) => doc.staffId === doctorId);
    setSelectedDoctor(selected);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);

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
  const handleClose = () => {
    setIsSuccess(false);
    window.location.reload();
  };

  const handleMunicipalityChange = (selectedOption) => {
    setSelectedMunicipality(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      municipality: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    // if (!validateForm()) {
    //   return;
    // }

    try {
      const res = await addPatientHook(
        formData,
        selectedDoctor.staffId,
        branchId
      );
      if (res) {
        setIsSuccess(true);
        handleClear();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClear = () => {
    setFormData({
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
    });
    setSelectedProvince(null);
    setSelectedMunicipality(null);
    setSelectedDoctor(null);
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

    // Validate first name
    if (
      !formData.first_name ||
      !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(formData.first_name)
    ) {
      newErrors.first_name =
        "(First name is required and should be at least 2 characters)";
    }

    // Validate last name
    if (
      !formData.last_name ||
      !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(formData.last_name)
    ) {
      newErrors.last_name =
        "(Last name is required and should be at least 2 characters)";
    }

    // Validate age
    if (!formData.age || formData.age <= 0 || formData.age > 120) {
      newErrors.age = "(Age must be between 1 and 120)";
    }

    // Validate sex
    if (!formData.sex) {
      newErrors.sex = "(Sex is required)";
    }

    // Validate birthdate
    if (!formData.birthdate) {
      newErrors.birthdate = "(Date of birth is required)";
    }

    // Validate civil status
    if (!formData.civil_status) {
      newErrors.civil_status = "(Civil status is required)";
    }

    // Validate contact number
    if (
      !formData.contact_number ||
      !/^09\d{9}$/.test(formData.contact_number)
    ) {
      newErrors.contact_number =
        "(A valid 11-digit contact number is required)";
    }

    // Validate email
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "(A valid email is required)";
    }

    // Validate reason for visit
    if (!formData.reason_visit) {
      newErrors.reason_visit = "(Reason for visit is required)";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      {isLoading && (
        <Loader description={"Saving Patient Information, please wait..."} />
      )}
      <div className="h-full w-full flex justify-center bg-bg-mc overflow-auto p-4 md:p-12 font-Poppins">
        <div>
          <form className="flex flex-col h-auto w-auto" onSubmit={handleSubmit}>
            <div className="p-8 w-full lg:w-[660px] rounded-lg bg-white mb-6">
              <label className="text-p-lg font-semibold text-c-primary">
                | Personal Information
              </label>
              <div className="mt-3 text-c-gray3">
                <label htmlFor="first_name" className="text-p-sm">
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
                  placeholder="Enter first name"
                />
                <label htmlFor="last_name" className="text-p-sm">
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
                    errors.first_name
                      ? "border-red-400 focus:outline-red-400"
                      : "border-c-gray3 focus:outline-c-primary"
                  }`}
                  placeholder="Enter last name"
                />
                <label htmlFor="middle_name" className="text-p-sm">
                  Middle Name (Optional)
                </label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  placeholder="Enter middle name"
                />
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label htmlFor="age" className="text-p-sm">
                      Age{" "}
                      <span className="text-red-400">
                        {(formData.age === "" || errors.age) && errors.age}
                      </span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      min={0}
                      value={formData.age}
                      onChange={handleChange}
                      className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                        errors.first_name
                          ? "border-red-400 focus:outline-red-400"
                          : "border-c-gray3 focus:outline-c-primary"
                      }`}
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="sex" className="text-p-sm">
                      Sex{" "}
                      <span className="text-red-400">
                        {(formData.sex === "" || errors.sex) && errors.sex}
                      </span>
                    </label>
                    <select
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                        errors.first_name
                          ? "border-red-400 focus:outline-red-400"
                          : "border-c-gray3 focus:outline-c-primary"
                      }`}
                    >
                      <option value="" disabled className="text-c-gray3">
                        Select Sex
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="PNTS">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <label htmlFor="birthdate" className="text-p-sm">
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
                  className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                    errors.first_name
                      ? "border-red-400 focus:outline-red-400"
                      : "border-c-gray3 focus:outline-c-primary"
                  }`}
                />
              </div>
            </div>
            <div className="p-8  w-full lg:w-[660px] rounded-lg bg-white mb-6">
              <label className="text-p-lg font-semibold text-c-primary">
                | Status Infomation
              </label>
              <div className="mt-3 text-c-gray3">
                <label htmlFor="civil_status" className="text-p-sm">
                  Civil Status{" "}
                  <span className="text-red-400">
                    {(formData.civil_status === "" || errors.civil_status) &&
                      errors.civil_status}
                  </span>
                </label>
                <select
                  name="civil_status"
                  value={formData.civil_status}
                  onChange={handleChange}
                  className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                    errors.first_name
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

                <label htmlFor="occupation" className="text-p-sm">
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
              </div>
            </div>
            <div className="p-8 w-full lg:w-[660px] rounded-lg bg-white mb-6">
              <label className="text-p-lg font-semibold text-c-primary">
                | Contact Information
              </label>
              <div className="mt-3 text-c-gray3">
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label htmlFor="province" className="block text-p-sm mb-1">
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
                      className="block text-p-sm mb-1"
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
                <label htmlFor="contact_number" className="text-p-sm">
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
                    errors.first_name
                      ? "border-red-400 focus:outline-red-400"
                      : "border-c-gray3 focus:outline-c-primary"
                  }`}
                  placeholder="Enter contact number"
                />
                <label htmlFor="email" className="text-p-sm">
                  Email Address{" "}
                  <span className="text-red-400">
                    {(formData.email === "" || errors.email) && errors.email}
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                    errors.first_name
                      ? "border-red-400 focus:outline-red-400"
                      : "border-c-gray3 focus:outline-c-primary"
                  }`}
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="p-8  w-full lg:w-[660px] rounded-lg bg-white mb-6">
              <label className="text-p-lg font-semibold text-c-primary">
                | Appoint a Doctor
              </label>
              <div className="mt-3 text-c-gray3">
                <label htmlFor="doctorId" className="text-p-sm">
                  Attending Doctor
                </label>
                <select
                  name="doctorId"
                  value={selectedDoctor?.staffId || ""}
                  onChange={handleDoctorChange}
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                >
                  <option value="" disabled>
                    Select Doctor
                  </option>
                  {doctorsList.map((doctor) => (
                    <option key={doctor.staffId} value={doctor.staffId}>
                      {doctor.first_name} {doctor.last_name} ({doctor.position})
                    </option>
                  ))}
                </select>

                <label htmlFor="reason_visit" className="text-p-sm">
                  Reason for Visit{" "}
                  <span className="text-red-400">
                    {(formData.reason_visit === "" || errors.reason_visit) &&
                      errors.reason_visit}
                  </span>
                </label>
                <select
                  name="reason_visit"
                  value={formData.reason_visit}
                  onChange={handleChange}
                  className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                    errors.first_name
                      ? "border-red-400 focus:outline-red-400"
                      : "border-c-gray3 focus:outline-c-primary"
                  }`}
                >
                  <option value="" disabled className="text-c-gray3">
                    Select Reason
                  </option>
                  <option value="check up">Check Up</option>
                  <option value="consulation">Consultation</option>
                  <option value="eye glass">Eye Glass</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mb-10">
              <SubmitButton
                style={`px-4 py-3 bg-c-primary hover:bg-hover-c-primary active:bg-pressed-c-primary`}
                value={"Add Patient"}
              />
            </div>
          </form>
        </div>
      </div>
      <SuccessModal
        isOpen={isSuccess}
        title={"Patient Added!"}
        description={`The patient has been successfully registered in the system.`}
        onClose={handleClose}
      />
    </>
  );
};

export default StaffAddPatientPage;
