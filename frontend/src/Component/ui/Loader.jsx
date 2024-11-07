import React from "react";
import ReactDOM from "react-dom";
import PuffLoader from "react-spinners/PuffLoader";
import BounceLoader from "react-spinners/BounceLoader";

const Loader = ({ description }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen bg-black bg-opacity-50 font-Poppins text-f-light text-p-rg font-medium p-10 md:p-0">
      <div className="text-center relative max-w-md w-fit mx-auto h-fit rounded-xl">
        <div className="flex justify-center items-center h-fit relative">
          <PuffLoader color="#40E3C4" loading={true} size={300} />
          <div className="absolute opacity-20">
            <BounceLoader color="#CEF9F0" loading={true} size={280} />
          </div>
          <h1 className="absolute text-wrap p-10">{description}</h1>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Loader;
