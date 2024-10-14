import React from "react";

const SubmitButton = ({ value, onClick, disabled, style }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`${style} text-center bg-c-primary rounded-md text-lg font-Poppins text-f-light font-semibold`}
    >
      {value}
    </button>
  );
};

export default SubmitButton;
