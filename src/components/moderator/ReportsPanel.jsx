import { AlertOctagon, BadgeCheck, EyeOff, FilePenLine, FolderOpen, GraduationCap, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useResolveReport } from "../../hooks/useModerator";
import { toast } from "../../stores/toastStore";
import { formatAgo } from "../../utils/format";

const RESULT_MESSAGES = {
  hide_page: "Đã tạm ẩn trang bị báo cáo và thông báo cho tác giả",
  request_fix: "Đã gửi yêu cầu chỉnh sửa tới tác giả",
  dismiss: "Đã bác bỏ báo cáo (lưu vào lịch sử xử lý)",
};

function ReportCard({ report }) {
  const resolve = useResolveReport();
  const urgent = report.severity === "urgent";
  const pendingAction = resolve.isPending ? resolve.variables?.action : null;

  const run = (action) =>
    resolve.mutate(
      { id: report.id, action },
      { onSuccess: () => toast.success(`#${report.id}: ${RESULT_MESSAGES[action]}`), onError: () => toast.error("Xử lý thất bại, thử lại nhé") },
    );

  const PrimaryIcon = report.primaryAction.type === "hide_page" ? EyeOff : FilePenLine;

  return (
    <article className="relative flex flex-col gap-3 overflow-hidden rounded-card bg-white p-4 pl-6 shadow-low">
      <span className={`absolute inset-y-0 left-0 w-1.5 ${urgent ? "bg-danger" : "bg-primary"}`} />
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full px-2 py-0.5 font-bold text-white uppercase ${urgent ? "bg-danger" : "bg-primary"}`}>
            {urgent ? `Khẩn cấp • ${report.slaLabel}` : "Bình thường"}
          </span>
          <span className="font-mono font-semibold text-navy/60">#{report.id}</span>
          <span className="text-navy/30">•</span>
          <span className="text-navy/60">Gửi {formatAgo(report.sentMinutesAgo)}</span>
        </div>
        <p className="flex items-center gap-1 text-sm text-navy/60">
          {report.reporterType === "teacher" ? <GraduationCap size={16} /> : <BadgeCheck size={16} className="text-secondary" />}
          Người gửi: <strong className="text-navy">{report.reporter}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="font-display font-bold">
            Truyện: "{report.storyTitle}" <span className="font-sans text-sm font-normal text-navy/60">(Tác giả: {report.storyAuthor})</span>
          </p>
          <p className="mt-2 rounded-xl bg-surface p-3 text-navy/90">
            <span className={`font-bold ${urgent ? "text-danger" : "text-primary-dark"}`}>Lý do báo cáo:</span> "{report.reason}"
          </p>
        </div>
        <div className="flex w-full flex-col gap-1.5 md:col-span-4">
          <span className="text-[11px] font-bold tracking-wider text-navy/50 uppercase">Hành động nhanh</span>
          <button
            onClick={() => run(report.primaryAction.type)}
            disabled={resolve.isPending}
            className={`flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition disabled:opacity-60 ${
              urgent ? "bg-danger text-white hover:bg-danger-dark" : "bg-outline/80 hover:bg-outline"
            }`}
          >
            {pendingAction === report.primaryAction.type ? <Loader2 size={17} className="animate-spin" /> : <PrimaryIcon size={17} />}
            {report.primaryAction.label}
          </button>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => toast.info(`Đang mở hồ sơ #${report.id} (màn chi tiết sẽ có ở bản sau)`)}
              className="flex items-center justify-center gap-1 rounded-full bg-surface px-2 py-1.5 text-xs font-semibold hover:bg-outline"
            >
              <FolderOpen size={14} /> {report.secondaryLabel}
            </button>
            <button
              onClick={() => run("dismiss")}
              disabled={resolve.isPending}
              className="flex items-center justify-center gap-1 rounded-full bg-surface px-2 py-1.5 text-xs font-semibold text-navy/70 hover:text-danger disabled:opacity-60"
            >
              {pendingAction === "dismiss" ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} Bác bỏ
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ReportsPanel({ reports, limit = 2 }) {
  return (
    <section className="flex flex-col gap-4 rounded-stage bg-surface p-6 shadow-low">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <AlertOctagon size={22} className="text-danger" />
            <h2 className="text-2xl">Báo cáo người dùng & phụ huynh gần nhất</h2>
            <span className="rounded-full bg-danger-tint px-2 py-0.5 text-xs font-bold text-danger-dark">{reports.length} vụ việc mở</span>
          </div>
          <p className="mt-0.5 text-sm text-navy/60">
            Cảnh báo từ phụ huynh có trẻ tham gia đọc, hệ thống ưu tiên đánh giá tác động tâm lý
          </p>
        </div>
        <Link to={ROUTES.MODERATOR.REPORTS} className="self-start rounded-full bg-outline/70 px-4 py-1.5 text-sm font-semibold hover:bg-outline sm:self-auto">
          Lịch sử xử lý khiếu nại
        </Link>
      </div>

      {reports.length === 0 ? (
        <p className="rounded-card bg-white p-6 text-center text-sm text-navy/60">Không còn báo cáo nào đang mở. Tuyệt vời! 🎉</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.slice(0, limit).map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ReportsPanel;
