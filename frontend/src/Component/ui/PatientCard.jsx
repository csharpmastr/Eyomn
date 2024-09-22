import React, { useState, useEffect } from "react";

const PatientCard = ({ name, onClick }) => {
  const [backgroundColor, setBackgroundColor] = useState("");

  const getInitials = (fullName) => {
    const names = fullName.split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else if (names.length === 2) {
      return (
        names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase()
      );
    } else {
      return (
        names[0].charAt(0).toUpperCase() +
        names[names.length - 1].charAt(0).toUpperCase()
      );
    }
  };

  const generateComplementaryColor = () => {
    const getRandomColorComponent = () => Math.floor(Math.random() * 256);

    const r = getRandomColorComponent();
    const g = getRandomColorComponent();
    const b = getRandomColorComponent();

    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    const adjustedR = luminance > 0.5 ? r - 50 : r + 50;
    const adjustedG = luminance > 0.5 ? g - 50 : g + 50;
    const adjustedB = luminance > 0.5 ? b - 50 : b + 50;

    return `rgb(${Math.max(0, Math.min(255, adjustedR))}, ${Math.max(
      0,
      Math.min(255, adjustedG)
    )}, ${Math.max(0, Math.min(255, adjustedB))})`;
  };

  useEffect(() => {
    setBackgroundColor(generateComplementaryColor());
  }, []);

  return (
    <div
      className="font-Poppins mt-2 px-4 flex flex-row gap-4 border-b-2 pb-2 mb-4 pt-2 hover:bg-gray-200 hover:cursor-pointer"
      onClick={onClick}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white"
        style={{ backgroundColor }}
      >
        {getInitials(name)}
      </div>
      <h1 className="flex justify-center items-center">{name}</h1>
    </div>
  );
};

export default PatientCard;
