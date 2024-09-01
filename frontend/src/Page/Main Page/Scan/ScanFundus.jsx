import React, { useState } from "react";
import { TiUpload } from "react-icons/ti";
import { FileUploader } from "react-drag-drop-files";

const ScanFundus = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Scanning completed!");
    }, 2000);
  };

  return (
    <div className="h-full w-full px-4 pt-4">
      <h1 className="font-Poppins text-[18px]">Upload fundus image</h1>
      <div className="font-Poppins px-4 flex flex-row gap-4 pb-2 mb-2 pt-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-black bg-red-100"></div>
        <h1 className="flex justify-center items-center font-Poppins">
          Mac Mac
        </h1>
      </div>
      <div className="flex justify-center items-center flex-col">
        <div
          className={`flex flex-col justify-center items-center h-[60vh] xl:w-[70vw] rounded-md mb-2${
            image ? `border-none` : `border-dashed border-2 border-[#C8C8C8]`
          }`}
        >
          {!image ? (
            <FileUploader
              handleChange={handleChange}
              name="file"
              types={["JPG", "PNG", "GIF"]}
              maxSize={50 * 1024 * 1024}
              className="flex-grow flex flex-col justify-center items-center h-full w-full"
            >
              <div className="flex flex-col justify-center items-center">
                <div className="flex justify-center items-center py-2 px-6 bg-[#1ABC9C] rounded-md font-Poppins text-white gap-4 hover:cursor-pointer mb-2">
                  <TiUpload className="w-auto h-8" />
                  <p>Upload Fundus Image</p>
                </div>
                <div className="text-center">
                  <p className="font-Poppins text-[14px] text-[#A7A7A7]">
                    Or drag image <span className="font-semibold">here...</span>
                  </p>
                  <p className="font-Poppins text-[18px] text-[#A7A7A7]">
                    Maximum size: 50MB
                  </p>
                </div>
              </div>
            </FileUploader>
          ) : (
            <img
              src={image}
              alt="Uploaded preview"
              className="rounded-lg w-full h-full xl:h-[60vh] xl:w-[70vw]"
            />
          )}
        </div>
        {image && (
          <div className="flex justify-end mt-5 mx-auto" onClick={handleScan}>
            <button className="py-2 px-6 bg-[#1ABC9C] text-white font-Poppins font-semibold rounded-md hover:bg-[#16a085]">
              {isLoading ? "Scanning..." : "Scan Fundus"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanFundus;
