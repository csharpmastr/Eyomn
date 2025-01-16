import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const SubmitButton = ({ value, onClick, disabled, style, isLoading }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`${style} text-center p-4 rounded-md text-p-rg text-f-light font-medium flex items-center justify-center gap-2`}
    >
      {isLoading ? (
        <>
          <ClipLoader size={24} color="#a5b7bb" />
          {value}
        </>
      ) : (
        value
      )}
    </button>
  );
};

export default SubmitButton;
