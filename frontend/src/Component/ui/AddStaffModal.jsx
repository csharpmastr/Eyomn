import React, { useState } from "react";
import Select from "react-select";
import PhList from "../../assets/Data/location_list.json";

const AddStaffModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    contact: "",
    province: "",
    municipality: "",
    birthdate: "",
    role: "",
  });

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedMunicipality(null);
    setFormData({
      ...formData,
      province: selectedOption?.value || "",
      municipality: "",
    });
  };

  const handleMunicipalityChange = (selectedOption) => {
    setSelectedMunicipality(selectedOption);
    setFormData({ ...formData, municipality: selectedOption?.value || "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onClose();
  };

  // Collect all provinces into a single list
  const allProvinces = Object.keys(PhList).reduce((acc, regionKey) => {
    const provinceList = PhList[regionKey].province_list;
    return [
      ...acc,
      ...Object.keys(provinceList).map((provinceName) => ({
        label: provinceName,
        value: provinceName,
      })),
    ];
  }, []);

  // Get municipalities based on the selected province
  const municipalities =
    selectedProvince &&
    Object.keys(
      PhList[
        Object.keys(PhList).find(
          (regionKey) => PhList[regionKey].province_list[selectedProvince.value]
        )
      ].province_list[selectedProvince.value].municipality_list
    ).map((municipalityName) => ({
      label: municipalityName,
      value: municipalityName,
    }));

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] xl:w-[80vw] h-[50vh] xl:h-[90vh] transform transition-all duration-300 ease-out scale-95 opacity-100">
        <h1 className="text-2xl font-Poppins text-black mb-4">
          Add New Member
        </h1>
        <form onSubmit={handleSubmit} className="flex">
          <div className="w-1/5"></div>
          <div className="w-1/2 font-Poppins px-4">
            <div className="mb-2 text-[20px]">
              <h1>| Personal Information</h1>
            </div>
            <div className="flex flex-col text-[#999999]">
              <div className="mb-2">
                <label htmlFor="Name">Employee Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-4"
                  placeholder="Enter full name"
                />
                <label htmlFor="birthdate">Date of Birth</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black"
                />
              </div>
            </div>
            <div className="mt-8">
              <h1 className="text-[20px] mb-2">| Contact Information</h1>
              <div className="text-[#999999] font-Poppins">
                <div className="xl:flex gap-2">
                  <div>
                    <div className="mb-4 xl:w-full flex gap-2">
                      <div className="w-full">
                        <label htmlFor="province">Province</label>
                        <Select
                          id="province"
                          name="province"
                          options={allProvinces}
                          value={selectedProvince}
                          onChange={handleProvinceChange}
                          placeholder="Select a province"
                        />
                      </div>

                      {/* Municipality Dropdown with Search */}

                      <div className="mb-4  w-full">
                        <label htmlFor="municipality">Municipality</label>
                        <Select
                          id="municipality"
                          name="municipality"
                          options={municipalities}
                          value={selectedMunicipality}
                          onChange={handleMunicipalityChange}
                          placeholder="Select a municipality"
                          isDisabled={!selectedProvince}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="firstName">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-2"
                        placeholder="Enter email"
                      />
                      <label htmlFor="firstName">Contact Number</label>
                      <input
                        type="number"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-2"
                        placeholder="Enter contact number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 font-Poppins px-4">
            <h1 className="text-[20px] mb-2">| Position Details</h1>
            <div className="mb-2 text-[#999999]">
              <label htmlFor="Name">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-4"
                placeholder="Enter full name"
              />
              <label htmlFor="birthdate">Date of Birth</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
