import React from "react";

const SubmitButton = ({ value, onClick, disabled, style }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`${style} h-12 text-center bg-[#1ABC9C] rounded-md text-lg font-Poppins text-white font-semibold`}
    >
      {value}
    </button>
  );
};

export default SubmitButton;
