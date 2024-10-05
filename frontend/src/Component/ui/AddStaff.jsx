import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import Select from "react-select";
import PhList from "../../assets/Data/location_list.json";

const AddStaff = ({ onClose }) => {
  const [image, setImage] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const user = useSelector((state) => state.reducer.user.user);
  const [formData, setFormData] = useState({
    full_name: "",
    birthdate: "",
    province: "",
    municipality: "",
    email: "",
    contact: "",
    role: "",
    emp_type: "",
    clinicId: user.userId,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

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
    if (currentCardIndex < 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const [isMonOn, setIsMonOn] = useState(true);
  const [isTueOn, setIsTueOn] = useState(true);
  const [isWedOn, setIsWedOn] = useState(true);
  const [isThuOn, setIsThuOn] = useState(true);
  const [isFriOn, setIsFriOn] = useState(true);
  const [isSatOn, setIsSatOn] = useState(false);
  const [isSunOn, setIsSunOn] = useState(false);

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[500px] md:w-[600px] md:mr-8">
        <header className="px-3 py-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-lg text-c-secondary font-semibold">
            Patient Information
          </h1>
          <button onClick={onClose}>&times;</button>
        </header>
        <form>
          {currentCardIndex == 0 ? (
            <div className="p-6 bg-white h-[600px] overflow-y-scroll">
              <label className="flex items-center mb-8 gap-4">
                {image ? (
                  <img
                    src={image}
                    alt="Staff"
                    className="h-24 w-24 rounded-full object-cover hover:cursor-pointer"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-300 flex justify-center items-center text-gray-500 cursor-pointer">
                    <FiUser className="w-12 h-12" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden "
                />
                <h1>An image of the staff</h1>
              </label>
              <div className="mb-5">
                <header>
                  <h1 className="text-p-rg font-medium text-c-secondary mb-5">
                    | Personal Information
                  </h1>
                </header>
                <section>
                  <label
                    htmlFor="full_name"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Full Name:
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Enter full name of staff"
                  />
                </section>
                <section>
                  <label
                    htmlFor="birthdate"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Date of Birth:
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    //value={formData.birthdate}
                    //onChange={handleChange}
                    className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
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
          ) : (
            <div className="p-6 bg-white h-[600px] overflow-y-scroll">
              <div className="mb-5">
                <header>
                  <h1 className="text-p-rg font-medium text-c-secondary mb-4">
                    | Position Information
                  </h1>
                </header>
                <section>
                  <label
                    htmlFor="role"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  >
                    <option value="" disabled className="text-c-gray3">
                      Select Role
                    </option>
                    <option value="Ophthalmologist">Ophthalmologist</option>
                    <option value="Optometrist">Optometrist</option>
                    <option value="Staff">Staff</option>
                  </select>
                </section>
                <section>
                  <label
                    htmlFor="emp_type"
                    className="text-p-sm text-c-gray3 font-medium"
                  >
                    Employment Type
                  </label>
                  <select
                    name="emp_type"
                    value={formData.emp_type}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  >
                    <option value="" disabled className="text-c-gray3">
                      Select Employment Type
                    </option>
                    <option value="fulltime">Full Time</option>
                    <option value="parttime">Part Time</option>
                  </select>
                </section>
              </div>
              <div>
                <header>
                  <h1 className="text-p-rg font-medium text-c-secondary mb-4">
                    | Working Hours
                  </h1>
                </header>
                <div className="flex items-center justify-between mb-4">
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
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Monday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isMonOn ? (
                      <>
                        <input
                          type="time"
                          name="mon_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="mon_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
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
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Tuesday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isTueOn ? (
                      <>
                        <input
                          type="time"
                          name="tues_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="tues_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
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
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Wednesday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isWedOn ? (
                      <>
                        <input
                          type="time"
                          name="wed_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="wed_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
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
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Thursday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isThuOn ? (
                      <>
                        <input
                          type="time"
                          name="thu_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="thu_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
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
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Friday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isFriOn ? (
                      <>
                        <input
                          type="time"
                          name="fri_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="fri_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
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
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Saturday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isSatOn ? (
                      <>
                        <input
                          type="time"
                          name="sat_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="sat_to"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-6 flex items-center bg-${
                        isSunOn ? "blue-500" : "gray-300"
                      } rounded-full p-1 cursor-pointer`}
                      onClick={() => setIsSunOn(!isSunOn)}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                          isMonOn ? "translate-x-6" : "translate-x-0"
                        } transition-transform`}
                      ></div>
                    </div>
                    <label
                      htmlFor="sun"
                      className="text-p-rg text-c-secondary font-medium"
                    >
                      Sunday
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {isSunOn ? (
                      <>
                        <input
                          type="time"
                          name="sun_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <input
                          type="time"
                          name="sun_from"
                          onChange={handleChange}
                          className="w-full px-2 py-1 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </>
                    ) : (
                      <span className="text-p-rg text-c-gray3">
                        Not working this day
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
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
    </div>,
    document.body
  );
};

export default AddStaff;
