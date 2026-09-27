import { ArrowLeftRight, ArrowRight, Gavel, Loader2, QrCode, VolumeX, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useApproveWithdrawal, useProcessRefund } from "../../hooks/useAdmin";
import { toast } from "../../stores/toastStore";
import { formatVND } from "../../utils/format";

const badgeTones = {
  primary: "bg-primary-tint text-primary-dark",
  secondary: "bg-secondary-tint text-secondary-dark",
  neutral: "bg-outline text-navy/70",
};

function QueueCard({ icon: Icon, iconClass, title, subtitle, count, countClass, children, footLeft, footLink }) {
  return (
    <section className="flex flex-col justify-between rounded-stage bg-white p-6 shadow-low">
      <div>
        <div className="flex items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-3">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${iconClass}`}>
              <Icon size={21} />
            </span>
            <div>
              <h2 className="text-lg leading-tight">{title}</h2>
              <p className="text-xs text-navy/60">{subtitle}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-white ${countClass}`}>{count}</span>
        </div>
        <div className="flex flex-col gap-2">{children}</div>
      </div>
      <div className="flex items-center justify-between gap-2 pt-4 text-xs">
        <span className="text-navy/60">{footLeft}</span>
        <Link to={footLink.to} className={`flex shrink-0 items-center gap-0.5 text-sm font-bold hover:underline ${footLink.className}`}>
          {footLink.label} <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

function WithdrawalItem({ item }) {
  const approve = useApproveWithdrawal();
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-surface p-3 transition hover:bg-outline/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-outline text-xs font-bold">{item.initials}</span>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-1 text-sm font-bold">
              {item.seller}
              <span className={`rounded-full px-1.5 text-[10px] ${badgeTones[item.badge.tone]}`}>{item.badge.label}</span>
            </p>
            <p className="text-xs text-navy/60">{item.bank}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-bold text-primary-dark">{formatVND(item.amount)}</p>
          <p className="text-[11px] text-navy/60">{item.note}</p>
        </div>
      </div>
      <div className="flex justify-end gap-1">
        <Link to={ROUTES.ADMIN.WITHDRAWALS} className="rounded-full px-3 py-1 text-xs font-semibold text-navy/60 hover:bg-outline">
          Chi tiết
        </Link>
        <button
          disabled={approve.isPending}
          onClick={() =>
            approve.mutate(item.id, {
              onSuccess: () => toast.success(`Đã phê duyệt ${formatVND(item.amount)} cho ${item.seller}`),
              onError: () => toast.error("Phê duyệt thất bại"),
            })
          }
          className="inline-flex items-center gap-1 rounded-full bg-primary-dark px-3 py-1 text-xs font-bold text-white shadow-low hover:bg-primary disabled:opacity-60"
        >
          {approve.isPending && <Loader2 size={12} className="animate-spin" />} Phê duyệt lệnh
        </button>
      </div>
    </div>
  );
}

function RefundItem({ item }) {
  const refund = useProcessRefund();
  const Icon = item.type === "payment" ? QrCode : VolumeX;
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl bg-surface p-3 transition hover:bg-outline/50">
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 text-sm font-bold">
          <Icon size={17} className={`shrink-0 ${item.type === "payment" ? "text-danger" : "text-navy/60"}`} />
          <span className="truncate">
            #{item.id} • {item.title}
          </span>
        </span>
        <span className="shrink-0 font-bold text-primary-dark">{formatVND(item.amount)}</span>
      </div>
      <p className="text-sm text-navy/65">
        {item.who}: <b className="text-navy">{item.name}</b> {item.context}
      </p>
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <span className={`text-xs font-bold ${item.canRefund ? "text-secondary-dark" : "text-navy/60"}`}>{item.verification}</span>
        {item.canRefund ? (
          <button
            disabled={refund.isPending}
            onClick={() =>
              refund.mutate(item.id, { onSuccess: () => toast.success(`Đã hoàn ${formatVND(item.amount)} cho ${item.name}`) })
            }
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white hover:bg-secondary-dark disabled:opacity-60"
          >
            {refund.isPending && <Loader2 size={12} className="animate-spin" />} Hoàn tiền ngay
          </button>
        ) : (
          <Link to={ROUTES.ADMIN.AUDIT_LOGS} className="rounded-full bg-outline px-3 py-1 text-xs font-semibold hover:bg-outline/70">
            Kiểm tra log
          </Link>
        )}
      </div>
    </div>
  );
}

function ActionQueues({ withdrawals, appeals, refunds }) {
  const shownWithdrawals = withdrawals.slice(0, 2);
  const rest = withdrawals.slice(2);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <QueueCard
        icon={Wallet} iconClass="bg-primary-tint text-primary-dark"
        title="Yêu Cầu Rút Tiền Chờ Duyệt" subtitle={`${withdrawals.length} yêu cầu đang chờ giải ngân tài chính`}
        count={`${withdrawals.length} chờ`} countClass="bg-primary-dark"
        footLeft={rest.length ? `Còn ${rest.length} yêu cầu khác (${formatVND(rest.reduce((s, w) => s + w.amount, 0))})` : "Không còn yêu cầu nào khác"}
        footLink={{ to: ROUTES.ADMIN.WITHDRAWALS, label: "Xem chi tiết & Phê duyệt", className: "text-primary-dark" }}
      >
        {shownWithdrawals.length ? (
          shownWithdrawals.map((w) => <WithdrawalItem key={w.id} item={w} />)
        ) : (
          <p className="rounded-2xl bg-surface p-4 text-center text-sm text-navy/60">Đã giải ngân hết các lệnh 🎉</p>
        )}
      </QueueCard>

      <QueueCard
        icon={Gavel} iconClass="bg-danger-tint text-danger"
        title="Kháng Nghị Phạt Cảnh Cáo" subtitle="Admin là cấp thẩm quyền phán quyết cuối cùng"
        count={`${appeals.length} vụ việc`} countClass="bg-danger"
        footLeft="Hạn chót thẩm định: < 24h"
        footLink={{ to: ROUTES.ADMIN.APPEALS, label: "Xem hồ sơ kháng nghị", className: "text-danger" }}
      >
        {appeals.slice(0, 2).map((a) => (
          <Link key={a.id} to={ROUTES.ADMIN.APPEALS} className="flex flex-col gap-1 rounded-2xl bg-surface p-3 transition hover:bg-outline/50">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-bold">
                {a.id}: {a.title}
              </span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${a.strike >= 2 ? "bg-danger-tint text-danger-dark" : "bg-outline text-navy/70"}`}>
                Gậy {a.strike}
              </span>
            </div>
            <p className="line-clamp-2 text-sm text-navy/65">
              Tác giả <b className="text-navy">{a.author}</b> {a.detail}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy/60">Gửi cách đây: {a.hoursAgo} giờ</span>
              <span className={`font-bold ${a.priority ? "text-secondary-dark" : "text-navy/60"}`}>{a.status}</span>
            </div>
          </Link>
        ))}
      </QueueCard>

      <QueueCard
        icon={ArrowLeftRight} iconClass="bg-secondary-tint text-secondary-dark"
        title="Yêu Cầu Hoàn Tiền" subtitle="Sự cố giao dịch VietQR & sự cố kỹ thuật"
        count={`${refunds.length} đơn`} countClass="bg-secondary"
        footLeft="Tự động đối soát cổng ngân hàng"
        footLink={{ to: ROUTES.ADMIN.REFUNDS, label: "Xem xét hoàn tiền", className: "text-secondary-dark" }}
      >
        {refunds.length ? (
          refunds.map((r) => <RefundItem key={r.id} item={r} />)
        ) : (
          <p className="rounded-2xl bg-surface p-4 text-center text-sm text-navy/60">Không còn yêu cầu hoàn tiền nào 🎉</p>
        )}
      </QueueCard>
    </div>
  );
}

export default ActionQueues;
