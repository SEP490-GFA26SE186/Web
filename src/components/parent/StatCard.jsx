const tones = {
  orange: "bg-primary-tint text-primary",
  teal: "bg-secondary-tint text-secondary",
  navy: "bg-slate-100 text-navy-soft",
};

function StatCard({ icon: Icon, tone = "orange", label, value, hint, hintClassName = "text-secondary-dark" }) {
  return (
    <div className="card flex gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-mid">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-navy/60">{label}</p>
        <p className="mt-1 font-display text-2xl font-bold">{value}</p>
        {hint && <p className={`mt-1 text-xs font-semibold ${hintClassName}`}>{hint}</p>}
      </div>
    </div>
  );
}

export default StatCard;
