import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import ReactDOM from "react-dom";
import { FaUndo, FaRedo } from "react-icons/fa";
import OD from "../../assets/Image/OD.png";
import OS from "../../assets/Image/OS.png";
import CROSS from "../../assets/Image/CROSS.png";
import BLANK_OD from "../../assets/Image/BLANKOD.png";
import BLANK_OS from "../../assets/Image/BLANKOS.png";
import FRONT_OD from "../../assets/Image/FRONTOD.png";
import FRONT_OS from "../../assets/Image/FRONTOS.png";

const EyeSketch = ({ onClose, onSave, backgroundImage }) => {
  const canvasRef = useRef(null);
  const [bgImage, setBgImage] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });

  // Get the background image path based on backgroundImage prop
  const getBackgroundImage = (imageKey) => {
    switch (imageKey) {
      case "OD":
        return OD;
      case "OS":
        return OS;
      case "CROSS":
        return CROSS;
      case "BLANK_OD":
        return BLANK_OD;
      case "BLANK_OS":
        return BLANK_OS;
      case "FRONT_OD":
        return FRONT_OD;
      case "FRONT_OS":
        return FRONT_OS;
      default:
        return null;
    }
  };

  // Set the background image and canvas size on mount or when backgroundImage changes
  useEffect(() => {
    const img = new Image();
    img.src = getBackgroundImage(backgroundImage);
    img.onload = () => {
      setBgImage(img.src);
      setCanvasSize({ width: img.width, height: img.height });
    };
    img.onerror = (err) => {
      console.error("Error loading background image:", err);
    };
  }, [backgroundImage]);

  // Handle saving the canvas with the drawing and background combined
  const handleSave = async () => {
    try {
      const drawing = await canvasRef.current.exportImage("png");

      // Create a new canvas for combining background and drawing
      const combinedCanvas = document.createElement("canvas");
      combinedCanvas.width = canvasSize.width;
      combinedCanvas.height = canvasSize.height;
      const ctx = combinedCanvas.getContext("2d");

      // Draw the background
      const bg = new Image();
      bg.src = bgImage;
      bg.onload = () => {
        ctx.drawImage(bg, 0, 0, canvasSize.width, canvasSize.height);

        // Draw the drawing on top
        const drawingImage = new Image();
        drawingImage.src = drawing;
        drawingImage.onload = () => {
          ctx.drawImage(
            drawingImage,
            0,
            0,
            canvasSize.width,
            canvasSize.height
          );

          // Export combined image as data URL
          const combinedImage = combinedCanvas.toDataURL("image/png");
          onSave(combinedImage);
        };
      };
    } catch (error) {
      console.error("Error saving canvas:", error);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="bg-white w-[600px] h-fit flex flex-col items-center rounded-xl">
        <div className="w-full flex justify-between items-center p-4 mb-4 rounded-t-xl bg-bg-sb border border-b-f-gray">
          <div className="flex gap-4 items-center">
            <button
              className="bg-slate-300 h-8 w-8 rounded-full flex items-center justify-center text-c-primary"
              onClick={() => canvasRef.current.undo()}
            >
              <FaUndo />
            </button>
            <button
              className="bg-slate-300 h-8 w-8 rounded-full flex items-center justify-center text-c-primary"
              onClick={() => canvasRef.current.redo()}
            >
              <FaRedo />
            </button>
            <button
              onClick={() => canvasRef.current.clearCanvas()}
              className="px-4 py-1 text-f-dark text-p-sm md:text-p-rg font-medium rounded-md border border-c-gray3"
            >
              Clear
            </button>
          </div>
          <button
            className="bg-slate-300 h-8 w-8 rounded-full flex items-center justify-center text-c-primary"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <ReactSketchCanvas
          ref={canvasRef}
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }}
          canvasColor="transparent"
          strokeWidth={5}
          strokeColor="#26282A"
          backgroundImage={bgImage}
        />

        <div className="p-4 mt-4 flex justify-end gap-4 w-full border border-t-f-gray">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-c-secondary text-f-light text-p-sm md:text-p-rg font-semibold rounded-md hover:bg-opacity-75"
          >
            Save Sketch
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EyeSketch;
