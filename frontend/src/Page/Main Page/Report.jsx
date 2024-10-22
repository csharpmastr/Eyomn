import React, { useState } from "react";
import EyeSketch from "../../Component/ui/EyeSketch";
import OD from "../../assets/Image/OD.png";
import OS from "../../assets/Image/OS.png";
import CROSS from "../../assets/Image/CROSS.png";

const Report = () => {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [selectedBG, setSelectedBG] = useState("OD");
  const [canvasImages, setCanvasImages] = useState({
    OD: "",
    OS: "",
    CROSS: "",
  });

  const toggle = () => setIsCanvasOpen(!isCanvasOpen);

  const handleSaveCanvas = (image) => {
    setCanvasImages((prevImages) => ({
      ...prevImages,
      [selectedBG]: image,
    }));
    setIsCanvasOpen(false);
  };

  const handleImageClick = (value) => {
    setSelectedBG(value);
    toggle();
  };

  return (
    <div className="text-f-dark p-4 md:p-8 font-Poppin h-auto flex flex-col gap-4 md:gap-8">
      <img
        src={canvasImages.OD || OD}
        alt="OD IMG"
        className="w-20 h-20 border border-f-dark"
        onClick={() => handleImageClick("OD")}
      />
      <img
        src={canvasImages.OS || OS}
        alt="OS IMG"
        className="w-20 h-20 border border-f-dark"
        onClick={() => handleImageClick("OS")}
      />
      <img
        src={canvasImages.CROSS || CROSS}
        alt="CROSS IMG"
        className="w-20 h-20 border border-f-dark"
        onClick={() => handleImageClick("CROSS")}
      />
      {isCanvasOpen && (
        <EyeSketch
          onClose={toggle}
          onSave={handleSaveCanvas}
          backgroundImage={selectedBG}
        />
      )}
    </div>
  );
};

export default Report;
