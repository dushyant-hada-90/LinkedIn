import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, children, className = '', overlay = true }) {
  const modalRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {overlay && (
        <div className="fixed inset-0 bg-black/50 z-40" />
      )}

      <div
        ref={modalRef}
        className={` ${className}`}
      >
        {children}
      </div>
    </>
  );
}

// usage
// <Modal isOpen={showPopup} onClose={() => setShowPopup(false)}>
//   <CreatePostCard />
// </Modal>
