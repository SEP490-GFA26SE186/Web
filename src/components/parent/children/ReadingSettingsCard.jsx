import { useState } from "react";
import { Loader2, Mic } from "lucide-react";
import { VOICES } from "../../../constants/voices";
import { useUpdateChild } from "../../../hooks/useChildProfile";
import { toast } from "../../../stores/toastStore";
import SectionCard from "./SectionCard";
import { Select } from "../../ui";


/** Giọng đọc mặc định của bé (child_profiles). Rev8 bỏ giới hạn thời gian đọc / giờ ngủ. */
function ReadingSettingsCard({ child }) {
  const saved = { preferredVoice: child.preferredVoice ?? "" };
  const [form, setForm] = useState(saved);
  const update = useUpdateChild(child.id);
  const dirty = form.preferredVoice !== saved.preferredVoice;

  const save = () =>
    update.mutate(
      { preferredVoice: form.preferredVoice || null },
      {
        onSuccess: () => toast.success(`Đã lưu cài đặt cho ${child.name} ✨`),
        onError: (err) => toast.error(err.message),
      },
    );

  return (
    <SectionCard icon={Mic} tone="teal" title="Giọng đọc" subtitle="Áp dụng khi bé nghe truyện trong Chế độ Trẻ Em">
      <div className="space-y-4">
        <label className="block rounded-2xl bg-surface p-4">
          <span className="mb-2 flex items-center gap-1.5 text-sm font-bold">
            <Mic size={17} className="text-secondary" /> Giọng đọc truyện
          </span>
          <Select
            value={form.preferredVoice}
            onChange={(v) => setForm((f) => ({ ...f, preferredVoice: v }))}
            options={[{ value: "", label: "Giọng mặc định" }, ...VOICES]}
          />
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
