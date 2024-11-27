import React, { useState, useEffect } from "react";
import Select from "react-select";
import PhList from "../../assets/Data/location_list.json";
import Loader from "./Loader";
import { addBranchService } from "../../Service/organizationService";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import SuccessModal from "./SuccessModal";
import { addBranch } from "../../Slice/BranchSlice";
import { FiTrash } from "react-icons/fi";
import ConfirmationModal from "./ConfirmationModal";

const AddBranchModal = ({ onClose, branchToEdit }) => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const reduxDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.reducer.user.user);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    province: "",
    municipality: "",
    email: "",
  });

  const openConfirmation = () =>
    setIsConfirmationModalOpen(!isConfirmationModalOpen);

  useEffect(() => {
    if (branchToEdit) {
      setFormData({
        name: branchToEdit.name,
        province: branchToEdit.province,
        municipality: branchToEdit.municipality,
        email: branchToEdit.email,
      });

      setSelectedProvince({
        value: branchToEdit.province,
        label: branchToEdit.province,
      });
      setSelectedMunicipality({
        value: branchToEdit.municipality,
        label: branchToEdit.municipality,
      });
    } else {
      setFormData({
        name: "",
        province: "",
        municipality: "",
        email: "",
      });
      setSelectedProvince(null);
      setSelectedMunicipality(null);
    }
  }, [branchToEdit]);

  const handleCloseModal = () => {
    setFormData({
      name: "",
      province: "",
      municipality: "",
      email: "",
    });
    setSelectedProvince(null);
    setSelectedMunicipality(null);
    onClose();
  };

  const handleChange = (e) => {
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
      setFormData({ ...formData, [name]: value });
    }
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

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name || !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(formData.name))
      newErrors.name = "(Branch name is required)";

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "(Valid email is required)";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await addBranchService(
        formData,
        user.userId,
        user.firebaseUid
      );

      if (response) {
        setIsSuccess(true);
        const { branchId } = response;
        reduxDispatch(addBranch({ branchId, ...formData }));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader description={"Saving branch Information, please wait..."} />
      ) : (
        <div className="fixed top-0 left-0 flex items-center p-4 justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
          <div className="w-[600px]">
            <header className="px-4 py-3 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
              <h1 className="text-p-rg md:text-p-lg text-c-secondary font-medium">
                {branchToEdit ? "Edit Branch" : "Add Branch"}
              </h1>
              <button onClick={handleCloseModal}> &times; </button>
            </header>
            <div className="py-6 px-6 h-[400px] md:h-fit bg-white overflow-y-scroll">
              <div>
                <section>
                  <label
                    htmlFor="name"
                    className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                  >
                    Branch Name:{" "}
                    <span className="text-red-400">
                      {(formData.name === "" || errors.name) && errors.name}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 mb-6 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                    placeholder="Enter branch name"
                  />
                </section>
                <div className="flex gap-4 mb-6">
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
                    htmlFor="email"
                    className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
                  >
                    Email Address:{" "}
                    <span className="text-red-400">
                      {(formData.email === "" || errors.email) && errors.email}
                    </span>
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
            <footer className="border border-t-f-gray bg-white rounded-b-lg flex gap-4 justify-end py-3 px-4">
              <div className="w-full flex justify-between">
                {branchToEdit ? (
                  <button onClick={openConfirmation}>
                    <FiTrash className="w-5 h-5 text-red-500" />
                  </button>
                ) : (
                  <div></div>
                )}
                <button
                  className="px-4 lg:px-12 py-2 text-f-dark text-p-sm md:text-p-rg font-medium rounded-md border shadow-sm hover:bg-sb-org"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
              <button
                className="px-4 lg:px-12 py-2 bg-bg-con text-f-light text-p-sm md:text-p-rg font-semibold rounded-md hover:bg-opacity-75 text-nowrap"
                onClick={handleSubmit}
              >
                {branchToEdit ? "Save" : "Add Branch"}
              </button>
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
        description="The branch has been registered in the system."
      />
      {isConfirmationModalOpen && (
        <ConfirmationModal
          onClose={() => setIsConfirmationModalOpen(false)}
          title={"Delete Branch"}
        />
      )}
    </>
  );
};

export default AddBranchModal;
