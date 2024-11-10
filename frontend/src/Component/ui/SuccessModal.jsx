import React from "react";
import ReactDOM from "react-dom";

const SuccessModal = ({ description, onClose, isOpen, title }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] text-p-sm md:text-p-rg text-f-dark before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-Poppins">
      <div className="text-center bg-bg-sub relative rounded-lg pt-16 max-w-md w-full mx-auto">
        <div className="flex flex-col justify-center items-center px-5 gap-8">
          <div className="p-8 rounded-full bg-[#CEF9F0] animate-soundwave">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 rounded-full shrink-0 fill-[#40E3C4] inline bg-[#40E3C4]"
              viewBox="0 0 512 512"
            >
              <path
                d="M383.841 171.838c-7.881-8.31-21.02-8.676-29.343-.775L221.987 296.732l-63.204-64.893c-8.005-8.213-21.13-8.393-29.35-.387-8.213 7.998-8.386 21.137-.388 29.35l77.492 79.561a20.687 20.687 0 0 0 14.869 6.275 20.744 20.744 0 0 0 14.288-5.694l147.373-139.762c8.316-7.888 8.668-21.027.774-29.344z"
                data-original="#000000"
                className="fill-f-light"
              />
              <path
                d="M256 0C114.84 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 470.487c-118.265 0-214.487-96.214-214.487-214.487 0-118.265 96.221-214.487 214.487-214.487 118.272 0 214.487 96.221 214.487 214.487 0 118.272-96.215 214.487-214.487 214.487z"
                data-original="#000000"
              />
            </svg>
          </div>
          <article className="w-full max-w-sm">
            <h4 className="text-p-rg md:text-p-lg font-semibold">{title}</h4>
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
    </div>,
    document.body
  );
};

export default SuccessModal;
