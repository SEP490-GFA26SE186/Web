import { useState } from "react";
import { Loader2, Save, SlidersHorizontal } from "lucide-react";
import { useReportSettings, useUpdateReportSettings } from "../../hooks/usePedagogy";
import { toast } from "../../stores/toastStore";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

// Ngưỡng lưu dạng tỉ lệ 0..1, Specialist nhập theo % cho dễ đọc (phụ huynh không thấy %)
const toForm = (s) => ({
  window: String(s.window),
  minItems: String(s.minItems),
  developingFrom: String(Math.round(s.developingFrom * 100)),
  secureFrom: String(Math.round(s.secureFrom * 100)),
});

// Khớp pedagogy-settings.validation.js của BE
const validate = (f) => {
  const window = Number(f.window);
  const minItems = Number(f.minItems);
  const dev = Number(f.developingFrom);
  const sec = Number(f.secureFrom);
  if (!Number.isInteger(window) || window < 1 || window > 20) return "Số câu xét là số nguyên từ 1 đến 20";
  if (!Number.isInteger(minItems) || minItems < 1) return "Số câu tối thiểu là số nguyên từ 1";
  if (minItems > window) return "Số câu tối thiểu không được lớn hơn số câu xét";
  if (!Number.isFinite(dev) || dev <= 0) return "Ngưỡng “Đang phát triển” phải lớn hơn 0%";
  if (!Number.isFinite(sec) || sec > 100) return "Ngưỡng “Vững” tối đa là 100%";
  if (!(dev < sec)) return "Ngưỡng “Vững” phải lớn hơn ngưỡng “Đang phát triển”";
  return "";
};

function SettingsForm({ settings }) {
  const [form, setForm] = useState(() => toForm(settings));
  const [error, setError] = useState("");
  const update = useUpdateReportSettings();

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    const message = validate(form);
    if (message) return setError(message);
    update.mutate(
      {
        window: Number(form.window),
        minItems: Number(form.minItems),
        developingFrom: Number(form.developingFrom) / 100,
        secureFrom: Number(form.secureFrom) / 100,
      },
      {
        onSuccess: () => toast.success("Đã lưu tham số báo cáo EQ"),
        onError: (err) => setError(err.message),
      },
    );
  };

  const dev = Number(form.developingFrom);
  const sec = Number(form.secureFrom);

  return (
    <form onSubmit={submit} noValidate className="card max-w-3xl space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Số câu gần nhất được xét</span>
          <input type="number" min={1} max={20} value={form.window} onChange={set("window")} className={inputClass} />
          <span className="mt-1 block text-xs text-navy/55">Mức của mỗi kỹ năng con tính trên chừng này câu chấm gần nhất (1–20).</span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Số câu tối thiểu để xếp mức</span>
          <input type="number" min={1} max={20} value={form.minItems} onChange={set("minItems")} className={inputClass} />
          <span className="mt-1 block text-xs text-navy/55">Ít hơn → phụ huynh thấy “Chưa có dữ liệu”.</span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">“Đang phát triển” từ (%)</span>
          <input type="number" min={1} max={99} value={form.developingFrom} onChange={set("developingFrom")} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">“Vững” từ (%)</span>
          <input type="number" min={2} max={100} value={form.secureFrom} onChange={set("secureFrom")} className={inputClass} />
        </label>
      </div>

      {Number.isFinite(dev) && Number.isFinite(sec) && dev < sec && (
        <p className="rounded-2xl bg-surface px-4 py-3 text-sm text-navy/75">
          Điểm trung bình dưới {dev}% → <span className="font-bold">Đang làm quen</span>; từ {dev}% đến dưới {sec}% →{" "}
          <span className="font-bold">Đang phát triển</span>; từ {sec}% → <span className="font-bold">Vững</span>.
        </p>
      )}
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <div className="flex justify-end">
        <button type="submit" disabled={update.isPending} className="btn-primary py-2.5 text-sm disabled:opacity-70">
          {update.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu tham số
        </button>
      </div>
    </form>
  );
}

// Tham số báo cáo EQ (spec sư phạm CASEL §7): cửa sổ câu, số câu tối thiểu, ngưỡng 3 mức. Áp dụng ngay cho mọi báo cáo.
function ReportSettingsPage() {
  const { data, isLoading, isError, error, refetch } = useReportSettings();

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
          <SlidersHorizontal size={16} /> Chương trình sư phạm
        </p>
        <h1 className="text-3xl">Tham số báo cáo</h1>
        <p className="mt-1 max-w-2xl text-navy/70">
          Quy tắc xếp mức “Đang làm quen / Đang phát triển / Vững” cho từng kỹ năng con trong báo cáo EQ của phụ huynh. Đổi tham số áp dụng ngay cho mọi báo cáo.
        </p>
      </div>
      {isLoading ? (
        <div className="card h-64 max-w-3xl animate-pulse" />
      ) : isError ? (
        <div className="card max-w-3xl p-8 text-center">
          <p className="font-display font-bold">Không tải được tham số</p>
          <p className="mt-1 text-sm text-navy/60">{error.message}</p>
          <button onClick={() => refetch()} className="btn-primary mt-4">
            Thử lại
          </button>
        </div>
      ) : (
        <SettingsForm key={JSON.stringify(data)} settings={data} />
      )}
    </div>
  );
}

export default ReportSettingsPage;
