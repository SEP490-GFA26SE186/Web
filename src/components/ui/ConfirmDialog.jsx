import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

/**
 * Hộp xác nhận hành động (xoá, ngưng dùng…): tiêu đề, mô tả, hai nút canh phải. Không icon, không kẻ ngang;
 * mức độ nghiêm trọng thể hiện qua màu nút xác nhận.
 * tone: danger (mặc định, nút đỏ) | warning (nút cam) • children: nội dung phụ (vd. lỗi từ server) dưới mô tả.
 * Esc / bấm nền để huỷ (khi không đang xử lý); focus mặc định vào nút Huỷ để Enter không vô tình xoá.
 */
function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Xoá", cancelLabel = "Huỷ", tone = "danger", loading = false, children }) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && !loading && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => cancelRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, loading]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 animate-fade-in bg-navy/40 backdrop-blur-sm" onClick={() => !loading && onClose()} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="relative w-full max-w-md animate-dialog-in rounded-stage bg-white p-6 shadow-high sm:p-7"
      >
        <h2 id={titleId} className="text-xl leading-snug text-pretty">
          {title}
        </h2>
        {description && (
          <p id={descId} className="mt-2.5 text-[15px] leading-relaxed text-pretty text-navy/65">
            {description}
          </p>
        )}
        {children && <div className="mt-4">{children}</div>}

        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} variant="ghost" onClick={onClose} disabled={loading} size="lg">
            {cancelLabel}
          </Button>
          <Button variant={tone === "warning" ? "primary" : "danger"} onClick={onConfirm} loading={loading} size="lg">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ConfirmDialog;
