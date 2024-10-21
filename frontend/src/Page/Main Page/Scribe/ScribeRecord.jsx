import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { TiUpload } from "react-icons/ti";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";
import EnlargeImg from "../../../Component/ui/EnlargeImg";
import SampleImage from "../../../assets/Image/eyomn_logoS1-2-06.jpg";

const ScribeRecord = () => {
  const { patientId } = useParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const [currentPatient, setCurrentPatient] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [image, setImage] = useState(null);

  const medicalRecords = [
    { id: 1, name: "Medical Scribe Record 1", date: "2024-01-01" },
    { id: 2, name: "Medical Scribe Record 2", date: "2024-01-02" },
  ];

  const rawRecords = [
    { id: 1, name: "Raw Record 1", date: "2024-01-01" },
    { id: 2, name: "Raw Record 2", date: "2024-01-02" },
  ];

  const handleNewRecord = () => {
    navigate(`/scribe/new-record/${patientId}`);
  };

  useEffect(() => {
    sessionStorage.setItem("currentPath", location.pathname);
    if (patients.length > 0) {
      const patient = patients.find((p) => p.patientId === patientId);
      setCurrentPatient(patient);
    }
  }, [patients, patientId]);

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = reader.result;
        setImage(fileData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const [selectImgOpen, setSelectImgOpen] = useState(null);
  const images = Array.from({ length: 13 }).map(() => SampleImage);

  const handleOpenImg = (imageUrl) => {
    setSelectImgOpen(imageUrl);
  };

  const handleCloseImg = () => {
    setSelectImgOpen(null);
  };

  return (
    <>
      <div className="p-4 md:p-6 h-full font-Poppins">
        <div className="flex justify-between mb-8">
          <h1 className="text-p-lg font-semibold flex justify-center items-center">
            {currentPatient
              ? `${currentPatient.first_name} ${currentPatient.last_name}`
              : "Loading..."}
          </h1>
          <div
            className="h-auto flex justify-center items-center rounded-md px-4 py-3 bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
            onClick={handleNewRecord}
          >
            <FiPlus className="h-5 w-5 md:mr-2" />
            <h1>Create New Note</h1>
          </div>
        </div>

        <div className="w-full text-f-dark">
          <nav className="flex items-end h-14">
            <button
              className={`w-44 flex items-center justify-center rounded-t-lg transition-all duration-300 ease-in-out font-medium ${
                currentCardIndex === 0
                  ? `h-12 bg-[#FFF8DF] text-p-rg`
                  : `h-8 bg-[#D2D2D2] text-p-sm opacity-70`
              }`}
              onClick={() => setCurrentCardIndex(0)}
            >
              Medical Scribe
            </button>
            <button
              className={`w-44 flex items-center justify-center rounded-t-lg transition-all duration-300 ease-in-out font-medium ${
                currentCardIndex === 1
                  ? `h-12 bg-[#FFF8DF] text-p-rg`
                  : `h-8 bg-[#D2D2D2] text-p-sm opacity-70`
              }`}
              onClick={() => setCurrentCardIndex(1)}
            >
              Raw Form
            </button>
            <button
              className={`w-44 flex items-center justify-center rounded-t-lg transition-all duration-300 ease-in-out font-medium ${
                currentCardIndex === 2
                  ? `h-12 bg-[#FFF8DF] text-p-rg`
                  : `h-8 bg-[#D2D2D2] text-p-sm opacity-70`
              }`}
              onClick={() => setCurrentCardIndex(2)}
            >
              Image Archive
            </button>
          </nav>
          {currentCardIndex === 0 && (
            <div className="w-full">
              {medicalRecords.map((record) => (
                <div
                  key={record.id}
                  className="px-6 rounded-sm flex h-20 mb-2 items-center justify-between font-medium bg-white"
                >
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-6 h-6" />
                    <p>{record.name}</p>
                  </div>
                  <p>{record.date}</p>
                </div>
              ))}
            </div>
          )}
          {currentCardIndex === 1 && (
            <div className="w-full">
              {rawRecords.map((record) => (
                <div
                  key={record.id}
                  className="px-6 rounded-sm flex h-20 mb-2 items-center justify-between font-medium bg-white"
                >
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-6 h-6" />
                    <p>{record.name}</p>
                  </div>
                  <p>{record.date}</p>
                </div>
              ))}
            </div>
          )}
          {currentCardIndex === 2 && (
            <div className="w-full h-full pt-6 flex gap-2 md:gap-6">
              <div className="w-1/6">
                <div
                  className={`relative justify-center items-center rounded-md aspect-square ${
                    image
                      ? `border-none`
                      : `border-dashed border-2 border-c-gray3`
                  }`}
                >
                  {!image ? (
                    <FileUploader
                      handleChange={handleImageUpload}
                      name="file"
                      types={["JPG", "PNG", "GIF"]}
                      maxSize={50 * 1024 * 1024}
                    >
                      <div className="flex flex-col justify-center items-center w-full h-full text-c-gray3 gap-2">
                        <TiUpload className="h-10 w-10" />
                        <h1 className="text-p-rg text-center hidden md:block">
                          Upload an Image
                        </h1>
                      </div>
                    </FileUploader>
                  ) : (
                    <div className="relative w-full h-full">
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-3 -right-4 md:top-2 md:right-2 bg-c-gray3 text-white pt-1 px-3 rounded-full text-2xl hover:bg-c-red"
                      >
                        &times;
                      </button>
                      <img
                        src={image}
                        alt="Uploaded preview"
                        className="rounded-md w-full h-full border border-c-gray3"
                      />
                    </div>
                  )}
                </div>
                {image && (
                  <button className="bg-c-primary text-f-light text-p-rg rounded-md font-semibold py-1 md:py-3 w-full mt-3">
                    Save
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-8 w-full h-full overflow-y-auto">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="cursor-pointer rounded-md"
                    onClick={() => handleOpenImg(image)}
                  />
                ))}
                {selectImgOpen !== null && (
                  <EnlargeImg
                    imageUrl={selectImgOpen}
                    onClose={handleCloseImg}
                    fileName={images}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ScribeRecord;
