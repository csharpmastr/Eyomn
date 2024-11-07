import React, { useState } from "react";
import Select from "react-select";
import PhList from "../../assets/Data/location_list.json";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import SubmitButton from "./SubmitButton";
import { useAddStaff } from "../../Hooks/useAddStaff";
import { useAuthContext } from "../../Hooks/useAuthContext";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";
import { useSelector } from "react-redux";

const AddStaffModal = ({ onClose }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const user = useSelector((state) => state.reducer.user.user);
  const { addStaffHook, error } = useAddStaff();
  const [repeatPass, setRepeatPass] = useState("");
  const [isLoading, setIsLoading] = useState();
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    province: "",
    municipality: "",
    email: "",
    contact: "",
    position: "",
    startDate: "",
    password: "",
    clinicId: user.userId,
  });

  const [image, setImage] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "repeatPass") {
      setRepeatPass(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setIsLoading(true);
    try {
      const response = await addStaffHook(formData);
      if (response) {
        console.log(response);
        setIsSuccess(true);
      }
    } catch (err) {
      console.log(err);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
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
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 font-poppins">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] xl:w-[80vw] h-[80vh] md:h-auto xl:h-[auto] 2xl:w-[auto] transform transition-all duration-300 ease-out scale-95 opacity-100 overflow-scroll md:overflow-auto">
            <h1 className="text-2xl text-black mb-4">Add New Member</h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row md:justify-center"
            >
              <div
                className="w-1/5 flex flex-col items-center cursor-pointer
          "
              >
                <label className="flex flex-col items-center">
                  {image ? (
                    <img
                      src={image}
                      alt="Staff"
                      className="rounded-full xl:h-48 xl:w-48  w-32 h-32 object-cover mb-4 hover:cursor-pointer"
                    />
                  ) : (
                    <div className="xl:h-48 xl:w-48 w-32 h-32   rounded-full bg-gray-300 flex justify-center items-center text-gray-500 cursor-pointer">
                      Click to Upload
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden "
                  />
                </label>
              </div>

              <div className="lg:w-1/3 xl:w-1/2 pl-6">
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
                <div className="mt-4">
                  <h1 className="text-[20px] mb-2">| Contact Information</h1>
                  <div className="text-[#999999]">
                    <div className=" gap-2">
                      <div>
                        <div className="mb-4 xl:w-full flex lg:flex-col xl:flex-row gap-2">
                          <div className="w-full">
                            <label htmlFor="province">Province</label>
                            <Select
                              id="province"
                              name="province"
                              options={allProvinces}
                              value={selectedProvince}
                              onChange={handleProvinceChange}
                              placeholder="Province"
                            />
                          </div>

                          <div className=" w-full">
                            <label htmlFor="municipality">Municipality</label>
                            <Select
                              id="municipality"
                              name="municipality"
                              options={municipalities}
                              value={selectedMunicipality}
                              onChange={handleMunicipalityChange}
                              placeholder="Municipality"
                              isDisabled={!selectedProvince}
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="contact">Contact Number</label>
                          <input
                            type="number"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-4"
                            placeholder="Enter contact number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 xl:w-1/2 px-4">
                <div className="flex flex-col  h-full">
                  <div className="mb-2 text-[#999999]">
                    <h1 className="text-[20px] mb-2 text-[#222222]">
                      | Position Details
                    </h1>
                    <label htmlFor="position">Role</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full h-12 px-2 border-2 border-[#999999] rounded-md text-black mb-4"
                    >
                      <option value="" disabled className="text-[#3b3030]">
                        Select a role
                      </option>
                      <option value="Ophthalmologist">Ophthalmologist</option>
                      <option value="Optometrist">Optometrist</option>
                      <option value="Staff">Staff</option>
                    </select>

                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black"
                    />
                  </div>
                  <div className="mt-4">
                    <div>
                      <h1 className="text-[20px] mb-2">| Login Credentials</h1>
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-4"
                        placeholder="Enter email"
                      />
                      <div className="flex lg:flex-col xl:flex-row lg:-mt-4  xl:-mt-[10px] gap-4">
                        <div className="w-full">
                          <label htmlFor="password">Password</label>
                          <div className="relative">
                            <input
                              type={isPasswordVisible ? "text" : "password"}
                              name="password"
                              onChange={handleChange}
                              className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-4"
                              placeholder="Enter password"
                            />
                            <button
                              type="button"
                              className="absolute top-3 right-2 text-[#999999]"
                              onClick={() =>
                                setIsPasswordVisible(!isPasswordVisible)
                              }
                            >
                              {isPasswordVisible ? (
                                <MdOutlineRemoveRedEye className="w-6 h-6" />
                              ) : (
                                <FaRegEyeSlash className="w-6 h-6" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="lg:-mt-7 xl:mt-0">
                            <label htmlFor="repeatPass">Repeat Password</label>
                            <div className="relative w-full">
                              <input
                                type={isPasswordVisible ? "text" : "password"}
                                name="repeatPass"
                                onChange={handleChange}
                                className="w-full h-12 px-2 py-4 border-2 border-[#999999] rounded-md text-black mb-4"
                                placeholder="Repeat password"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 lg:mt-10 xl:mt-4">
                      <div
                        className="flex h-12 lg:w-24 xl:w-32 justify-center items-center gap-2 border-red-500 border-2 rounded-md p-2 text-red-500 cursor-pointer hover:bg-red-100"
                        onClick={onClose}
                      >
                        <IoChevronBackCircleOutline className="hidden xl:block xl:h-6 xl:w-6" />
                        <p className="text-[18px]">Back</p>
                      </div>
                      <div className="w-1/2 flex justify-end">
                        <SubmitButton
                          style={`w-full xl:w-full hover:bg-[#16A085]`}
                          value={"Submit"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={isSuccess}
        onClose={() => {
          setIsSuccess(false);
          onClose();
        }}
        title="Added Success"
        description="The staff has been registered in the system."
      />
    </>
  );
};

export default AddStaffModal;
