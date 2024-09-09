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
    province: "",
    municipality: "",
    contact_number: "",
    email: "",
    attending_doctor: "",
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
      }
    } catch (err) {
      console.log(err);
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

  return (
    <>
      {isLoading && <Loader />}
      <div className="h-full w-full flex justify-center items-center px-8 py-8 bg-[#E6E6E6]">
        <div>
          <form
            className="flex px-8 py-4 font-Poppins h-auto bg-white rounded-lg shadow-md"
            onSubmit={handleSubmit}
          >
            <div className="w-1/2 p-4">
              <label className="mb-4 text-[20px]">| Personal Information</label>
              <div className="text-[#999999] mt-4">
                <label htmlFor="first_name" className="text-[14px]">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full h-10 px-2 py-3 border-2 border-[#999999] rounded-md text-black mb-4"
                  placeholder="Enter first name"
                />
                <label htmlFor="last_name" className="text-[14px]">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-4"
                  placeholder="Enter last name"
                />
                <label htmlFor="middle_name" className="text-[14px]">
                  Middle Name (Optional)
                </label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-4"
                  placeholder="Enter middle name"
                />
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label htmlFor="age" className="text-[14px]">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      min={0}
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-4"
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="sex" className="text-[14px]">
                      Sex
                    </label>
                    <select
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      className="w-full h-12 px-2 border-2 border-[#999999] rounded-md text-black mb-4"
                    >
                      <option value="" disabled className="text-[#3b3030]">
                        Select Sex
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <label htmlFor="birthdate" className="text-[14px]">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-4"
                />
                <label htmlFor="civil_status" className="text-[14px]">
                  Civil Status
                </label>
                <select
                  name="civil_status"
                  value={formData.civil_status}
                  onChange={handleChange}
                  className="w-full h-12 px-2 border-2 border-[#999999] rounded-md text-black"
                >
                  <option value="" disabled className="text-[#3b3030]">
                    Select Status
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
            <div className="w-1/2 p-4 flex flex-col justify-between mx-auto">
              <div>
                <label className="text-[20px]">| Contact Information</label>
                <div className="flex flex-col mt-4 text-[#999999]">
                  <div className="flex gap-4 mb-5">
                    <div>
                      <p className="text-[14px]">Country</p>
                      <p className="mt-2 text-black">Philippines</p>
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="province" className="block text-[14px]">
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
                        className="block text-[14px]"
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
                  <div className="flex text-[#999999] gap-4">
                    <div className="w-1/2">
                      <label htmlFor="contact_number" className="text-[14px]">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleChange}
                        className="w-full h-12 px-2 py-3 border-2 border-[#999999] rounded-md text-black"
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="email" className="text-[14px]">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 px-2 py-3 border-2 border-[#999999] rounded-md text-black"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="attending_doctor" className="text-[14px]">
                      Attending Doctor
                    </label>
                    <select
                      name="attending_doctor"
                      value={formData.attending_doctor}
                      onChange={handleChange}
                      className="w-full h-12 px-2 border-2 border-[#999999] rounded-md text-black"
                    >
                      <option value="" disabled>
                        Select Doctor
                      </option>
                      {doctorsList.map((doctor, key) => (
                        <option key={key} value={doctor.id}>
                          {doctor.name + " " + doctor.position}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <div className="h-12 lg:w-24 xl:w-32 flex justify-center items-center gap-2 border-red-500 border-2 rounded-md p-2 text-red-500 cursor-pointer hover:bg-red-100 ">
                  <p className="">Clear</p>
                </div>
                <SubmitButton
                  style={`w-2/4 hover:bg-[#16A085]`}
                  value={"Submit"}
                />
              </div>
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
