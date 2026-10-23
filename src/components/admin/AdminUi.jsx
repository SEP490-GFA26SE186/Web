import { AlertCircle, Inbox } from "lucide-react";
import { EmptyState, PageHeader as UiPageHeader, SegmentedControl, Skeleton, StatTile } from "../ui";

// Thành phần dùng chung cho các trang Admin (giữ API cũ, dựng trên bộ components/ui).

export function Tabs({ value, onChange, items, label = "Bộ lọc" }) {
  return <SegmentedControl value={value} onChange={onChange} items={items} label={label} />;
}

export function PageHeader(props) {
  return <UiPageHeader {...props} />;
}

/** tone cũ là class màu chữ; "text-primary-dark" → tô màu nhấn cho giá trị. */
export function StatCard({ label, value, hint, tone, icon, iconTone, index }) {
  return <StatTile label={label} value={value} hint={hint} emphasis={tone === "text-primary-dark"} icon={icon} tone={iconTone} index={index} />;
}

export function LoadState({ isLoading, error, empty, emptyText = "Không có dữ liệu." }) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-5" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
    );
  }
  if (error) return <EmptyState compact icon={AlertCircle} tone="danger" title="Không tải được dữ liệu" description={error.message} />;
  if (empty) return <EmptyState compact icon={Inbox} title={emptyText} />;
  return null;
}
