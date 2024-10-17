import React from "react";

const SubmitButton = ({ value, onClick, disabled, style }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`${style} text-center px-4 py-3 rounded-md text-p-lg text-f-light font-semibold`}
    >
      {value}
    </button>
  );
};

export default SubmitButton;
