import { useEffect } from 'react';
import css from './Modal.module.css';

const Modal = ({ largeImageURL, tags, onClose }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayClick = event => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={css['modal-overlay']} onClick={handleOverlayClick}>
      <div className={css['modal-content']}>
        <img className={css['modal-img']} src={largeImageURL} alt={tags} />
      </div>
    </div>
  );
};

export default Modal;
