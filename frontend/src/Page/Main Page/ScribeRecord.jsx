import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

const ScribeRecord = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNext = () => {
    if (currentCardIndex < 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  return (
    <>
      <div className="p-8 h-full">
        <div className="flex justify-between mb-8">
          <h1 className="text-p-lg font-semibold">Bradley Simpon</h1>
          <div
            className="ml-2 h-auto flex justify-center items-center rounded-md px-4 py-3 font-Poppins bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
            //onClick={openAddPatient}
          >
            <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
            <h1 className="hidden md:block">Create New Note</h1>
          </div>
        </div>
        <div className="w-full text-f-dark">
          <nav className="flex items-end ml-5">
            <button
              className={`w-44 flex items-center justify-center rounded-t-lg font-medium ${
                currentCardIndex === 0
                  ? `h-14 bg-[#FFF8DF] text-p-rg`
                  : `h-10 bg-[#D2D2D2] text-p-sm`
              }`}
              onClick={handleBack}
              disabled={currentCardIndex === 0}
            >
              Medical Scribe
            </button>
            <button
              className={`w-44 flex items-center justify-center rounded-t-lg font-medium ${
                currentCardIndex === 0
                  ? `h-10 bg-[#D2D2D2] text-p-sm`
                  : `h-14 bg-[#FFF8DF] text-p-rg`
              }`}
              onClick={handleNext}
              disabled={currentCardIndex === 1}
            >
              Raw Form
            </button>
          </nav>
          {currentCardIndex == 0 ? (
            <div className="w-full rounded-lg shadow-xl">
              <div
                className={`px-8 flex h-20 border-b-[1px] items-center justify-between font-medium ${
                  index % 2 === 0 ? "bg-bg-mc" : `bg-white`
                }`}
              >
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-6 h-6" />
                  <p>Medical Scibe Record 1</p>
                </div>
                <p>Date and Time</p>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-lg shadow-xl">
              <div
                className={`px-8 flex h-20 border-b-[1px] items-center justify-between font-medium ${
                  index % 2 === 0 ? "bg-bg-mc" : `bg-white`
                }`}
              >
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-6 h-6" />
                  <p>Medical Case Record 1</p>
                </div>
                <p>Date and Time</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ScribeRecord;
