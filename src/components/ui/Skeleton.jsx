import { cn } from "./cn";

/** Khối giữ chỗ có ánh sáng lướt qua; đặt kích thước / bo góc bằng className. */
function Skeleton({ className }) {
  return (
    <div aria-hidden="true" className={cn("relative overflow-hidden rounded-xl bg-navy/[0.05]", className)}>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}

export default Skeleton;
