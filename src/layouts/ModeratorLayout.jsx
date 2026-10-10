import { Suspense, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  AlertTriangle,
  Ban,
  Bot,
  BookOpen,
  Brain,
  ClipboardList,
  Flag,
  Gauge,
  IdCard,
  LayoutDashboard,
  ListChecks,
  Mountain,
  PauseCircle,
  PenLine,
} from "lucide-react";
import LogoutButton from "../components/common/LogoutButton";
import PortalHeader from "../components/portal/PortalHeader";
import PortalSidebar from "../components/portal/PortalSidebar";
import { ROUTES } from "../constants/routes";
import { useModeratorOverview } from "../hooks/useModerator";

const R = ROUTES.MODERATOR;

// Tên trang cho breadcrumb, theo đoạn đường dẫn thứ 2
const PAGE_TITLES = {
  "": "Tổng quan",
  "seller-applications": "Duyệt đơn Seller",
  queue: "Hàng chờ duyệt truyện",
  topics: "Danh sách bài học",
  backgrounds: "Thư viện bối cảnh",
  reports: "Báo cáo vi phạm",
  suspended: "Truyện tạm đình chỉ",
  strikes: "Cảnh cáo tác giả",
  audits: "Kiểm định ngẫu nhiên",
  "ai-flags": "Cảnh báo AI",
  keywords: "Từ khóa chặn",
  guidelines: "Quy chuẩn kiểm duyệt",
};

const getBreadcrumbs = (pathname) => {
  const segment = pathname.split("/")[2] ?? "";
  const root = { label: "Cổng Kiểm Duyệt", to: R.DASHBOARD };
  if (segment === "workspace") return [root, { label: "Hàng chờ", to: R.QUEUE }, { label: "Không gian làm việc" }];
  return [root, { label: PAGE_TITLES[segment] ?? "Tổng quan" }];
};

function ModeratorLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { data } = useModeratorOverview();
  const badges = data?.navBadges ?? {};

  const sections = [
    {
      title: "Nhiệm vụ kiểm duyệt",
      items: [
        { to: R.DASHBOARD, label: "Tổng quan", icon: LayoutDashboard, end: true },
        { to: R.SELLER_APPLICATIONS, label: "Duyệt đơn Seller", icon: IdCard, badge: badges.sellerApplications, badgeTone: "secondary" },
        { to: R.QUEUE, label: "Hàng chờ duyệt truyện", icon: BookOpen, badge: badges.storyQueue },
        { to: R.WORKSPACE, label: "Không gian kiểm duyệt", icon: PenLine },
        { to: R.TOPICS, label: "Danh sách bài học", icon: Brain },
        { to: R.BACKGROUNDS, label: "Thư viện bối cảnh", icon: Mountain },
      ],
    },
    {
      title: "Giám sát & Tuân thủ",
      items: [
        { to: R.REPORTS, label: "Báo cáo vi phạm", icon: Flag, badge: badges.reports, badgeTone: "danger" },
        { to: R.SUSPENDED, label: "Truyện tạm đình chỉ", icon: PauseCircle },
        { to: R.STRIKES, label: "Cảnh cáo tác giả", icon: AlertTriangle },
        { to: R.AUDITS, label: "Kiểm định ngẫu nhiên", icon: ListChecks },
        { to: R.AI_FLAGS, label: "Cảnh báo AI", icon: Bot },
        { to: R.KEYWORDS, label: "Từ khóa chặn", icon: Ban },
      ],
    },
  ];

  const footer = (
    <div className="space-y-2 text-sm">
      <Link to={R.GUIDELINES} className="flex items-center gap-2 px-1 font-semibold text-navy/70 hover:text-navy">
        <ClipboardList size={17} /> Quy chuẩn kiểm duyệt
      </Link>
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="flex items-center gap-2 font-semibold text-navy/60">
          <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" /> Trực ban an toàn
        </span>
        <span className="font-bold text-secondary-dark">{data?.shift.name ?? "…"}</span>
      </div>
      {data && (
        <div className="flex items-center gap-2 pt-1">
          <img src={data.moderator.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate font-bold">{data.moderator.name}</p>
            <p className="truncate text-[11px] text-navy/60">{data.moderator.title}</p>
          </div>
          <LogoutButton />
        </div>
      )}
    </div>
  );

  const status = data && (
    <>
      <span className="hidden items-center gap-2 rounded-full bg-secondary-tint px-3 py-1 text-xs text-secondary-dark 2xl:flex">
        <Gauge size={15} />
        <b>Xử lý hôm nay: {data.shift.processedPercent}%</b>
        <span className="text-secondary-dark/40">•</span>
        {data.shift.onlineModerators} KDV trực tuyến
      </span>
      <span className="hidden items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold sm:flex">
        <span className={`h-2 w-2 rounded-full ${data.shift.aiGuardEnabled ? "bg-secondary" : "bg-danger"}`} />
        AI Guard: {data.shift.aiGuardEnabled ? "Bật" : "Tắt"}
      </span>
    </>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <PortalSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        roleBadge={{ label: "MOD", className: "bg-primary-dark text-white" }}
        subtitle="Sư Phạm & An Toàn"
        sections={sections}
        activeClass="bg-primary font-bold text-white shadow-mid"
        footer={footer}
      />
      <div className="lg:pl-72">
        <PortalHeader
          onOpenMenu={() => setMenuOpen(true)}
          breadcrumbs={getBreadcrumbs(pathname)}
          searchPlaceholder="Tìm theo Mã truyện, Tên tác giả, Từ khóa, Báo cáo..."
          status={status}
          user={data?.moderator}
        />
        <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-stage bg-surface" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default ModeratorLayout;
