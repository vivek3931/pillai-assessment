import React from 'react';

const Modal = ({ isOpen, title, message, type = 'alert', onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card-flat bg-canvas w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-heading-md mb-2">{title}</h3>
        <p className="text-body-md text-body mb-8">{message}</p>
        
        <div className="flex justify-end gap-3">
          {type === 'confirm' && (
            <button 
              onClick={onClose} 
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={() => {
              if (onConfirm) onConfirm();
              else onClose();
            }} 
            className="btn-primary"
          >
            {type === 'confirm' ? 'Confirm' : 'Okay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
