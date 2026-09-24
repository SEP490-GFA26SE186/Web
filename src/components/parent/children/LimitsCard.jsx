import { useState } from "react";
import { Hourglass, Loader2, Lock, Moon, Pencil, Timer } from "lucide-react";
import Modal from "../../common/Modal";
import Switch from "../../common/Switch";
import { useUpdatePin } from "../../../hooks/useChildProfile";
import SectionCard from "./SectionCard";

const pinInputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-3 text-center font-display text-2xl tracking-[0.6em] outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

function PinModal({ open, onClose, childId, onSaved }) {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const updatePin = useUpdatePin(childId);

  const close = () => {
    setPin("");
    setConfirm("");
    setError("");
    onClose();
  };

  const submit = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) return setError("Mã PIN phải gồm đúng 4 chữ số");
    if (pin !== confirm) return setError("Hai mã PIN chưa khớp nhau");
    updatePin.mutate(pin, {
      onSuccess: () => {
        onSaved();
        close();
      },
      onError: (err) => setError(err.message),
    });
  };

  const onlyDigits = (setter) => (e) => {
    setter(e.target.value.replace(/\D/g, "").slice(0, 4));
    setError("");
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Đổi mã PIN phụ huynh"
      description="Mã PIN dùng để thoát chế độ trẻ em và mở phần cài đặt"
      size="max-w-sm"
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Mã PIN mới</span>
          <input type="password" inputMode="numeric" autoFocus value={pin} onChange={onlyDigits(setPin)} className={pinInputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Nhập lại mã PIN</span>
          <input type="password" inputMode="numeric" value={confirm} onChange={onlyDigits(setConfirm)} className={pinInputClass} />
        </label>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <button type="submit" disabled={updatePin.isPending} className="btn-primary w-full disabled:opacity-70">
          {updatePin.isPending && <Loader2 size={18} className="animate-spin" />} Lưu mã PIN
        </button>
      </form>
    </Modal>
  );
}

function LimitsCard({ childId, limits, onChange, onPinSaved }) {
  const [pinOpen, setPinOpen] = useState(false);
  const percent = ((limits.dailyMinutes - 10) / 50) * 100;

  return (
    <SectionCard
      icon={Hourglass}
      tone="teal"
      title="Giới hạn thời gian & Giờ ngủ"
      subtitle="Bảo vệ đôi mắt và xây dựng chu kỳ sinh học lành mạnh"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="daily-minutes" className="flex items-center gap-1.5 text-sm font-bold">
              <Timer size={17} className="text-primary" /> Thời gian tương tác mỗi ngày
            </label>
            <span className="font-display text-lg font-bold text-primary-dark">{limits.dailyMinutes} phút</span>
          </div>
          <input
            id="daily-minutes"
            type="range"
            min={10}
            max={60}
            step={5}
            value={limits.dailyMinutes}
            onChange={(e) => onChange({ dailyMinutes: Number(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-full accent-primary"
            style={{ background: `linear-gradient(to right, #ff7a00 ${percent}%, #f1e8dc ${percent}%)` }}
          />
          <div className="flex justify-between text-xs text-navy/60">
            <span>10 phút</span>
            <span>30 phút (Khuyên dùng)</span>
            <span>60 phút</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface p-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-white p-2 text-primary shadow-low">
              <Moon size={20} />
            </span>
            <div>
              <p className="text-sm font-bold">Chế độ ru ngủ (Bedtime Audio)</p>
              <p className="text-sm text-navy/65">Tự động chuyển âm thanh êm dịu lúc {limits.bedtime} tối</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
            <input
              type="time"
              value={limits.bedtime}
              disabled={!limits.bedtimeEnabled}
              onChange={(e) => onChange({ bedtime: e.target.value })}
              aria-label="Giờ ru ngủ"
              className="rounded-xl border border-outline bg-white px-2 py-1 text-sm font-bold text-secondary-dark outline-none focus:border-secondary disabled:opacity-50"
            />
            <Switch
              checked={limits.bedtimeEnabled}
              onChange={(v) => onChange({ bedtimeEnabled: v })}
              label="Bật chế độ ru ngủ"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface p-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-white p-2 text-navy/60 shadow-low">
              <Lock size={20} />
            </span>
            <div>
              <p className="text-sm font-bold">Khóa an toàn phụ huynh (Mã PIN)</p>
              <p className="text-sm text-navy/65">Yêu cầu xác nhận mã PIN khi thoát chế độ trẻ em</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {limits.pinSet ? (
              <span className="font-display text-lg font-bold tracking-widest text-navy/60">••••</span>
            ) : (
              <span className="text-xs font-bold text-red-600">Chưa đặt</span>
            )}
            <button
              onClick={() => setPinOpen(true)}
              aria-label="Đổi mã PIN"
              className="ml-1 rounded-full p-1.5 text-secondary transition hover:bg-white"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>
      </div>

      <PinModal open={pinOpen} onClose={() => setPinOpen(false)} childId={childId} onSaved={onPinSaved} />
    </SectionCard>
  );
}

export default LimitsCard;
