import React from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";

const EnlargeImg = ({ imageUrl, onClose, fileName }) => {
  const handleImgDownload = () => {
    const ImgName = fileName;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${ImgName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 p-20">
      <div className="h-fit w-fit bg-white text-white text-3xl rounded-lg relative">
        <div className="flex gap-4 absolute top-4 right-4 items-center text-f-dark">
          <button
            className="p-4 rounded-full bg-gray-200"
            onClick={handleImgDownload}
          >
            <HiOutlineDownload className="w-7 h-7 " />
          </button>
          <button
            className="py-3 px-5 rounded-full bg-gray-200"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <img
          src={imageUrl}
          alt="Enlarged"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default EnlargeImg;
