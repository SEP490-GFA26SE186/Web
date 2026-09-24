import { useState } from "react";
import { BadgeCheck, Bot, Check, ChevronDown, Gauge, Mic, PlayCircle, Smile, Square } from "lucide-react";
import Modal from "../../common/Modal";
import { COMPANIONS, SPEEDS, TONES, VOICES } from "../../../mocks/childProfiles";
import SectionCard from "./SectionCard";

function InlineSelect({ value, onChange, options, className = "" }) {
  return (
    <span className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`cursor-pointer appearance-none rounded-full bg-transparent py-1 pr-6 pl-2 text-right text-sm font-bold outline-none hover:bg-white focus:ring-2 focus:ring-secondary/30 ${className}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-1" />
    </span>
  );
}

function CompanionCard({ companion, onChange, childName }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const current = COMPANIONS.find((c) => c.id === companion.id) ?? COMPANIONS[0];
  const canPreview = typeof window !== "undefined" && "speechSynthesis" in window;

  // Nghe thử tốc độ đọc bằng giọng đọc của trình duyệt (chỉ để minh họa khi chưa có TTS từ BE)
  const togglePreview = () => {
    const synth = window.speechSynthesis;
    if (previewing) {
      synth.cancel();
      setPreviewing(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(
      `Xin chào ${childName}! Tớ là ${current.name}. Tối nay mình cùng nghe một câu chuyện thật hay nhé.`,
    );
    utter.lang = "vi-VN";
    utter.rate = companion.speed;
    utter.onend = utter.onerror = () => setPreviewing(false);
    synth.cancel();
    synth.speak(utter);
    setPreviewing(true);
  };

  return (
    <SectionCard
      icon={Bot}
      title="Bạn AI Đồng Hành"
      subtitle="Người bạn trò chuyện & dẫn dắt câu chuyện"
      action={
        <button onClick={() => setPickerOpen(true)} className="shrink-0 text-sm font-bold text-primary-dark hover:underline">
          Đổi bạn
        </button>
      }
    >
      <div className="mb-4 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-primary-tint to-surface p-4">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white text-5xl shadow-low">
          {current.emoji}
        </span>
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-lg">{current.name}</h4>
            <BadgeCheck size={18} className="fill-primary text-white" />
          </div>
          <p className="text-sm text-navy/65">{current.description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface p-3">
          <span className="flex items-center gap-2.5 text-sm font-semibold">
            <Mic size={19} className="text-secondary" /> Giọng đọc
          </span>
          <InlineSelect
            value={companion.voice}
            onChange={(voice) => onChange({ voice })}
            options={VOICES}
            className="text-secondary-dark"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface p-3">
          <span className="flex items-center gap-2.5 text-sm font-semibold">
            <Gauge size={19} className="text-primary" /> Tốc độ đọc
          </span>
          <span className="flex items-center gap-1">
            <InlineSelect
              value={companion.speed}
              onChange={(v) => onChange({ speed: Number(v) })}
              options={SPEEDS}
              className="text-navy/70"
            />
            {canPreview && (
              <button
                onClick={togglePreview}
                aria-label={previewing ? "Dừng nghe thử" : "Nghe thử"}
                className="rounded-full p-1 text-primary transition hover:bg-white"
              >
                {previewing ? <Square size={18} className="fill-primary" /> : <PlayCircle size={20} />}
              </button>
            )}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface p-3">
          <span className="flex items-center gap-2.5 text-sm font-semibold">
            <Smile size={19} className="text-navy-soft" /> Ngữ điệu
          </span>
          <InlineSelect value={companion.tone} onChange={(tone) => onChange({ tone })} options={TONES} className="text-navy/70" />
        </div>
      </div>

      <Modal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Chọn bạn AI đồng hành"
        description={`Người bạn sẽ dẫn dắt ${childName} trong mọi câu chuyện`}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {COMPANIONS.map((c) => {
            const selected = c.id === current.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  onChange({ id: c.id });
                  setPickerOpen(false);
                }}
                className={`relative flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition ${
                  selected ? "border-primary bg-primary-tint shadow-glow" : "border-outline bg-surface hover:border-primary/50"
                }`}
              >
                {selected && (
                  <span className="absolute top-3 right-3 grid h-6 w-6 place-items-center rounded-full bg-primary text-white">
                    <Check size={14} />
                  </span>
                )}
                <span className="text-4xl">{c.emoji}</span>
                <span className="font-display font-bold">{c.name}</span>
                <span className="text-xs text-navy/65">{c.description}</span>
              </button>
            );
          })}
        </div>
      </Modal>
    </SectionCard>
  );
}

export default CompanionCard;
