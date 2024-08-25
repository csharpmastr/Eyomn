import React, { useState } from 'react';

const Form = ({ formFields = [], handleSubmit, disabled }) => {
  const [formData, setFormData] = useState(
    Array.isArray(formFields)
      ? formFields.reduce((acc, field) => {
          acc[field.name] = '';
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
    <form className='' onSubmit={onSubmit}>
      {Array.isArray(formFields) &&
        formFields.map((field) => (
          <div key={field.name} className=''>
            <label htmlFor={field.name} className=''>
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              className='w-full p-2 border-2 rounded-md mt-5 font-Poppins'
              disabled={disabled}
            />
          </div>
        ))}
      <button type="submit" disabled={disabled} className='w-full mt-5 border-2 p-2 font-Poppins font-bold bg-white hover:bg-gray-400  shadow-md '>Submit</button>
    </form>
  );
};

export default Form;
