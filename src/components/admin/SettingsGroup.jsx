import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useSettings, useUpdateSetting } from "../../hooks/useAdmin";
import { toast } from "../../stores/toastStore";
import { formatDateTime } from "./adminFormat";

// Tỉ lệ lưu 0..1, hiển thị %; các khoá khác là số nguyên.
const toInput = (s) => (s.type === "rate" ? String(Math.round(s.value * 100)) : String(s.value));
const fromInput = (s, raw) => (s.type === "rate" ? Number(raw) / 100 : Number(raw));

function SettingRow({ setting }) {
  const [raw, setRaw] = useState(toInput(setting));
  const update = useUpdateSetting();
  const dirty = raw !== toInput(setting);
  const save = () =>
    update.mutate(
      { key: setting.key, value: fromInput(setting, raw) },
      { onSuccess: () => toast.success(`Đã lưu: ${setting.label}`), onError: (e) => toast.error(e.message) },
    );
  return (
    <li className="flex flex-col gap-2 py-3 md:flex-row md:items-center">
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{setting.label}</p>
        <p className="text-xs text-navy/55">
          {setting.hint && `${setting.hint} `}
          {setting.isDefault ? "Đang dùng giá trị mặc định." : `Sửa lần cuối ${formatDateTime(setting.updatedAt)} bởi ${setting.updatedBy}.`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={raw}
          step={1}
          min={setting.type === "rate" ? setting.min * 100 : setting.min}
          max={setting.type === "rate" ? setting.max * 100 : setting.max}
          onChange={(e) => setRaw(e.target.value)}
          aria-label={setting.label}
          className="w-32 rounded-full border-[1.5px] border-outline px-4 py-2 text-right text-sm"
        />
        <span className="w-20 text-sm text-navy/60">{setting.unit}</span>
        <button type="button" onClick={save} disabled={!dirty || update.isPending} className="btn-primary px-3 py-2 text-sm disabled:opacity-40" aria-label={`Lưu ${setting.label}`}>
          {update.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        </button>
      </div>
    </li>
  );
}

/** Danh sách cấu hình của một nhóm (ai | market | moderation), sửa từng dòng. */
function SettingsGroup({ group }) {
  const { data, isLoading, error } = useSettings();
  if (isLoading) return <Loader2 size={22} className="animate-spin text-primary" />;
  if (error) return <p className="text-danger">{error.message}</p>;
  const rows = data.settings.filter((s) => s.group === group);
  return (
    <ul className="divide-y divide-outline">
      {rows.map((s) => (
        <SettingRow key={`${s.key}:${s.value}`} setting={s} />
      ))}
    </ul>
  );
}

export default SettingsGroup;
