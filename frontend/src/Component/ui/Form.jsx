import React, { useState } from "react";

const Form = ({ formFields = [], handleSubmit, disabled }) => {
  const [formData, setFormData] = useState(
    Array.isArray(formFields)
      ? formFields.reduce((acc, field) => {
          acc[field.name] = "";
          return acc;
        }, {})
      : {}
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    formFields.forEach((field) => {
      const { name, pattern, errorMessage, type } = field;
      const value = formData[name];

      if (type === "email") {
        if (!value || value.split("@")[0].length < 3) {
          newErrors[name] = "Email must have at least 3 characters";
          isValid = false;
        }
      } else if (pattern && !new RegExp(pattern).test(value)) {
        newErrors[name] = errorMessage || "Invalid input.";
        isValid = false;
      } else {
        newErrors[name] = "";
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(formData, e);
    }
  };

  return (
    <form className="" onSubmit={onSubmit}>
      {Array.isArray(formFields) &&
        formFields.map((field) => (
          <div key={field.name} className="">
            <label htmlFor={field.name} className="">
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full p-2 border-2 rounded-md mb-5 font-Poppins"
              disabled={disabled}
              pattern={field.pattern}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm font-Poppins pl-2 pt-2">
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      <button
        type="submit"
        disabled={disabled}
        className="flex justify-center gap-2 items-center rounded-md border-2 border-solid border-gray-400 w-full h-10 shadow-lg hover:cursor-pointer 
              transition-transform ease-in-out duration-300 
            hover:bg-gray-400 hover:bg-opacity-25 text-lg
              hover:shadow-xl hover:scale-105 tracking-wide  text-paragraph  font-Poppins font-bold  "
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
