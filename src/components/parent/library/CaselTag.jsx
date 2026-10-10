import { CASEL } from "../../../constants/casel";

// Nhãn năng lực CASEL của bài học (topic) gắn với truyện
function CaselTag({ competency, prefix = "", short = false, className = "bg-white/90 backdrop-blur" }) {
  const meta = CASEL[competency];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-secondary-dark ${className}`}>
      <Icon size={12} />
      {prefix}
      {short ? meta.short : meta.label}
    </span>
  );
}

export default CaselTag;
