// components/Modal.js
import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center md:p-4">
      <div className="bg-white w-full h-full md:w-full md:max-w-[65%] md:h-auto md:rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 z-10"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="pb-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;