import React from "react";
import DotLoader from "react-spinners/DotLoader";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-900 opacity-50 backdrop-blur-md"></div>
      <DotLoader speedMultiplier={0.5} />
    </div>
  );
};

export default Loader;
