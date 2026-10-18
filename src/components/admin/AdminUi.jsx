import { Loader2 } from "lucide-react";

// Thành phần dùng chung cho các trang Admin.

export function Tabs({ value, onChange, items, label = "Bộ lọc" }) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label={label}>
      {items.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          onClick={() => onChange(t.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-bold ${value === t.value ? "bg-primary text-white" : "bg-surface text-navy/70 hover:bg-outline"}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function PageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-navy/70">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">{children}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, tone = "text-navy" }) {
  return (
    <div className="card space-y-1 p-5">
      <p className="text-sm text-navy/60">{label}</p>
      <p className={`font-display text-2xl font-bold ${tone}`}>{value}</p>
      {hint && <p className="text-xs text-navy/55">{hint}</p>}
    </div>
  );
}

export function LoadState({ isLoading, error, empty, emptyText = "Không có dữ liệu." }) {
  if (isLoading) return <Loader2 size={26} className="m-5 animate-spin text-primary" />;
  if (error) return <p className="p-5 text-danger">{error.message}</p>;
  if (empty) return <p className="p-8 text-center text-navy/60">{emptyText}</p>;
  return null;
}
