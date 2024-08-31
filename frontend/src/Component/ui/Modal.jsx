import React from "react";
import ReactDOM from "react-dom";

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  className,
  overlayClassName,
  overlayDescriptionClassName,
  overlayDivDesc,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${overlayClassName}`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md mx-4 ${className}`}
      >
        {title && (
          <div className="border-b pb-2 mb-4">
            <h2 className="text-lg font-bold font-Poppins">{title}</h2>
          </div>
        )}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-3xl p-2 rounded-full"
          onClick={onClose}
        >
          &times;
        </button>
        <div className={overlayDivDesc}>
          {description && (
            <p
              className={`text-gray-600 mb-4 p-2 ${overlayDescriptionClassName}`}
            >
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
