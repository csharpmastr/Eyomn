import React, { useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import PhList from "../../assets/Data/location_list.json";

const AddPatientUICard = ({ onClose }) => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

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

  const handleMunicipalityChange = (selectedOption) => {
    setSelectedMunicipality(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      municipality: selectedOption ? selectedOption.value : "",
    }));
  };

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNext = () => {
    if (currentCardIndex < 1) {
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

  return (
    <div className="flex flex-col items-center lg:items-end justify-center h-full bg-c-gray3 bg-opacity-50 font-poppins">
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
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  placeholder="Enter first name"
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
                  className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  placeholder="Enter last name"
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
                    className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Enter age"
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
                  className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
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
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
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
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Occupation
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
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Enter contact number"
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
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Enter email"
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
    </div>
  );
};

export default AddPatientUICard;
