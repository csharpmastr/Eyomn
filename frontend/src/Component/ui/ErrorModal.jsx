import React from "react";

const ErrorModal = ({ description, onClose, isOpen, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] text-p-rg text-f-dark before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-Poppins">
      <div className="text-center bg-bg-sub relative rounded-lg pt-16 max-w-md w-full mx-auto">
        <div className="flex flex-col justify-center items-center px-5 gap-8">
          <div className="p-8 rounded-full bg-[#f9cece] animate-soundwave">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-20 rounded-full shrink-0 fill-[#e34040] inline bg-[#e34040]"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                className="fill-f-light"
              />
            </svg>
          </div>
          <article className="w-full max-w-sm">
            <h4 className="text-p-lg font-semibold">{title}</h4>
            <p className="text-wrap text-c-gray3 leading-relaxed pt-1">
              {description}
            </p>
          </article>
        </div>
        <div
          className="border-t py-5 w-full mt-8 font-medium cursor-pointer bg-bg-sb rounded-b-lg hover:bg-c-primary"
          onClick={onClose}
        >
          <h1>Done</h1>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
