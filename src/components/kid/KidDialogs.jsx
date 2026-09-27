import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Delete, Loader2, Lock, X } from "lucide-react";
import { useVerifyParentPin } from "../../hooks/useKid";

// Khung hộp thoại to, bo tròn, thân thiện với bé
function KidDialog({ children, onClose, labelledBy }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby={labelledBy} className="relative flex w-full max-w-md flex-col items-center rounded-stage bg-white p-6 text-center shadow-high">
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function ChoiceResultDialog({ childName, feedback, stars, onNext, isLast }) {
  return (
    <KidDialog onClose={onNext} labelledBy="choice-title">
      <span className="mb-4 grid h-20 w-20 animate-bounce place-items-center rounded-full bg-primary-tint text-4xl">🌟</span>
      <span className="text-sm font-bold tracking-wider text-secondary-dark uppercase">Tuyệt vời lắm {childName}!</span>
      <h4 id="choice-title" className="mt-1 text-2xl">
        Con nhận được +{stars} Sao vàng!
      </h4>
      <p className="mt-2 text-navy/70">{feedback}</p>
      <button onClick={onNext} autoFocus className="btn-primary mt-6 w-full py-3.5 font-display text-lg">
        {isLast ? "Xem kết thúc câu chuyện 🎉" : "Xem trang tiếp theo ➡️"}
      </button>
    </KidDialog>
  );
}

export function StoryCompleteDialog({ childName, starsEarned, badge, onReadAgain, onBookshelf }) {
  return (
    <KidDialog onClose={onBookshelf} labelledBy="complete-title">
      <span className="mb-3 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary-tint to-secondary-tint text-5xl shadow-glow">
        {badge.emoji}
      </span>
      <span className="text-sm font-bold tracking-wider text-secondary-dark uppercase">Hoàn thành câu chuyện!</span>
      <h4 id="complete-title" className="mt-1 text-2xl">
        {childName} nhận được {badge.name}
      </h4>
      <p className="mt-2 text-navy/70">
        Hôm nay con đã thu thập <b className="text-primary-dark">{starsEarned} Sao vàng</b> trong truyện này. Ba mẹ sẽ rất tự hào đó!
      </p>
      <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
        <button onClick={onReadAgain} className="flex-1 rounded-full bg-surface px-5 py-3 font-bold transition hover:bg-outline">
          Đọc lại từ đầu
        </button>
        <button onClick={onBookshelf} autoFocus className="btn-primary flex-1 py-3">
          Về Tủ Sách 📚
        </button>
      </div>
    </KidDialog>
  );
}

// Cổng Ba Mẹ: nhập mã PIN 4 số để thoát chế độ trẻ em
export function ParentGateDialog({ onClose, onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const verify = useVerifyParentPin();

  const press = (d) => {
    if (verify.isPending || pin.length >= 4) return;
    const next = pin + d;
    setError(false);
    setPin(next);
    if (next.length === 4) {
      verify.mutate(next, {
        onSuccess: ({ ok }) => {
          if (ok) onUnlock();
          else {
            setError(true);
            setPin("");
          }
        },
        onError: () => {
          setError(true);
          setPin("");
        },
      });
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (/^\d$/.test(e.key)) press(e.key);
      if (e.key === "Backspace") setPin((p) => p.slice(0, -1));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <KidDialog onClose={onClose} labelledBy="gate-title">
      <button onClick={onClose} className="absolute top-4 right-4 rounded-full p-1.5 hover:bg-surface" aria-label="Đóng">
        <X size={20} />
      </button>
      <span className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-navy-tint text-navy-soft">
        <Lock size={26} />
      </span>
      <h4 id="gate-title" className="text-xl">
        Dành cho Ba Mẹ
      </h4>
      <p className="mt-1 text-sm text-navy/60">Nhập mã PIN phụ huynh để thoát Chế độ Trẻ Em</p>

      <div className={`my-5 flex gap-3 ${error ? "animate-[wiggle_0.4s_ease-in-out_2]" : ""}`} aria-live="polite">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className={`h-4 w-4 rounded-full transition ${i < pin.length ? "bg-primary" : error ? "bg-danger/40" : "bg-outline"}`} />
        ))}
      </div>
      <p className="-mt-2 mb-3 h-5 text-sm font-semibold text-danger">{error ? "Mã PIN chưa đúng, thử lại nhé" : ""}</p>

      <div className="grid w-full max-w-64 grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button key={d} onClick={() => press(d)} className="h-14 rounded-2xl bg-surface font-display text-xl font-bold transition hover:bg-outline active:scale-95">
            {d}
          </button>
        ))}
        <span className="grid place-items-center">{verify.isPending && <Loader2 className="animate-spin text-primary" />}</span>
        <button onClick={() => press("0")} className="h-14 rounded-2xl bg-surface font-display text-xl font-bold transition hover:bg-outline active:scale-95">
          0
        </button>
        <button
          onClick={() => setPin((p) => p.slice(0, -1))}
          aria-label="Xóa"
          className="grid h-14 place-items-center rounded-2xl text-navy/60 transition hover:bg-surface active:scale-95"
        >
          <Delete size={22} />
        </button>
      </div>
    </KidDialog>
  );
}
