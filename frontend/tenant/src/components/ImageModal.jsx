import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ImageModal.css';

const ImageModal = ({ isOpen, image, onClose }) => {
  useEffect(() => {
    const scrollContainer = document.querySelector('.content-wrapper') || document.body;
    if (isOpen) {
      scrollContainer.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      scrollContainer.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      scrollContainer.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="img-modal-overlay" onClick={onClose}>
      <div className="img-modal-content" onClick={e => e.stopPropagation()}>
        <button className="img-modal-close" onClick={onClose}>✕</button>
        <img src={image} alt="Full view" className="img-modal-view" />
      </div>
    </div>,
    document.body
  );
};

export default ImageModal;
