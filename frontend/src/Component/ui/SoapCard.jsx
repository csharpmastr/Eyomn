import React from "react";

const SoapCard = ({ soap }) => {
  return (
    <div className="flex p-5 rounded-lg bg-white border border-f-gray font-Poppins flex-col">
      <h1 className="text-p-lg font-semibold text-c-secondary mb-4">
        {soap.title}
      </h1>
      <p className="text-p-rg">{soap.record}</p>
    </div>
  );
};

export default SoapCard;
