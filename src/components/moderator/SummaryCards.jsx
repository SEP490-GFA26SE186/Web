import { ArrowRight, BookOpen, Flag, Gavel, ListChecks, PauseCircle, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const R = ROUTES.MODERATOR;

function SummaryCard({ icon: Icon, iconClass, chip, chipClass, label, value, valueClass = "", unit, action, to, danger }) {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-card p-4 shadow-low transition hover:shadow-mid ${
        danger ? "bg-danger-tint/50" : "bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`grid h-10 w-10 place-items-center rounded-full ${iconClass}`}>
          <Icon size={21} />
        </span>
        {chip && <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${chipClass}`}>{chip}</span>}
      </div>
      <div className="mt-4">
        <p className={`text-[11px] font-bold tracking-wider uppercase ${danger ? "text-danger-dark" : "text-navy/60"}`}>{label}</p>
        <p className="mt-0.5 flex items-baseline gap-1">
          <span className={`font-display text-3xl font-bold ${valueClass}`}>{value}</span>
          <span className={`text-sm ${danger ? "text-danger-dark" : "text-navy/60"}`}>{unit}</span>
        </p>
      </div>
      <Link
        to={to}
        className={`mt-3 flex items-center justify-between text-sm font-semibold transition group-hover:translate-x-0.5 ${action.className}`}
      >
        {action.label} <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function SummaryCards({ summary }) {
  const { sellerApplications, storyQueue, reports, suspended, strikes, audits } = summary;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      <SummaryCard
        icon={UserCheck} iconClass="bg-secondary-tint text-secondary-dark"
        chip={`+${sellerApplications.today} hôm nay`} chipClass="bg-secondary text-white"
        label="Đơn Seller chờ duyệt" value={sellerApplications.count} unit="hồ sơ"
        action={{ label: "Xem danh sách", className: "text-secondary-dark" }} to={R.SELLER_APPLICATIONS}
      />
      <SummaryCard
        icon={BookOpen} iconClass="bg-primary-tint text-primary"
        chip={`${storyQueue.priority} ưu tiên`} chipClass="bg-primary-dark text-white"
        label="Truyện chờ kiểm duyệt" value={storyQueue.count} valueClass="text-primary-dark" unit="bản thảo"
        action={{ label: "Vào hàng chờ", className: "text-primary-dark" }} to={R.QUEUE}
      />
      <SummaryCard
        danger icon={Flag} iconClass="bg-danger-tint text-danger-dark"
        chip={reports.urgent ? `${reports.urgent} khẩn cấp` : null} chipClass="animate-pulse bg-danger text-white"
        label="Báo cáo nội dung mở" value={reports.count} valueClass="text-danger" unit="khiếu nại"
        action={{ label: "Xử lý ngay", className: "text-danger" }} to={R.REPORTS}
      />
      <SummaryCard
        icon={PauseCircle} iconClass="bg-outline text-navy/70"
        chip=">5 reports" chipClass="bg-outline text-navy/70"
        label="Tạm đình chỉ tự động" value={suspended.count} unit="truyện"
        action={{ label: "Thẩm định lại", className: "text-secondary-dark" }} to={R.SUSPENDED}
      />
      <SummaryCard
        icon={Gavel} iconClass="bg-primary-tint text-primary-dark"
        chip={`${strikes.atLevel2} chạm mốc 2`} chipClass="bg-outline text-navy/70"
        label="Cảnh cáo tác giả" value={strikes.count} unit="tài khoản"
        action={{ label: "Chi tiết vi phạm", className: "text-navy/70 hover:text-navy" }} to={R.STRIKES}
      />
      <SummaryCard
        icon={ListChecks} iconClass="bg-navy-tint text-navy-soft"
        chip={`${audits.passRate}% đạt chuẩn`} chipClass="bg-secondary-tint text-secondary-dark"
        label="Kiểm định ngẫu nhiên" value={audits.done} unit={`/ ${audits.target} tuần`}
        action={{ label: "Lấy mẫu ngẫu nhiên", className: "text-secondary-dark" }} to={R.AUDITS}
      />
    </section>
  );
}

export default SummaryCards;
