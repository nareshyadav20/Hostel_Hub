import React from 'react';
import './ImageModal.css';

const ImageModal = ({ isOpen, image, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="img-modal-overlay" onClick={onClose}>
      <div className="img-modal-content" onClick={e => e.stopPropagation()}>
        <button className="img-modal-close" onClick={onClose}>✕</button>
        <img src={image} alt="Full view" className="img-modal-view" />
      </div>
    </div>
  );
};

export default ImageModal;
