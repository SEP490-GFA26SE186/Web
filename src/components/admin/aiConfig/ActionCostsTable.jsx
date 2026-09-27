import { useState } from "react";
import { AlertTriangle, BadgeCheck, Brain, Brush, ChevronDown, Coins, Download, PenLine, Pencil, RotateCcw, ScanFace, Mic } from "lucide-react";
import Modal from "../../common/Modal";
import Switch from "../../common/Switch";
import { CREDIT_RATE_VND } from "../../../mocks/admin";
import { downloadCsv, formatNumber, formatPercent } from "../../../utils/format";
import { apiCostVnd, grossMargin, priceVnd } from "./pricing";

const ICONS = { brain: Brain, edit: PenLine, face: ScanFace, brush: Brush, replay: RotateCcw, voice: Mic };
const ICON_TONES = { primary: "bg-primary-tint text-primary-dark", secondary: "bg-secondary-tint text-secondary-dark", navy: "bg-navy-tint text-navy-soft" };
const PROVIDER_DOTS = { OpenAI: "bg-secondary", Anthropic: "bg-primary", Replicate: "bg-navy-soft", "AWS Bedrock": "bg-primary", ElevenLabs: "bg-secondary" };

const CATEGORIES = [
  { value: "all", label: "Tất cả tác vụ" },
  { value: "llm", label: "Nội dung cốt truyện (LLM)" },
  { value: "image", label: "Vẽ tranh minh họa (Image Diffusion)" },
  { value: "tts", label: "Giọng đọc dẫn chuyện (TTS)" },
];

const MIN_MARGIN = 50; // cảnh báo khi biên lãi dưới 50%

function MarginBadge({ value }) {
  const low = value < MIN_MARGIN;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${low ? "bg-danger-tint text-danger-dark" : "bg-secondary-tint text-secondary-dark"}`}>
      {low && <AlertTriangle size={12} />}
      {value >= 0 ? "+" : ""}
      {formatPercent(value)}
    </span>
  );
}

function EditActionModal({ action, onClose, onSave }) {
  const [credits, setCredits] = useState(action.credits);
  const [model, setModel] = useState(action.model);
  const margin = grossMargin(action, credits);
  const invalid = !Number.isInteger(credits) || credits < 1 || credits > 100 || !model.trim();

  return (
    <Modal
      open
      onClose={onClose}
      title="Tùy chỉnh tác vụ AI"
      description={action.name}
      footer={
        <>
          <button onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button
            disabled={invalid}
            onClick={() => onSave({ credits, model: model.trim() })}
            className="rounded-full bg-primary-dark px-5 py-2.5 text-sm font-bold text-white hover:bg-primary disabled:opacity-50"
          >
            Áp dụng
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Mô hình đang gán</span>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-2xl border-[1.5px] border-outline px-4 py-2.5 outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/15"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Giá trừ phụ huynh (Credits)</span>
          <input
            type="number"
            min={1}
            max={100}
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
            className="w-full rounded-2xl border-[1.5px] border-outline px-4 py-2.5 font-display text-lg font-bold outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/15"
          />
        </label>
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface p-3 text-center text-sm">
          <div>
            <p className="text-xs text-navy/60">Chi phí API gốc</p>
            <p className="font-bold">{formatNumber(apiCostVnd(action))}đ</p>
          </div>
          <div>
            <p className="text-xs text-navy/60">Giá bán</p>
            <p className="font-bold">{invalid ? "—" : `${formatNumber(priceVnd(credits))}đ`}</p>
          </div>
          <div>
            <p className="text-xs text-navy/60">Biên lãi gộp</p>
            <p className="pt-0.5">{invalid ? "—" : <MarginBadge value={margin} />}</p>
          </div>
        </div>
        {!invalid && margin < MIN_MARGIN && (
          <p className="flex items-start gap-1.5 rounded-xl bg-danger-tint/60 p-3 text-xs font-semibold text-danger-dark">
            <AlertTriangle size={15} className="shrink-0" /> Biên lãi thấp hơn ngưỡng khuyến nghị {MIN_MARGIN}%. Cân nhắc trợ giá có chủ đích.
          </p>
        )}
      </div>
    </Modal>
  );
}

function ActionCostsTable({ actions, onChangeAction }) {
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState(null);
  const visible = actions.filter((a) => category === "all" || a.category === category);

  const exportCsv = () =>
    downloadCsv("storyweaver-bang-gia-tin-chi.csv", [
      ["Tác vụ", "Mô hình", "Nhà cung cấp", "Chi phí API (USD)", "Chi phí API (VND)", "Credits", "Giá bán (VND)", "Biên lãi gộp (%)", "Trạng thái"],
      ...actions.map((a) => [a.name, a.model, a.provider, a.apiCostUsd, apiCostVnd(a), a.credits, priceVnd(a.credits), grossMargin(a).toFixed(1), a.enabled ? "Bật" : "Tắt"]),
    ]);

  return (
    <section id="section-actions" className="flex scroll-mt-24 flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="flex items-center gap-3 text-lg">
          <span className="h-6 w-3 rounded-full bg-primary-dark" />
          Bảng Cấu hình Chi phí Tín chỉ trên từng Tác vụ AI
        </h2>
        <label className="flex items-center gap-2 text-sm text-navy/60">
          Lọc theo phân loại:
          <span className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="cursor-pointer appearance-none rounded-full bg-white py-1.5 pr-8 pl-4 text-xs font-bold text-navy shadow-low outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.value === "all" ? `${c.label} (${actions.length})` : c.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-navy" />
          </span>
        </label>
      </div>

      <div className="overflow-hidden rounded-stage bg-white shadow-mid">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
            <thead className="bg-surface text-[11px] font-bold tracking-wider text-navy/60 uppercase">
              <tr>
                <th className="px-6 py-4">Tác vụ người dùng (AI Action)</th>
                <th className="px-4 py-4">Mô hình đang gán</th>
                <th className="px-4 py-4">Nhà cung cấp</th>
                <th className="px-4 py-4">Chi phí API gốc</th>
                <th className="px-4 py-4">Giá trừ Phụ huynh</th>
                <th className="px-4 py-4">Biên lãi gộp</th>
                <th className="px-4 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Tùy chỉnh</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a, i) => {
                const Icon = ICONS[a.icon];
                return (
                  <tr key={a.id} className={`transition hover:bg-surface/70 ${i % 2 ? "bg-surface/30" : ""} ${a.enabled ? "" : "opacity-55"}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${ICON_TONES[a.tone]}`}>
                          <Icon size={17} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{a.name}</p>
                          <p className="text-sm text-navy/60">{a.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold">{a.model}</p>
                      <p className="text-sm text-navy/60">{a.modelNote}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold whitespace-nowrap">
                        <span className={`h-2 w-2 rounded-full ${PROVIDER_DOTS[a.provider] ?? "bg-navy-soft"}`} /> {a.provider}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-bold">~{a.apiCostUsd.toFixed(3)}$</p>
                      <p className="text-sm whitespace-nowrap text-navy/60">
                        (~{formatNumber(apiCostVnd(a))}đ / {a.unit})
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-tint px-2.5 py-1 whitespace-nowrap">
                        <Coins size={15} className="text-primary" />
                        <b className="text-sm text-primary-dark">
                          {a.credits} {a.credits > 1 ? "Credits" : "Credit"}
                        </b>
                        <span className="text-xs text-navy/60">({formatNumber(priceVnd(a.credits))}đ)</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <MarginBadge value={grossMargin(a)} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Switch checked={a.enabled} onChange={(enabled) => onChangeAction(a.id, { enabled })} label={`Bật/tắt ${a.name}`} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setEditing(a)}
                        aria-label={`Tùy chỉnh ${a.name}`}
                        className="rounded-full p-2 text-navy/60 transition hover:bg-surface hover:text-primary-dark"
                      >
                        <Pencil size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col justify-between gap-2 bg-surface px-6 py-4 text-sm text-navy/65 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2">
            <BadgeCheck size={18} className="shrink-0 text-secondary" />
            Tỷ giá 1 Credit = {formatNumber(CREDIT_RATE_VND)}đ. Thay đổi giá tín chỉ cập nhật ngay trên ứng dụng Phụ huynh sau khi lưu.
          </span>
          <button onClick={exportCsv} className="flex shrink-0 items-center gap-1 font-bold text-primary-dark hover:underline">
            Xuất báo cáo định giá CSV <Download size={16} />
          </button>
        </div>
      </div>

      {editing && (
        <EditActionModal
          action={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            onChangeAction(editing.id, patch);
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

export default ActionCostsTable;
