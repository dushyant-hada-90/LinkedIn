import { createPortal } from "react-dom";
import { useEffect } from "react";

function Popover({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = () => onClose();
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div onClick={(e) => e.stopPropagation()}>
      {children}
    </div>,
    document.body
  );
}

export default Popover;
