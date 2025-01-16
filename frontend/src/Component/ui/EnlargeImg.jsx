import React from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";

const EnlargeImg = ({ imageUrl, onClose, fileName }) => {
  const handleImgDownload = () => {
    window.open(imageUrl, "_blank");
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 p-4 lg:p-80">
      <div className="h-fit w-fit bg-white text-white text-3xl rounded-lg relative">
        <div className="flex gap-4 absolute top-4 right-4 items-center text-f-dark">
          <button
            className="p-4  rounded-full bg-gray-200"
            onClick={handleImgDownload}
          >
            <HiOutlineDownload className="w-5 h-5 " />
          </button>
          <button
            className="py-1 px-3 rounded-full bg-gray-200 flex items-center justify-center"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <img
          src={imageUrl}
          alt="Enlarged"
          className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] xl:w-[800px] xl:h-[800px] object-fill rounded-lg"
        />
      </div>
    </div>
  );
};

export default EnlargeImg;
