import { EQ_TOPICS } from "../../../constants/eqTopics";

function TopicTag({ topic, prefix = "", className = "bg-white/90 backdrop-blur" }) {
  const meta = EQ_TOPICS[topic];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-secondary-dark ${className}`}
    >
      <Icon size={12} />
      {prefix}
      {meta.label}
    </span>
  );
}

export default TopicTag;
