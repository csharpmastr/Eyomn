import React, { useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import OD from "../../assets/Image/OD.png";
import OS from "../../assets/Image/OS.png";
import CROSS from "../../assets/Image/CROSS.png";
import BLANK from "../../assets/Image/BLANK.png";
import FRONT from "../../assets/Image/FRONT.png";
import ReactDOM from "react-dom";
import { FaUndo, FaRedo } from "react-icons/fa";

const EyeSketch = ({ onClose, onSave, backgroundImage }) => {
  const canvasRef = useRef(null);

  const getBackgroundImage = () => {
    switch (backgroundImage) {
      case "OD":
        return OD;
      case "OS":
        return OS;
      case "CROSS":
        return CROSS;
      case "BLANK":
        return BLANK;
      case "FRONT":
        return FRONT;
      default:
        return null;
    }
  };

  const handleSave = async () => {
    try {
      const drawing = await canvasRef.current.exportImage("png");

      // Create a new HTML canvas to combine background and drawing
      const combinedCanvas = document.createElement("canvas");
      combinedCanvas.width = 500;
      combinedCanvas.height = 500;

      const ctx = combinedCanvas.getContext("2d");

      // Create an image element for the background
      const backgroundImage = new Image();
      backgroundImage.src = getBackgroundImage();

      backgroundImage.onload = () => {
        // Draw the background image first
        ctx.drawImage(backgroundImage, 0, 0, 500, 500);

        // Create an image element for the drawing
        const drawingImage = new Image();
        drawingImage.src = drawing;

        drawingImage.onload = () => {
          // Draw the drawing image on top of the background
          ctx.drawImage(drawingImage, 0, 0, 500, 500);

          // Export the combined image as a data URL (png)
          const combinedImage = combinedCanvas.toDataURL("image/png");

          // Pass the combined image to the onSave callback
          onSave(combinedImage);
        };
        drawingImage.onerror = (error) => {
          console.error("Error loading drawing image:", error);
        };
      };
      backgroundImage.onerror = (error) => {
        console.error("Error loading background image:", error);
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
              onClick={() => {
                canvasRef.current.undo();
              }}
            >
              <FaUndo />
            </button>
            <button
              className="bg-slate-300 h-8 w-8 rounded-full flex items-center justify-center text-c-primary"
              onClick={() => {
                canvasRef.current.redo();
              }}
            >
              <FaRedo />
            </button>
            <button
              onClick={() => {
                canvasRef.current.clearCanvas();
              }}
              className="px-4 py-1 text-f-dark text-p-rg font-medium rounded-md border border-c-gray3"
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
            width: "500px",
            height: "500px",
          }}
          strokeWidth={5}
          strokeColor="#26282A"
          backgroundImage={getBackgroundImage()}
        />
        <div className="p-4 mt-4 flex justify-end gap-4 w-full border border-t-f-gray">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md"
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
