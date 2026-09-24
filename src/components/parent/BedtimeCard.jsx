import { Loader2, Moon } from "lucide-react";
import { useToggleBedtime } from "../../hooks/useParent";

function BedtimeCard({ childId, bedtime }) {
  const toggle = useToggleBedtime(childId);
  const enabled = bedtime.enabled;

  return (
    <section
      className={`flex items-center gap-3 rounded-card p-4 transition ${
        enabled ? "bg-navy text-white shadow-mid" : "bg-gradient-to-r from-slate-200/70 to-secondary-tint"
      }`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
          enabled ? "bg-white/15 text-white" : "bg-white text-navy-soft"
        }`}
      >
        <Moon size={19} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">Chế độ ru ngủ ({bedtime.time})</p>
        <p className={`text-xs ${enabled ? "text-white/70" : "text-navy/60"}`}>{bedtime.description}</p>
      </div>
      <button
        aria-pressed={enabled}
        disabled={toggle.isPending}
        onClick={() => toggle.mutate(!enabled)}
        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-low transition disabled:opacity-60 ${
          enabled ? "bg-secondary text-white hover:bg-secondary-dark" : "bg-white text-navy hover:bg-surface"
        }`}
      >
        {toggle.isPending && <Loader2 size={12} className="animate-spin" />}
        {enabled ? "Đang bật · Tắt" : "Bật"}
      </button>
    </section>
  );
}

export default BedtimeCard;
