import React from 'react';
import ReactDOM from 'react-dom';

const SuccessModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md mx-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-lg font-bold">Success</h2>
        </div>
        <div className="text-green-600 mb-4">
          {message}
        </div>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-3xl p-2 rounded-full"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
};

export default SuccessModal;
