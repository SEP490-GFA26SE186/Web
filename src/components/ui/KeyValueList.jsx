import { cn } from "./cn";

/**
 * Danh sách nhãn: giá trị, giá trị canh phải (số dùng chữ số đều nhau). items: [{ label, value, hint? }]
 * value là mảng → mỗi phần tử một dòng (vd. nhiều gói đang dùng).
 */
function KeyValueList({ items, className }) {
  return (
    <dl className={cn("space-y-3", className)}>
      {items.map(({ label, value, hint }) => (
        <div key={label} className="flex items-baseline justify-between gap-4">
          <dt className="shrink-0 text-sm text-navy/60">{label}</dt>
          <dd className="min-w-0 text-right">
            {Array.isArray(value) ? (
              value.map((v) => (
                <span key={v} className="block text-sm font-bold text-navy tabular-nums">
                  {v}
                </span>
              ))
            ) : (
              <span className="text-sm font-bold text-navy tabular-nums">{value}</span>
            )}
            {hint && <span className="block text-xs text-navy/50">{hint}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default KeyValueList;
