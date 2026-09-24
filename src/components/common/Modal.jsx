import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function Modal({ open, onClose, title, description, children, footer, size = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative flex max-h-[90vh] w-full flex-col rounded-t-stage bg-white shadow-high sm:rounded-stage ${size}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline px-6 pt-6 pb-4">
          <div>
            <h2 id="modal-title" className="text-xl">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-navy/60">{description}</p>}
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-surface" aria-label="Đóng">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-outline px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
