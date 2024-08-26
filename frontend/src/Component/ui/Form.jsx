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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData, e);
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
              className="w-full p-2 border-2 rounded-md mt-5 font-Poppins"
              disabled={disabled}
            />
          </div>
        ))}
      <button
        type="submit"
        disabled={disabled}
        className="flex justify-center gap-2 items-center mt-6 border-2 border-solid border-gray-400 w-full h-10 shadow-lg hover:cursor-pointer 
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
