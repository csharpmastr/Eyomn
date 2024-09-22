import React, { useState, useEffect } from "react";
import SubmitButton from "../../../Component/ui/SubmitButton";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { FiArrowRightCircle } from "react-icons/fi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const ScribePatient = () => {
  const patientName = sessionStorage.getItem("currentPatientName");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSelected, setIsSelected] = useState("raw");
  const [buttonText, setButtonText] = useState("Save Scribe");
  const [rawScribeText, setRawScribeText] = useState("");

  const doctor = useSelector((state) => state.reducer.doctor.doctor);
  const doctorName = doctor.first_name + " " + doctor.last_name;
  const currentDate = formatDate(new Date());
  const navigate = useNavigate();
  useEffect(() => {
    let interval;
    if (isLoading) {
      let dotCount = 0;
      interval = setInterval(() => {
        setButtonText(`Summarizing${".".repeat(dotCount % 4)}`);
        dotCount += 1;
      }, 500);
    } else {
      setButtonText("Save Scribe");
    }
    return () => {
      clearInterval(interval);
    };
  }, [isLoading]);

  const handleSubmitScribe = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setIsSelected("structured");
    }, 3000);
  };

  const handleToggleScribe = (scribeType) => {
    setIsSelected(scribeType);
  };

  const handleScribeChange = (e) => {
    setRawScribeText(e.target.value);
  };
  const handleNewScribe = () => {
    navigate("/scribe", { state: { resetSelected: true } });
    sessionStorage.removeItem("currentPatientId");
    sessionStorage.removeItem("currentPatientName");
  };

  return (
    <div className="w-full h-full px-8 pt-4 font-Poppins lg:flex lg:justify-center lg:flex-col lg:items-center xl:block">
      <div className="text-[16px] py-2 flex justify-between mx-auto">
        <div className="flex gap-1">
          <div className="flex flex-row ">
            <p className="flex items-center justify-center">
              Patient Name: {patientName}
            </p>
            <span className="h-[40px] w-[1.5px] bg-[#C8C8C8] mx-2 "></span>
            <p className="flex items-center justify-center">
              {doctor.position}: {doctor.name}
            </p>
          </div>
          <div className="hidden lg:flex lg:flex-row">
            <span className="h-[40px] w-[2px] bg-[#C8C8C8] mx-2 "></span>
            <p className="flex items-center justify-center">
              Date of visit: {currentDate}
            </p>
          </div>
        </div>
      </div>
      <div className=" text-[14px] mb-2 w-full mt-2 flex justify-between mx-auto">
        {isSubmitted ? (
          <h1 className="text-left text-[#A7A7A7] flex items-end">
            {isSelected === "structured" ? "Structured Scribe" : "Raw Scribe"}
          </h1>
        ) : (
          <h1 className="text-left text-[#A7A7A7]">{"Medical Raw Scribe"}</h1>
        )}
        {isSubmitted ? (
          <>
            <div
              className="h-10 flex justify-center items-center border-2 border-[#222222] rounded-md py-2 px-2 md:px-4 font-Poppins cursor-pointer"
              onClick={handleNewScribe}
            >
              <FiArrowRightCircle className="h-6 w-6 md:mr-2" />
              <h1 className="hidden md:block">New Scribe</h1>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <div
        className={`relative h-[70vh] lg:h-[60vh] xl:h-[65vh] w-full border-2 border-[#1ABC9C] rounded-md`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10 flex-col">
            <ClipLoader size={180} speedMultiplier={0.5} />
            <h1 className="font-Poppins font-semibold text-[24px]">
              Structuring your data
            </h1>
            <p className="text-Poppins text-[14px]">please wait</p>
          </div>
        )}
        {isSubmitted && isSelected === "raw" ? (
          // Show raw scribe as non-editable
          <textarea
            className="w-full h-full p-4 bg-gray-100 text-black"
            readOnly
            value={rawScribeText}
          />
        ) : isSubmitted && isSelected === "structured" ? (
          // Placeholder for structured scribe
          <div className="w-full h-full p-4">
            <p>Structured scribe content goes here...</p>
          </div>
        ) : (
          // Editable textarea before submission
          <textarea
            className={`w-full h-full p-4 ${
              isLoading ? "opacity-50 bg-[#1ABC9C]" : ""
            }`}
            disabled={isLoading}
            value={rawScribeText}
            onChange={handleScribeChange}
          />
        )}
      </div>
      {isSubmitted ? (
        <div className="flex gap-4 mt-4">
          <p
            className={`cursor-pointer ${
              isSelected === "raw"
                ? "text-black border-t-2 border-black"
                : "text-[#A7A7A7]"
            }`}
            onClick={() => handleToggleScribe("raw")}
          >
            Raw Scribe
          </p>
          <p
            className={`cursor-pointer ${
              isSelected === "structured"
                ? "text-black border-t-2 border-black"
                : "text-[#A7A7A7]"
            }`}
            onClick={() => handleToggleScribe("structured")}
          >
            Structured Scribe
          </p>
        </div>
      ) : (
        <div className="flex justify-end w-full mt-2 pb-2 lg:pb-0 mb-5 md:mb-5 lg:mb-0">
          <SubmitButton
            value={buttonText}
            style={`w-40 h-10 px-4 ${isLoading ? "" : "hover:bg-[#16A085]"}`}
            onClick={handleSubmitScribe}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default ScribePatient;
