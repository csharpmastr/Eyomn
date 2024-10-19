import React, { useState } from "react";
import { TiUpload } from "react-icons/ti";
import { FileUploader } from "react-drag-drop-files";

const HelpSections = ({ selected }) => {
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
    </div>
  );
};

export default HelpSections;
