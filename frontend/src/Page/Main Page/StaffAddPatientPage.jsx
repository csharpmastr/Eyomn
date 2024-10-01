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
  const doctorsList = useSelector((state) => state.reducer.doctor.doctor);
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
    try {
      const res = await addPatientHook(formData);
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
      clinicId: user.clinicId,
    });
    setSelectedProvince(null);
    setSelectedMunicipality(null);
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

  return (
    <>
      {isLoading && <Loader />}
      <div className="h-full w-full flex justify-center bg-bg-mc overflow-auto p-4 md:p-12">
        <div>
          <form
            className="flex flex-col font-Poppins h-auto w-auto"
            onSubmit={handleSubmit}
          >
            <div className="p-8 w-full lg:w-[660px] rounded-lg bg-white mb-6">
              <label className="text-p-lg font-semibold text-c-primary">
                | Personal Information
              </label>
              <div className="mt-3 text-c-gray3">
                <label htmlFor="first_name" className="text-p-sm">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  placeholder="Enter first name"
                />
                <label htmlFor="last_name" className="text-p-sm">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
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
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      min={0}
                      value={formData.age}
                      onChange={handleChange}
                      className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="sex" className="text-p-sm">
                      Sex
                    </label>
                    <select
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    >
                      <option value="" disabled className="text-c-gray3">
                        Select Sex
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <label htmlFor="birthdate" className="text-p-sm">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                />
              </div>
            </div>
            <div className="p-8  w-full lg:w-[660px] rounded-lg bg-white mb-6">
              <label className="text-p-lg font-semibold text-c-primary">
                | Status Infomation
              </label>
              <div className="mt-3 text-c-gray3">
                <label htmlFor="civil_status" className="text-p-sm">
                  Civil Status
                </label>
                <select
                  name="civil_status"
                  value={formData.civil_status}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
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
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  placeholder="Enter middle name"
                />
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
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  placeholder="Enter contact number"
                />
                <label htmlFor="email" className="text-p-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
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
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                >
                  <option value="" disabled>
                    Select Doctor
                  </option>
                  {doctorsList.map((doctor, key) => (
                    <option key={key} value={doctor.id}>
                      {`${doctor.name} (${doctor.position})`}
                    </option>
                  ))}
                </select>
                <label htmlFor="reason_visit" className="text-p-sm">
                  Reason for Visit
                </label>
                <select
                  name="reason_visit"
                  value={formData.reason_visit}
                  onChange={handleChange}
                  className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                >
                  <option value="" disabled className="text-c-gray3">
                    Select Reason
                  </option>
                  <option value="Male">Check Up</option>
                  <option value="Male">Consultation</option>
                  <option value="Female">Eye Glass</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mb-10">
              <SubmitButton
                style={`hover:bg-hover-c-primary active:bg-pressed-c-primary`}
                value={"Save Infomation"}
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
