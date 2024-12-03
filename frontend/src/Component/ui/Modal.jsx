// Modal Component
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
  icon,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-zinc-800 bg-opacity-50 flex items-center justify-center z-50 ${overlayClassName} font-Poppins`}
    >
      <div
        className={`bg-f-light rounded-lg shadow-lg w-full max-w-md ${className}`}
      >
        <header className="flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button className="text-f-dark text-3xl" onClick={onClose}>
            &times;
          </button>
        </header>
        <div className=" flex flex-col items-center justify-center p-4">
          {icon}
          {description && (
            <p
              className={`text-c-gray3 text-p-rg ${overlayDescriptionClassName}`}
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
