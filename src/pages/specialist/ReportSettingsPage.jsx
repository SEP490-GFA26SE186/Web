import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button, Card, EmptyState, PageHeader, Skeleton } from "../../components/ui";
import { EQ_LEVELS } from "../../constants/eqLevels";
import { useReportSettings, useUpdateReportSettings } from "../../hooks/usePedagogy";
import { toast } from "../../stores/toastStore";

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

/** Ô số có đơn vị nằm trong ô (câu / %), không mũi tên tăng giảm; chú thích giữ chỗ cố định để các ô thẳng hàng. */
function NumberField({ label, unit, hint, value, onChange, min, max }) {
  return (
    <label className="flex flex-col">
      <span className="mb-1.5 text-sm font-semibold">{label}</span>
      <span className="relative">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="h-11 w-full [appearance:textfield] rounded-2xl border-[1.5px] border-outline bg-white pr-14 pl-4 text-sm font-semibold tabular-nums outline-none transition hover:border-navy/20 focus:border-secondary focus:ring-[3px] focus:ring-secondary/15 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-navy/45">{unit}</span>
      </span>
      <span className="mt-1.5 min-h-8 text-xs leading-4 text-navy/55">{hint}</span>
    </label>
  );
}

function FieldGroup({ title, description, children }) {
  return (
    <fieldset className="space-y-4">
      <div>
        <legend className="font-display text-base font-bold">{title}</legend>
        <p className="mt-0.5 text-sm text-navy/60">{description}</p>
      </div>
      <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

const LEVELS = [
  { key: "emerging", label: "Đang làm quen", color: EQ_LEVELS.emerging.fill },
  { key: "developing", label: "Đang phát triển", color: EQ_LEVELS.developing.fill },
  { key: "secure", label: "Vững", color: EQ_LEVELS.secure.fill },
];

/** Thanh 0–100% chia 3 mức theo ngưỡng đang nhập: thấy ngay quy tắc sẽ áp dụng. */
function LevelPreview({ dev, sec, window: win, minItems, valid }) {
  const widths = valid ? [dev, sec - dev, 100 - sec] : [33.3, 33.3, 33.4];
  const ranges = valid ? [`dưới ${dev}%`, `${dev}% đến dưới ${sec}%`, `từ ${sec}%`] : ["…", "…", "…"];
  return (
    <aside className="card h-fit space-y-5 p-6 xl:sticky xl:top-24">
      <div>
        <h2 className="text-lg">Xem trước quy tắc</h2>
        <p className="mt-0.5 text-sm text-navy/60">Cập nhật theo số đang nhập, chưa lưu.</p>
      </div>
      <div>
        <div className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
          {LEVELS.map((l, i) => (
            <span key={l.key} className="h-full transition-[width] duration-500 ease-(--ease-out-soft)" style={{ width: `${widths[i]}%`, background: l.color }} />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-navy/45 tabular-nums">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
      <ul className="space-y-3">
        {LEVELS.map((l, i) => (
          <li key={l.key} className="flex items-center gap-3">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: l.color }} />
            <span className="flex-1 text-sm font-semibold">{l.label}</span>
            <span className="text-sm text-navy/60 tabular-nums">{ranges[i]}</span>
          </li>
        ))}
      </ul>
      <p className="border-t border-navy/[0.06] pt-4 text-sm leading-relaxed text-navy/65">
        Mỗi kỹ năng con xét <span className="font-bold text-navy">{win || "…"} câu</span> chấm gần nhất. Có ít hơn{" "}
        <span className="font-bold text-navy">{minItems || "…"} câu</span> thì phụ huynh thấy “Chưa có dữ liệu”.
      </p>
    </aside>
  );
}

function SettingsForm({ settings }) {
  const [form, setForm] = useState(() => toForm(settings));
  const [error, setError] = useState("");
  const update = useUpdateReportSettings();
  const dirty = JSON.stringify(form) !== JSON.stringify(toForm(settings));

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
  const valid = !validate(form);

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <form onSubmit={submit} noValidate className="card space-y-7 p-6 md:p-7">
        <FieldGroup title="Dữ liệu được xét" description="Bao nhiêu câu trả lời gần nhất dùng để xếp mức một kỹ năng con.">
          <NumberField label="Số câu gần nhất được xét" unit="câu" min={1} max={20} value={form.window} onChange={set("window")} hint="Từ 1 đến 20 câu." />
          <NumberField label="Số câu tối thiểu để xếp mức" unit="câu" min={1} max={20} value={form.minItems} onChange={set("minItems")} hint="Ít hơn thì phụ huynh thấy “Chưa có dữ liệu”." />
        </FieldGroup>

        <FieldGroup title="Ngưỡng xếp mức" description="Điểm trung bình của các câu được xét quyết định kỹ năng con ở mức nào.">
          <NumberField label="“Đang phát triển” từ" unit="%" min={1} max={99} value={form.developingFrom} onChange={set("developingFrom")} hint="Dưới ngưỡng này là “Đang làm quen”." />
          <NumberField label="“Vững” từ" unit="%" min={2} max={100} value={form.secureFrom} onChange={set("secureFrom")} hint="Phải lớn hơn ngưỡng “Đang phát triển”." />
        </FieldGroup>

        {error && <p className="rounded-2xl bg-danger-tint/60 px-4 py-3 text-sm font-semibold text-danger-dark">{error}</p>}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-navy/[0.06] pt-5">
          {dirty && <span className="mr-auto text-xs font-semibold text-primary-dark">Có thay đổi chưa lưu</span>}
          {dirty && (
            <Button
              variant="ghost"
              onClick={() => {
                setForm(toForm(settings));
                setError("");
              }}
            >
              Hoàn tác
            </Button>
          )}
          <Button type="submit" size="lg" loading={update.isPending} disabled={!dirty}>
            Lưu tham số
          </Button>
        </div>
      </form>

      <LevelPreview dev={dev} sec={sec} window={form.window} minItems={form.minItems} valid={valid} />
    </div>
  );
}

// Tham số báo cáo EQ (spec sư phạm CASEL §7): cửa sổ câu, số câu tối thiểu, ngưỡng 3 mức. Áp dụng ngay cho mọi báo cáo.
function ReportSettingsPage() {
  const { data, isLoading, isError, error, refetch } = useReportSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tham số báo cáo"
        description="Quy tắc xếp mức “Đang làm quen / Đang phát triển / Vững” cho từng kỹ năng con trong báo cáo EQ của phụ huynh. Đổi tham số áp dụng ngay cho mọi báo cáo."
      />
      {isLoading ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Skeleton className="h-96 rounded-card" />
          <Skeleton className="h-72 rounded-card" />
        </div>
      ) : isError ? (
        <Card>
          <EmptyState
            icon={AlertCircle}
            tone="danger"
            title="Không tải được tham số"
            description={error.message}
            action={
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Thử lại
              </Button>
            }
          />
        </Card>
      ) : (
        <SettingsForm key={JSON.stringify(data)} settings={data} />
      )}
    </div>
  );
}

export default ReportSettingsPage;
