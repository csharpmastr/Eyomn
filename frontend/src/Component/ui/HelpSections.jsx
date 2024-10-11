import React, { useState } from "react";
import { TiUpload } from "react-icons/ti";
import { FileUploader } from "react-drag-drop-files";

const HelpSections = ({ selected }) => {
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [tickForm, setTickForm] = useState({
    concern_title: "",
    description: "",
    support_category: "",
    attachment: null,
  });

  const handleChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;

      if (errors[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }

      setTickForm((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      const file = e;
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = reader.result;
        setImage(fileData);
        setTickForm((prevData) => ({
          ...prevData,
          attachment: fileData,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (
      !tickForm.concern_title ||
      !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(tickForm.concern_title)
    )
      newErrors.concern_title = "(Title is required)";

    if (
      !tickForm.description ||
      !/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(tickForm.description)
    )
      newErrors.description = "(At least add short description)";

    if (!tickForm.support_category)
      newErrors.support_category = "(Please select category)";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="w-full h-full flex flex-col gap-8">
      {selected === "Getting Started" && (
        <div className="w-full border border-f-gray bg-white rounded-lg px-10 h-52 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-p-lg">Getting Started</h1>
        </div>
      )}
      {selected === "Account" && (
        <div className="w-full border border-f-gray bg-white rounded-lg px-10 h-52 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-p-lg">Account</h1>
        </div>
      )}
      {selected === "Billing" && (
        <div className="w-full border border-f-gray bg-white rounded-lg px-10 h-52 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-p-lg">Billing</h1>
        </div>
      )}
      {selected === "FAQ's" && (
        <div className="w-full border border-f-gray bg-white rounded-lg px-10 h-52 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-p-lg">FAQ's</h1>
        </div>
      )}
      {selected === "Features" && (
        <div className="w-full border border-f-gray bg-white rounded-lg px-10 h-52 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-p-lg">Features</h1>
        </div>
      )}
      {selected === "Changelog" && (
        <div className="w-full border border-f-gray bg-white rounded-lg px-10 h-52 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-p-lg">Changelog</h1>
        </div>
      )}
      {selected === "Submit a Ticket" && (
        <div className="w-full border border-f-gray bg-white rounded-lg p-10 h-full flex flex-col justify-between">
          <form>
            <section className="w-full">
              <label
                htmlFor="concern_title"
                className="text-p-rg text-c-gray3 font-medium"
              >
                Concern Title{" "}
                <span className="text-red-400">
                  {(tickForm.concern_title === "" || errors.concern_title) &&
                    errors.concern_title}
                </span>
              </label>
              <input
                type="text"
                name="concern_title"
                value={tickForm.concern_title}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                placeholder="Enter concern title"
              />
            </section>
            <section className="w-full">
              <label
                htmlFor="description"
                className="text-p-rg text-c-gray3 font-medium"
              >
                Description{" "}
                <span className="text-red-400">
                  {(tickForm.description === "" || errors.description) &&
                    errors.description}
                </span>
              </label>
              <input
                type="text"
                name="description"
                value={tickForm.description}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                placeholder="Enter description of concern"
              />
            </section>
            <section className="w-full">
              <label
                htmlFor="support_category"
                className="text-p-rg text-c-gray3 font-medium"
              >
                Support Category{" "}
                <span className="text-red-400">
                  {(tickForm.support_category === "" ||
                    errors.support_category) &&
                    errors.support_category}
                </span>
              </label>
              <select
                name="support_category"
                value={tickForm.support_category}
                onChange={handleChange}
                className="mt-2 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-5 focus:outline-c-primary"
              >
                <option value="" disabled className="text-c-gray3">
                  Select Category
                </option>
                <option value="Technical Problem">Technical Problem</option>
                <option value="-">-</option>
                <option value="-">-</option>
              </select>
            </section>
            <section className="w-full">
              <label
                htmlFor="attachment"
                className="text-p-rg text-c-gray3 font-medium"
              >
                Attachment
              </label>
              <div
                className={`justify-center items-center rounded-md w-full h-72 mb-4 mt-2 ${
                  image
                    ? `border-none`
                    : `border-dashed border-2 border-c-gray3 `
                }`}
              >
                {!image ? (
                  <FileUploader
                    handleChange={handleChange}
                    name="file"
                    types={["JPG", "PNG", "GIF"]}
                    maxSize={50 * 1024 * 1024}
                  >
                    <div className="flex flex-col justify-center items-center h-full rounded-md font-Poppins text-c-gray3 gap-4 mb-2">
                      <TiUpload className="w-auto h-28" />
                      <div>
                        <h1 className="text-p-lg">Upload an Image</h1>
                        <p className="text-p-sm">JPG, PNG, GIF (MAX: 50MB)</p>
                      </div>
                    </div>
                  </FileUploader>
                ) : (
                  <img
                    src={image}
                    alt="Uploaded preview"
                    className="rounded-md w-full h-full border border-c-gray3"
                  />
                )}
              </div>
            </section>
          </form>
          <div className="flex justify-end">
            <button className="w-48 px-8 py-3 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary">
              Submit Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSections;
