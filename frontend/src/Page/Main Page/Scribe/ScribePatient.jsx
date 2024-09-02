import React from "react";
import SubmitButton from "../../../Component/ui/SubmitButton";

const ScribePatient = () => {
  return (
    <div className="w-full h-full px-8 pt-4 font-Poppins text-[18px] lg:flex lg:justify-center lg:flex-col lg:items-center xl:block">
      <div className="w-full">
        <h1>Medical Raw Scribe</h1>
      </div>
      <div className="h-[70vh] w-full border-2 border-[#1ABC9C] rounded-md mt-2 mb-2">
        <textarea className="w-full h-full p-4" />
      </div>
      <div className="flex justify-end w-full">
        <SubmitButton value={"Save Scribe"} style={"w-auto px-4 "} />
      </div>
    </div>
  );
};

export default ScribePatient;
