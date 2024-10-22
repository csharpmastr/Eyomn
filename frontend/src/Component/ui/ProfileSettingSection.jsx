import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Select from "react-select";
import PhList from "../../assets/Data/location_list.json";
import { useSelector } from "react-redux";

const ProfileSettingSection = ({ selected }) => {
  const [image, setImage] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const user = useSelector((state) => state.reducer.user.user);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [currentpassVisible, setCurrentPassVisible] = useState(false);
  const [npVisible, setNpVisible] = useState(false);
  const [cpVisible, setCpVisible] = useState(false);
  const [repeatPass, setRepeatPass] = useState("");
  const [errors, setErrors] = useState({});
  const [userForm, setUserForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    birthdate: user.birthdate,
    province: "",
    municipality: "",
    contact_number: user.contact,
    email: user.email,
  });

  const [passwordForm, setPasswordForm] = useState({
    password: "",
    newpassword: "",
    confirmpassword: "",
  });

  const handlePasswordChange = (e) => {
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
      setPasswordForm({ ...passwordForm, [name]: value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    setUserForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (!isEditable) return;
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (!isEditable) return;
    setImage(null);
  };

  const handleProvinceChange = (selectedOption) => {
    if (!isEditable) return;
    setSelectedProvince(selectedOption);
    setSelectedMunicipality(null);
    setUserForm((prevData) => ({
      ...prevData,
      province: selectedOption ? selectedOption.value : "",
      municipality: "",
    }));
  };

  const handleMunicipalityChange = (selectedOption) => {
    if (!isEditable) return;
    setSelectedMunicipality(selectedOption);
    setUserForm((prevData) => ({
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

  const validateForm = () => {
    let newErrors = {};

    if (selected === "My Profile") {
      if (
        !userForm.first_name ||
        !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(userForm.first_name)
      )
        newErrors.first_name = "(First name is required)";
      if (
        !userForm.last_name ||
        !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(userForm.last_name)
      )
        newErrors.last_name = "(Last name is required)";

      if (!userForm.birthdate)
        newErrors.birthdate = "(Date of birth is required)";

      if (
        !userForm.contact_number ||
        !/^09\d{9}$/.test(userForm.contact_number)
      )
        newErrors.contact_number =
          "(A valid 11-digit contact number is required)";

      if (!userForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email))
        newErrors.email = "(Valid email is required)";
    } else if (selected === "Account") {
      if (!passwordForm.password)
        newErrors.password = "(Password doens't recognized)";
      if (
        !passwordForm.newpassword ||
        !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/.test(
          passwordForm.newpassword
        )
      )
        newErrors.newpassword =
          "(Invalid password. Ensure it has at least 8 characters, including uppercase, lowercase, numbers, and special characters)";

      if (passwordForm.confirmpassword !== repeatPass)
        newErrors.confirmpassword = "(Passwords do not match)";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      {selected === "My Profile" && (
        <form className="flex flex-col w-full h-full gap-4 md:gap-8 font-Poppins">
          <div className="w-full border border-f-gray bg-white rounded-lg p-6 md:p-10 h-full flex flex-col-reverse md:flex-row justify-between items-center">
            <label className="flex items-center gap-4 mt-6 md:mt-0">
              {image ? (
                <img
                  src={image}
                  alt="Staff"
                  className="w-20 h-20 md:w-[120px] md:h-[120px] rounded-full object-cover hover:cursor-pointer border border-c-gray3"
                />
              ) : (
                <div className="w-20 h-20 md:w-[120px] md:h-[120px] rounded-full bg-blue-200 flex justify-center items-center text-gray-500">
                  <FiUser className="w-12 h-12" />
                </div>
              )}
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={!isEditable}
              />

              <div>
                <div className="flex gap-2 items-center mb-2">
                  <button
                    type="button"
                    className="text-blue-400 text-p-lg font-medium"
                    onClick={() =>
                      document.getElementById("imageUpload").click()
                    }
                  >
                    Upload
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    type="button"
                    className="text-red-400 text-p-lg font-medium"
                    onClick={handleRemoveImage}
                    disabled={!image}
                  >
                    Delete
                  </button>
                </div>
                <p className="text-f-gray2 text-sm">
                  At least 400x400 px recommended.
                </p>
                <p className="text-f-gray2  text-sm">JPG or PNG is allowed.</p>
              </div>
            </label>
            {!isEditable && (
              <div
                className="h-fit flex justify-center items-center rounded-md w-40 py-3 border border-c-secondary text-c-secondary font-medium cursor-pointer"
                onClick={() => setIsEditable(!isEditable)}
              >
                <h1>Edit Information</h1>
              </div>
            )}
            {isEditable && (
              <div
                className="h-fit flex justify-center items-center w-40 py-3 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
                onClick={() => setIsEditable(!isEditable)} // Add Save function
              >
                <h1>Save</h1>
              </div>
            )}
          </div>
          <div className="w-full border border-f-gray bg-white rounded-lg p-10 h-full flex flex-col justify-between">
            <label className="text-p-lg font-semibold text-c-secondary">
              | Personal Information
            </label>
            <div className="mt-3 text-c-gray3">
              <label htmlFor="first_name" className="text-p-sm">
                First Name{" "}
                <span className="text-red-400">
                  {(userForm.first_name === "" || errors.first_name) &&
                    errors.first_name}
                </span>
              </label>
              <input
                type="text"
                name="first_name"
                value={userForm.first_name}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                placeholder="Enter first name"
                disabled={!isEditable}
              />
              <label htmlFor="last_name" className="text-p-sm">
                Last Name{" "}
                <span className="text-red-400">
                  {(userForm.last_name === "" || errors.last_name) &&
                    errors.last_name}
                </span>
              </label>
              <input
                type="text"
                name="last_name"
                value={userForm.last_name}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                placeholder="Enter last name"
                disabled={!isEditable}
              />
              <label htmlFor="birthdate" className="text-p-sm">
                Date of Birth{" "}
                <span className="text-red-400">
                  {(userForm.birthdate === "" || errors.birthdate) &&
                    errors.birthdate}
                </span>
              </label>
              <input
                type="date"
                name="birthdate"
                value={userForm.birthdate}
                onChange={handleChange}
                className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                disabled={!isEditable}
              />
            </div>
          </div>
          <div className="w-full border border-f-gray bg-white rounded-lg p-10 h-full flex flex-col justify-between">
            <label className="text-p-lg font-semibold text-c-secondary">
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
                    isDisabled={!isEditable}
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
                    isDisabled={!selectedProvince || !isEditable}
                  />
                </div>
              </div>
              <label htmlFor="contact_number" className="text-p-sm">
                Contact Number{" "}
                <span className="text-red-400">
                  {(userForm.contact_number === "" || errors.contact_number) &&
                    errors.contact_number}
                </span>
              </label>
              <input
                type="text"
                name="contact_number"
                value={user.contact}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                placeholder="Enter contact number"
                disabled={!isEditable}
              />
              <label htmlFor="email" className="text-p-sm">
                Email Address{" "}
                <span className="text-red-400">
                  {(userForm.email === "" || errors.email) && errors.email}
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                placeholder="Enter email"
                disabled={!isEditable}
              />
            </div>
          </div>
          {user.role === "0" || user.role === "1" ? (
            ""
          ) : (
            <div className="w-full border border-f-gray bg-white rounded-lg p-10 h-full flex flex-col justify-between">
              <label className="text-p-lg font-semibold text-c-secondary">
                | Job Information
              </label>
              <div className="mt-3 text-c-gray3">
                <div className="flex mb-5 gap-5">
                  <div className="flex-1">
                    <label htmlFor="role" className="text-p-sm">
                      Job / Role
                    </label>
                    <h1 className="mt-1 text-f-dark font-medium text-p-rg">
                      {user.position === "Optometrist" ||
                      user.position === "Ophthalmologist"
                        ? `Doctor/${user.position}`
                        : `${user.position}`}
                    </h1>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="contract" className="text-p-sm">
                      Contract
                    </label>
                    <h1 className="mt-1 text-f-dark font-medium text-p-rg">
                      {user.emp_type === "fulltime" ? `Full Time` : "Part Time"}
                    </h1>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex-1">
                    <label htmlFor="work_hour" className="text-p-sm">
                      Working Hours
                    </label>
                    <h1 className="mt-1 text-f-dark font-medium text-p-rg">
                      09:00 am - 05:00 pm
                    </h1>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="dayOff" className="text-p-sm">
                      Day’s Off
                    </label>
                    <h1 className="mt-1 text-f-dark font-medium text-p-rg">
                      Saturday & Sunday
                    </h1>
                  </div>
                </div>
                <h1 className="text-p-lg mt-10 text-center md:text-start">
                  Contact Organization Manager for schedule changes
                </h1>
              </div>
            </div>
          )}
        </form>
      )}
      {selected === "Account" && (
        <div className="flex flex-col w-full h-full gap-4 md:gap-8 font-Poppins">
          <div className="w-full border border-f-gray bg-white rounded-lg p-10 h-fit flex flex-col justify-between">
            <label className="text-p-lg font-semibold text-c-secondary">
              | Change Password
            </label>
            <div className="mt-3 text-c-gray3 flex flex-col items-end">
              <div className="w-full">
                <label
                  htmlFor="password"
                  className="text-p-sm text-c-gray3 font-medium"
                >
                  Current Password{" "}
                  <span className="text-red-400">
                    {(passwordForm.password === "" || errors.password) &&
                      errors.password}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={currentpassVisible ? "text" : "password"}
                    name="password"
                    value={passwordForm.password}
                    onChange={handlePasswordChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute top-4 right-2 text-f-gray2"
                    onClick={() => setCurrentPassVisible(!currentpassVisible)}
                  >
                    {currentpassVisible ? (
                      <MdOutlineRemoveRedEye className="w-6 h-6" />
                    ) : (
                      <FaRegEyeSlash className="w-6 h-6" />
                    )}
                  </button>
                </div>
                <label
                  htmlFor="newpassword"
                  className="text-p-sm text-c-gray3 font-medium"
                >
                  New Password{" "}
                  <span className="text-red-400">
                    {(passwordForm.newpassword === "" || errors.newpassword) &&
                      errors.newpassword}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={npVisible ? "text" : "password"}
                    name="newpassword"
                    value={passwordForm.newpassword}
                    onChange={handlePasswordChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute top-4 right-2 text-f-gray2"
                    onClick={() => setNpVisible(!npVisible)}
                  >
                    {npVisible ? (
                      <MdOutlineRemoveRedEye className="w-6 h-6" />
                    ) : (
                      <FaRegEyeSlash className="w-6 h-6" />
                    )}
                  </button>
                </div>
                <label
                  htmlFor="confirmpassword"
                  className="text-p-sm text-c-gray3 font-medium"
                >
                  Confirm Password{" "}
                  <span className="text-red-400">
                    {(passwordForm.confirmpassword === "" ||
                      errors.confirmpassword) &&
                      errors.confirmpassword}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={cpVisible ? "text" : "password"}
                    name="confirmpassword"
                    value={passwordForm.confirmpassword}
                    onChange={handlePasswordChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute top-4 right-2 text-f-gray2"
                    onClick={() => setCpVisible(!cpVisible)}
                  >
                    {cpVisible ? (
                      <MdOutlineRemoveRedEye className="w-6 h-6" />
                    ) : (
                      <FaRegEyeSlash className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
              <button className="px-5 py-3 mt-5 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary">
                Save Password
              </button>
            </div>
          </div>
          <div className="w-full border border-red-400 bg-white rounded-lg p-10 h-fit flex flex-col justify-between">
            <label className="text-p-lg font-semibold text-c-secondary">
              | Delete Account
            </label>
            <p className="text-p-rg font-medium text-c-secondary">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <button className="px-5 w-fit py-3 mt-8 bg-red-50 border-2 border-red-400 text-red-400 text-p-rg font-semibold rounded-md hover:bg-red-200 active:bg-pressed-c-secondary">
              Delete Account
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSettingSection;
