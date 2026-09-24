const tones = {
  orange: "bg-primary-tint text-primary",
  teal: "bg-secondary-tint text-secondary",
};

// Khung chung cho các khối cài đặt trong hồ sơ bé
function SectionCard({ icon: Icon, tone = "orange", title, subtitle, action, children, className = "" }) {
  return (
    <section className={`card p-6 ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${tones[tone]}`}>
            <Icon size={22} />
          </span>
          <div>
            <h3 className="text-lg">{title}</h3>
            {subtitle && <p className="text-sm text-navy/60">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default SectionCard;
