import { useState } from "react";
import { Hourglass, Loader2, Mic, Timer } from "lucide-react";
import { VOICES } from "../../../constants/voices";
import { useUpdateChild } from "../../../hooks/useChildProfile";
import { toast } from "../../../stores/toastStore";
import SectionCard from "./SectionCard";

// BE cho phép 5–300 phút; thanh trượt giới hạn trong khoảng hợp lý cho trẻ 5–8 tuổi
const MIN_MINUTES = 5;
const MAX_MINUTES = 120;

const selectClass =
  "w-full cursor-pointer rounded-2xl border-[1.5px] border-outline bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

/** Giới hạn thời gian dùng mỗi ngày + giọng đọc mặc định của bé (child_profiles) */
function ReadingSettingsCard({ child }) {
  const saved = { dailyScreenTimeMinutes: child.dailyScreenTimeMinutes, preferredVoice: child.preferredVoice ?? "" };
  const [form, setForm] = useState(saved);
  const update = useUpdateChild(child.id);
  const dirty = form.dailyScreenTimeMinutes !== saved.dailyScreenTimeMinutes || form.preferredVoice !== saved.preferredVoice;
  const percent = ((form.dailyScreenTimeMinutes - MIN_MINUTES) / (MAX_MINUTES - MIN_MINUTES)) * 100;

  const save = () =>
    update.mutate(
      { dailyScreenTimeMinutes: form.dailyScreenTimeMinutes, preferredVoice: form.preferredVoice || null },
      {
        onSuccess: () => toast.success(`Đã lưu cài đặt cho ${child.name} ✨`),
        onError: (err) => toast.error(err.message),
      },
    );

  return (
    <SectionCard icon={Hourglass} tone="teal" title="Thời gian đọc & Giọng đọc" subtitle="Áp dụng khi bé dùng Chế độ Trẻ Em">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="daily-minutes" className="flex items-center gap-1.5 text-sm font-bold">
              <Timer size={17} className="text-primary" /> Giới hạn mỗi ngày
            </label>
            <span className="font-display text-lg font-bold text-primary-dark">{form.dailyScreenTimeMinutes} phút</span>
          </div>
          <input
            id="daily-minutes"
            type="range"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            step={5}
            value={form.dailyScreenTimeMinutes}
            onChange={(e) => setForm((f) => ({ ...f, dailyScreenTimeMinutes: Number(e.target.value) }))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full accent-primary"
            style={{ background: `linear-gradient(to right, #ff7a00 ${percent}%, #f1e8dc ${percent}%)` }}
          />
          <div className="flex justify-between text-xs text-navy/60">
            <span>{MIN_MINUTES} phút</span>
            <span>30 phút (Khuyên dùng)</span>
            <span>{MAX_MINUTES} phút</span>
          </div>
          <p className="text-xs text-navy/60">Kid Mode tự dừng khi bé dùng hết số phút trong ngày.</p>
        </div>

        <label className="block rounded-2xl bg-surface p-4">
          <span className="mb-2 flex items-center gap-1.5 text-sm font-bold">
            <Mic size={17} className="text-secondary" /> Giọng đọc truyện
          </span>
          <select
            value={form.preferredVoice}
            onChange={(e) => setForm((f) => ({ ...f, preferredVoice: e.target.value }))}
            className={selectClass}
          >
            <option value="">Giọng mặc định</option>
            {VOICES.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
          <span className="mt-1.5 block text-xs text-navy/60">Dùng cho truyện có bật giọng đọc (AI đọc bằng tiếng Việt)</span>
        </label>

        <div className="flex justify-end gap-2">
          {dirty && (
            <button onClick={() => setForm(saved)} className="rounded-full px-4 py-2.5 text-sm font-semibold text-navy/60 hover:bg-surface">
              Hoàn tác
            </button>
          )}
          <button
            disabled={!dirty || update.isPending}
            onClick={save}
            className="btn-primary py-2.5 text-sm disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
          >
            {update.isPending && <Loader2 size={16} className="animate-spin" />} Lưu cài đặt
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

export default ReadingSettingsCard;
