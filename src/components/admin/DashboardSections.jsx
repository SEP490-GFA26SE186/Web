import { BadgeDollarSign, LockKeyhole, SlidersHorizontal } from "lucide-react";
import { formatNumber, formatVND } from "../../utils/format";
import RevenueChart from "./RevenueChart";

const barTones = { primary: "bg-primary-dark", secondary: "bg-[#008a7a]", navy: "bg-navy-soft" };
const shareTones = { primary: "text-primary-dark", secondary: "text-secondary-dark", navy: "text-navy-soft" };
const tierTones = ["bg-outline text-navy", "bg-primary-tint text-primary-dark", "bg-secondary-tint text-secondary-dark"];
const tierShareTones = ["text-secondary-dark", "text-primary-dark", "text-navy"];

export function RevenueSection({ series, breakdown }) {
  return (
    <section className="flex flex-col justify-between rounded-stage bg-white p-6 shadow-low lg:col-span-7">
      <div className="pb-4">
        <h2 className="text-lg">Doanh Thu Nền Tảng & Chi Phí Vận Hành AI</h2>
        <p className="text-sm text-navy/60">Đối chiếu tăng trưởng GMV so với chi phí token OpenAI, Claude và ElevenLabs</p>
      </div>
      <RevenueChart series={series} />
      <div className="pt-4">
        <span className="block pb-2 text-[11px] font-bold tracking-wider text-navy/50 uppercase">Cơ cấu phân bổ nguồn thu</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {breakdown.map((b) => (
            <div key={b.label} className="flex flex-col gap-1 rounded-2xl bg-surface p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-navy/60">{b.label}</span>
                <span className={`text-sm font-bold ${shareTones[b.tone]}`}>{b.share}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-outline">
                <div className={`h-full rounded-full ${barTones[b.tone]}`} style={{ width: `${b.share}%` }} />
              </div>
              <span className="text-sm font-semibold">{formatVND(b.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection({ tiers, escrow }) {
  return (
    <section className="flex flex-col justify-between rounded-stage bg-white p-6 shadow-low lg:col-span-5">
      <div>
        <div className="flex items-center justify-between pb-3">
          <div>
            <h2 className="text-lg">Cơ Cấu Định Giá Chợ Truyện</h2>
            <p className="text-sm text-navy/60">Hiệu quả kinh doanh theo khung giá chuẩn</p>
          </div>
          <BadgeDollarSign size={24} className="text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          {tiers.map((t, i) => (
            <div key={t.level} className="flex items-center justify-between gap-3 rounded-2xl bg-surface p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display font-bold ${tierTones[i]}`}>{t.level}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    {t.name} • {formatVND(t.price)}
                  </p>
                  <p className="truncate text-sm text-navy/60">{t.desc}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold">{formatNumber(t.copies)} bản</p>
                <p className={`text-xs font-semibold ${tierShareTones[i]}`}>{t.share}% khối lượng</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-1.5 rounded-2xl bg-outline/60 p-4">
        <p className="flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
          <LockKeyhole size={17} /> Bảo vệ quyền lợi Escrow {escrow.days} ngày ({escrow.sellerPayout}% Seller Payout)
        </p>
        <p className="text-sm text-navy/65">
          Doanh thu từ bạn đọc được giữ an toàn {escrow.days} ngày nhằm đảm bảo quyền khiếu nại chất lượng nội dung trước khi chuyển sang
          ví khả dụng của tác giả.
        </p>
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-navy/60">Tỷ lệ thanh toán đúng hạn:</span>
          <span className="font-bold text-secondary-dark">{escrow.onTimeRate}%</span>
        </div>
      </div>
    </section>
  );
}

const valueTones = { secondary: "text-secondary-dark", danger: "text-danger", undefined: "text-primary-dark" };

export function PipelineSection({ nodes }) {
  return (
    <section className="rounded-stage bg-white p-6 shadow-low">
      <div className="flex flex-col justify-between gap-3 pb-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary-tint text-secondary-dark">
            <SlidersHorizontal size={19} />
          </span>
          <div>
            <h2 className="text-lg">Giám Sát Hạ Tầng & AI Pipeline Trực Tiếp</h2>
            <p className="text-sm text-navy/60">Độ trễ phản hồi, chi phí đơn vị và trạng thái API sinh nội dung</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 self-start rounded-full bg-surface px-4 py-1.5 text-xs font-semibold text-navy/70 md:self-auto">
          <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" /> Gateway: Hoạt động bình thường
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {nodes.map((n) => (
          <div key={n.id} className="flex flex-col justify-between gap-1 rounded-2xl bg-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold">{n.name}</span>
              <span className="shrink-0 rounded-full bg-secondary-tint px-2 py-0.5 text-xs font-bold text-secondary-dark">{n.status}</span>
            </div>
            <span className="text-sm text-navy/60">{n.desc}</span>
            <div className="flex items-center justify-between pt-1 text-xs text-navy/60">
              <span>
                {n.left[0]}: <b className="text-navy">{n.left[1]}</b>
              </span>
              <span>
                {n.right[0]}: <b className={valueTones[n.rightTone]}>{n.right[1]}</b>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
