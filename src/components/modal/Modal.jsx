import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, children, showClose = true, backdropClose = true }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // prevent background scroll
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && backdropClose) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[999] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-8 max-w-[600px] w-full relative shadow-xl">
        {showClose && (
          <button 
            className="absolute top-3 right-3 text-2xl bg-transparent border-none cursor-pointer text-gray-700 hover:text-gray-900"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;