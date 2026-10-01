import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import "./Popupps.css";

/**
 * Shared shell for every popup: portal, backdrop click, Esc, scroll lock,
 * focus handling. Becomes a bottom sheet on phones (see Popups.css).
 */
const Modal = ({ open, onClose, labelledBy, children }) => {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e) => e.key === "Escape" && closeRef.current?.();
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="pp-overlay"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && closeRef.current?.()}
    >
      <div
        ref={dialogRef}
        className="pp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        <button type="button" className="pp-close" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;