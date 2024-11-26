import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FiUser } from "react-icons/fi";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import PhList from "../../assets/Data/location_list.json";
import { useParams } from "react-router-dom";
import { useAddStaff } from "../../Hooks/useAddStaff";
import Loader from "./Loader";
import SuccessModal from "./SuccessModal";
import { addStaff } from "../../Slice/StaffSlice";
import { FiTrash } from "react-icons/fi";
import ConfirmationModal from "./ConfirmationModal";

const AddStaff = ({ onClose, staffData }) => {
  const [image, setImage] = useState(null);
  const { branchId } = useParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [repeatPass, setRepeatPass] = useState("");
  const [passVisible, setPassVisible] = useState(false);
  const [cpVisible, setCpVisible] = useState(false);
  const branches = useSelector((state) => state.reducer.branch.branch);
  const { addStaffHook, isLoading, error } = useAddStaff();
  const reduxDispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [selectedBranchId, setSelectedBranchId] = useState(branchId);
  const [isMonOn, setIsMonOn] = useState(true);
  const [isTueOn, setIsTueOn] = useState(true);
  const [isWedOn, setIsWedOn] = useState(true);
  const [isThuOn, setIsThuOn] = useState(true);
  const [isFriOn, setIsFriOn] = useState(true);
  const [isSatOn, setIsSatOn] = useState(false);
  const [isSunOn, setIsSunOn] = useState(false);
  const [branchAssignment, setBranchAssignment] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    birthdate: "",
    province: "",
    municipality: "",
    email: "",
    contact_number: "",
    position: "",
    branches: [],
  });

  const openConfirmation = () =>
    setIsConfirmationModalOpen(!isConfirmationModalOpen);

  //Viewing staff details
  useEffect(() => {
    if (staffData) {
      if (staffData.branches.length === 1) {
        setBranchAssignment("stationary");
      } else {
        setBranchAssignment("rotational");
      }
      setFormData({
        first_name: staffData.first_name || "",
        last_name: staffData.last_name || "",
        middle_name: staffData.middle_name || "",
        birthdate: staffData.birthdate || "",
        province: staffData.province || "",
        municipality: staffData.municipality || "",
        email: staffData.email || "",
        contact_number: staffData.contact_number || "",
        position: staffData.position || "",
        branches: staffData.branches || [],
      });
      if (staffData.province) {
        const initialProvince = {
          value: staffData.province,
          label: staffData.province,
        };
        setSelectedProvince(initialProvince);
      }

      if (staffData.municipality) {
        const initialMunicipality = {
          value: staffData.municipality,
          label: staffData.municipality,
        };
        setSelectedMunicipality(initialMunicipality);
      }
    }
  }, [staffData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "branch_select") {
      setSelectedBranchId(value);
    }
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    const [day, timeType] = name.split("_");

    if (
      [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ].includes(day)
    ) {
      setFormData((prevState) => {
        const branchIndex = prevState.branches.findIndex(
          (branch) => branch.branchId === selectedBranchId
        );

        if (branchIndex !== -1) {
          const existingBranch = prevState.branches[branchIndex];
          const existingScheduleDayIndex = existingBranch.schedule.findIndex(
            (scheduleDay) => scheduleDay.day === day
          );

          if (existingScheduleDayIndex !== -1) {
            // Update the existing schedule for the day
            return {
              ...prevState,
              branches: prevState.branches.map((branch, index) =>
                index === branchIndex
                  ? {
                      ...branch,
                      schedule: branch.schedule.map((scheduleDay, i) =>
                        i === existingScheduleDayIndex
                          ? { ...scheduleDay, [timeType]: value }
                          : scheduleDay
                      ),
                    }
                  : branch
              ),
            };
          } else {
            // Add a new schedule entry if it doesn't exist
            return {
              ...prevState,
              branches: prevState.branches.map((branch, index) =>
                index === branchIndex
                  ? {
                      ...branch,
                      schedule: [
                        ...branch.schedule,
                        {
                          day,
                          in: timeType === "in" ? value : "",
                          out: timeType === "out" ? value : "",
                        },
                      ],
                    }
                  : branch
              ),
            };
          }
        } else {
          // If the branch does not exist, create a new entry
          return {
            ...prevState,
            branches: [
              ...prevState.branches,
              {
                branchId: selectedBranchId,
                schedule: [
                  {
                    day,
                    in: timeType === "in" ? value : "",
                    out: timeType === "out" ? value : "",
                  },
                ],
              },
            ],
          };
        }
      });
    } else if (name === "branch_select") {
      const selectedBranchId = value;

      setFormData((prevState) => {
        const branchExists = prevState.branches.some(
          (branch) => branch.branchId === selectedBranchId
        );

        if (!branchExists) {
          return {
            ...prevState,
            branches: [
              ...prevState.branches,
              {
                branchId: selectedBranchId,
                schedule: [],
              },
            ],
          };
        }

        return prevState;
      });
    } else if (name !== "confirmpassword") {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
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

  const handleBranchAssignemnt = (e) => {
    setBranchAssignment(e.target.value);
  };

  const validateForm = () => {
    let newErrors = {};

    if (currentCardIndex === 0) {
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

      if (!formData.birthdate)
        newErrors.birthdate = "(Date of birth is required)";

      if (
        !formData.contact_number ||
        !/^09\d{9}$/.test(formData.contact_number)
      )
        newErrors.contact_number =
          "(A valid 11-digit contact number is required)";
    } else if (currentCardIndex === 1) {
      if (!formData.position) newErrors.position = "(Please select a position)";

      //call validateForm before saving
    } else if (currentCardIndex === 2) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "(Valid email is required)";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  //Adding Staff
  const handleSubmitStaff = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return false;
    }

    console.log(formData);

    try {
      const response = await addStaffHook(formData);
      if (response) {
        const staffId = response.data.staffId;
        setIsSuccess(true);
        reduxDispatch(addStaff({ ...formData, staffId }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return ReactDOM.createPortal(
    <>
      {isLoading ? (
        <Loader description={"Saving Staff Information, please wait..."} />
      ) : (
        <div className="fixed p-4 top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
          <div className="w-[500px] md:w-[600px] md:mr-8">
            <header className="px-3 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
              <h1 className="text-p-rg md:text-p-lg text-c-secondary font-semibold">
                {currentCardIndex === 0 && "Personal Information & Contact"}
                {currentCardIndex === 1 && "Job Role & Working Hours"}
                {currentCardIndex === 2 && "Login Credentials"}
              </h1>
              <button onClick={onClose}>&times;</button>
            </header>
            <form onSubmit={handleSubmitStaff}>
              {currentCardIndex === 0 && (
                <div className="p-6 bg-white h-[500px] md:h-[600px] overflow-y-scroll">
                  <label className="flex items-center mb-8 gap-4">
                    {image ? (
                      <img
                        src={image}
                        alt="Staff"
                        className="h-24 w-24 rounded-2xl object-cover hover:cursor-pointer"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-2xl bg-blue-200 flex justify-center items-center text-gray-500">
                        <FiUser className="w-12 h-12" />
                      </div>
                    )}

                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <div>
                      <div className="flex gap-2 items-center mb-1">
                        <button
                          type="button"
                          className="text-blue-400 text-lg font-medium"
                          onClick={() =>
                            document.getElementById("imageUpload").click()
                          }
                        >
                          Upload
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                          type="button"
                          className="text-red-400 text-lg font-medium"
                          onClick={handleRemoveImage}
                          disabled={!image}
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-gray-500 text-sm">
                        An image of the staff
                      </p>
                    </div>
                  </label>
                  <div className="mb-5">
                    <header>
                      <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary mb-5">
                        | Personal Information
                      </h1>
                    </header>
                    <section>
                      <label
                        htmlFor="first_name"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        First Name:{" "}
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
                        placeholder="Enter first name of staff"
                      />
                    </section>
                    <section>
                      <label
                        htmlFor="last_name"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Last Name:{" "}
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
                        placeholder="Enter last name of staff"
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
                        placeholder="Enter middle name of staff"
                      />
                    </section>
                    <section>
                      <label
                        htmlFor="birthdate"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Date of Birth:{" "}
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
                          errors.birthdate
                            ? "border-red-400 focus:outline-red-400"
                            : "border-c-gray3 focus:outline-c-primary"
                        }`}
                      />
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
                        htmlFor="contact"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Contact Number:{" "}
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
                  </div>
                </div>
              )}
              {currentCardIndex === 1 && (
                <div className="p-6 bg-white h-[500px] md:h-[600px] overflow-y-scroll">
                  <div className="mb-5">
                    <header>
                      <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary mb-4">
                        | Position Information
                      </h1>
                    </header>
                    <section>
                      <label
                        htmlFor="role"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Role:{" "}
                        <span className="text-red-400">
                          {(formData.position === "" || errors.position) &&
                            errors.position}
                        </span>
                      </label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                          errors.position
                            ? "border-red-400 focus:outline-red-400"
                            : "border-c-gray3 focus:outline-c-primary"
                        }`}
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Role
                        </option>
                        <option value="Ophthalmologist">Ophthalmologist</option>
                        <option value="Optometrist">Optometrist</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </section>
                    {(formData.position === "Ophthalmologist" ||
                      formData.position === "Optometrist") && (
                      <section>
                        <label
                          htmlFor="branch_ass"
                          className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                        >
                          Branch Assignment{" "}
                          <span className="text-red-400">
                            {errors.branch_ass && errors.branch_ass}
                          </span>
                        </label>
                        <select
                          name="branch_ass"
                          value={branchAssignment}
                          onChange={handleBranchAssignemnt}
                          className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                            errors.branch_ass
                              ? "border-red-400 focus:outline-red-400"
                              : "border-c-gray3 focus:outline-c-primary"
                          }`}
                        >
                          <option value="" disabled className="text-c-gray3">
                            Select branch assignment
                          </option>
                          <option value="stationary">Stationary</option>
                          <option value="rotational">Rotational</option>
                        </select>
                      </section>
                    )}
                  </div>
                  <div>
                    <header className="flex justify-between ">
                      <div>
                        <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary mb-4">
                          | Working Hours
                        </h1>
                      </div>
                      <div className="flex mr-10 gap-10">
                        <p className="mr-10">Time in</p>
                        <p className="-mr-3">Time out</p>
                      </div>
                    </header>
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-4">
                        <div
                          className={`w-12 h-6 flex items-center bg-${
                            isMonOn ? "blue-500" : "gray-300"
                          } rounded-full p-1 cursor-pointer`}
                          onClick={() => setIsMonOn(!isMonOn)}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                              isMonOn ? "translate-x-6" : "translate-x-0"
                            } transition-transform`}
                          ></div>
                        </div>
                        <label
                          htmlFor="mon"
                          className="text-p-sm md:text-p-rg text-c-secondary font-medium"
                        >
                          Monday
                        </label>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isMonOn ? (
                          <>
                            {branchAssignment === "rotational" && (
                              <select
                                name="branch_select"
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                              >
                                <option value="" className="text-c-gray3">
                                  Select branch
                                </option>
                                {branches.map((branch) => (
                                  <option
                                    key={branch.branchId}
                                    value={branch.branchId}
                                  >
                                    {branch.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="time"
                                step="1800"
                                name="monday_in"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                              <input
                                type="time"
                                step="1800"
                                name="monday_out"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-p-sm md:text-p-rg text-c-gray3">
                            Not working this day
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-4">
                        <div
                          className={`w-12 h-6 flex items-center bg-${
                            isTueOn ? "blue-500" : "gray-300"
                          } rounded-full p-1 cursor-pointer`}
                          onClick={() => setIsTueOn(!isTueOn)}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                              isTueOn ? "translate-x-6" : "translate-x-0"
                            } transition-transform`}
                          ></div>
                        </div>
                        <label
                          htmlFor="tues"
                          className="text-p-sm md:text-p-rg text-c-secondary font-medium"
                        >
                          Tuesday
                        </label>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isTueOn ? (
                          <>
                            {branchAssignment === "rotational" && (
                              <select
                                name="branch_select"
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                              >
                                <option value="" className="text-c-gray3">
                                  Select branch
                                </option>
                                {branches.map((branch, key) => (
                                  <option key={key} value={branch.branchId}>
                                    {branch.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="time"
                                step="1800"
                                name="tuesday_in"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                              <input
                                type="time"
                                step="1800"
                                name="tuesday_out"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-p-sm md:text-p-rg text-c-gray3">
                            Not working this day
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-4">
                        <div
                          className={`w-12 h-6 flex items-center bg-${
                            isWedOn ? "blue-500" : "gray-300"
                          } rounded-full p-1 cursor-pointer`}
                          onClick={() => setIsWedOn(!isWedOn)}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                              isWedOn ? "translate-x-6" : "translate-x-0"
                            } transition-transform`}
                          ></div>
                        </div>
                        <label
                          htmlFor="wed"
                          className="text-p-sm md:text-p-rg text-c-secondary font-medium"
                        >
                          Wednesday
                        </label>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isWedOn ? (
                          <>
                            {branchAssignment === "rotational" && (
                              <select
                                name="branch_select"
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                              >
                                <option value="" className="text-c-gray3">
                                  Select branch
                                </option>
                                {branches.map((branch) => (
                                  <option
                                    key={branch.branchId}
                                    value={branch.branchId}
                                  >
                                    {branch.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="time"
                                name="wednesday_in"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                              <input
                                type="time"
                                name="wednesday_out"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-p-sm md:text-p-rg text-c-gray3">
                            Not working this day
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-4">
                        <div
                          className={`w-12 h-6 flex items-center bg-${
                            isThuOn ? "blue-500" : "gray-300"
                          } rounded-full p-1 cursor-pointer`}
                          onClick={() => setIsThuOn(!isThuOn)}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                              isThuOn ? "translate-x-6" : "translate-x-0"
                            } transition-transform`}
                          ></div>
                        </div>
                        <label
                          htmlFor="thu"
                          className="text-p-sm md:text-p-rg text-c-secondary font-medium"
                        >
                          Thursday
                        </label>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isThuOn ? (
                          <>
                            {branchAssignment === "rotational" && (
                              <select
                                name="branch_select"
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                              >
                                <option value="" className="text-c-gray3">
                                  Select branch
                                </option>
                                {branches.map((branch) => (
                                  <option
                                    key={branch.branchId}
                                    value={branch.branchId}
                                  >
                                    {branch.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="time"
                                name="thursday_in"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                              <input
                                type="time"
                                name="thursday_out"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-p-sm md:text-p-rg text-c-gray3">
                            Not working this day
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-4">
                        <div
                          className={`w-12 h-6 flex items-center bg-${
                            isFriOn ? "blue-500" : "gray-300"
                          } rounded-full p-1 cursor-pointer`}
                          onClick={() => setIsFriOn(!isFriOn)}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                              isFriOn ? "translate-x-6" : "translate-x-0"
                            } transition-transform`}
                          ></div>
                        </div>
                        <label
                          htmlFor="fri"
                          className="text-p-sm md:text-p-rg text-c-secondary font-medium"
                        >
                          Friday
                        </label>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isFriOn ? (
                          <>
                            {branchAssignment === "rotational" && (
                              <select
                                name="branch_select"
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                              >
                                <option value="" className="text-c-gray3">
                                  Select branch
                                </option>
                                {branches.map((branch) => (
                                  <option
                                    key={branch.branchId}
                                    value={branch.branchId}
                                  >
                                    {branch.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="time"
                                name="friday_in"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                              <input
                                type="time"
                                name="friday_out"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-p-sm md:text-p-rg text-c-gray3">
                            Not working this day
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-4">
                        <div
                          className={`w-12 h-6 flex items-center bg-${
                            isSatOn ? "blue-500" : "gray-300"
                          } rounded-full p-1 cursor-pointer`}
                          onClick={() => setIsSatOn(!isSatOn)}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                              isSatOn ? "translate-x-6" : "translate-x-0"
                            } transition-transform`}
                          ></div>
                        </div>
                        <label
                          htmlFor="sat"
                          className="text-p-sm md:text-p-rg text-c-secondary font-medium"
                        >
                          Saturday
                        </label>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isSatOn ? (
                          <>
                            {branchAssignment === "rotational" && (
                              <select
                                name="branch_select"
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                              >
                                <option value="" className="text-c-gray3">
                                  Select branch
                                </option>
                                {branches.map((branch) => (
                                  <option
                                    key={branch.branchId}
                                    value={branch.branchId}
                                  >
                                    {branch.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="time"
                                name="saturday_in"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                              <input
                                type="time"
                                name="saturday_out"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-p-sm md:text-p-rg text-c-gray3">
                            Not working this day
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div
                          className={`w-12 h-6 flex items-center ${
                            isSunOn ? "bg-blue-500" : "bg-gray-300"
                          } rounded-full p-1 cursor-pointer`}
                          onClick={() => setIsSunOn(!isSunOn)}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                              isSunOn ? "translate-x-6" : "translate-x-0"
                            } transition-transform`}
                          ></div>
                        </div>
                        <label
                          htmlFor="sun"
                          className="text-p-sm md:text-p-rg text-c-secondary font-medium"
                        >
                          Sunday
                        </label>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isSunOn ? (
                          <>
                            {branchAssignment === "rotational" && (
                              <select
                                name="branch_select"
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border rounded-md text-f-dark border-c-gray3 focus:outline-c-primary"
                              >
                                <option value="" className="text-c-gray3">
                                  Select branch
                                </option>
                                {branches.map((branch) => (
                                  <option
                                    key={branch.branchId}
                                    value={branch.branchId}
                                  >
                                    {branch.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="time"
                                name="sunday_in"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                              <input
                                type="time"
                                name="sunday_out"
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-p-sm md:text-p-rg text-c-gray3">
                            Not working this day
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {currentCardIndex === 2 && (
                <div className="p-6 bg-white h-[500px] md:h-[600px] overflow-y-scroll">
                  <div className="mb-5">
                    <header>
                      <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary mb-4">
                        | Email & Password
                      </h1>
                    </header>
                    <section>
                      <label
                        htmlFor="email"
                        className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                      >
                        Email Address:{" "}
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
                        className={`mt-1 w-full px-4 py-3 border rounded-md text-f-dark mb-4 ${
                          errors.email
                            ? "border-red-400 focus:outline-red-400"
                            : "border-c-gray3 focus:outline-c-primary"
                        }`}
                        placeholder="Enter email"
                      />
                    </section>
                  </div>
                </div>
              )}
            </form>
            <footer className="flex justify-end px-4 py-3 gap-4 bg-white border-2 border-t-f-gray rounded-b-lg">
              {currentCardIndex === 0 ? (
                <div className="w-full flex justify-between">
                  {staffData ? (
                    <button onClick={openConfirmation}>
                      <FiTrash className="w-5 h-5 text-red-500" />
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <button
                    className="px-4 lg:px-12 py-2 text-f-dark text-p-sm md:text-p-rg font-medium rounded-md border shadow-sm hover:bg-sb-org"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="px-4 lg:px-12 py-2 text-f-dark text-p-sm md:text-p-rg font-medium rounded-md border shadow-sm hover:bg-sb-org"
                  onClick={handleBack}
                >
                  Go Back
                </button>
              )}

              {currentCardIndex < 2 && (
                <button
                  className="px-4 lg:px-12 py-2 bg-bg-con text-f-light text-p-sm md:text-p-rg font-semibold rounded-md hover:bg-opacity-75"
                  onClick={handleNext}
                >
                  Continue
                </button>
              )}

              {currentCardIndex === 2 && (
                <button
                  className="px-4 lg:px-12 py-2 bg-bg-con text-f-light text-p-sm md:text-p-rg font-semibold rounded-md hover:bg-opacity-75"
                  onClick={handleSubmitStaff}
                >
                  Add Staff
                </button>
              )}
            </footer>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={isSuccess}
        onClose={() => {
          setIsSuccess(false);
          onClose();
        }}
        title="Adding Success"
        description="The staff has been registered in the system."
      />
      {isConfirmationModalOpen && (
        <ConfirmationModal
          onClose={() => setIsConfirmationModalOpen(false)}
          title={"Delete Branch"}
        />
      )}
    </>,
    document.body
  );
};

export default AddStaff;
