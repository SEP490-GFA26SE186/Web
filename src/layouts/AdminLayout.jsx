import { Suspense, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  ArrowLeftRight,
  BadgePercent,
  Cpu,
  Gavel,
  LayoutDashboard,
  LineChart,
  ReceiptText,
  ScrollText,
  Settings,
  TrendingUp,
  UserCog,
  Wallet,
} from "lucide-react";
import LogoutButton from "../components/common/LogoutButton";
import PortalHeader from "../components/portal/PortalHeader";
import PortalSidebar from "../components/portal/PortalSidebar";
import { ROUTES } from "../constants/routes";
import { useAdminOverview } from "../hooks/useAdmin";

const R = ROUTES.ADMIN;

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { data } = useAdminOverview();
  const badges = data?.status.navBadges ?? {};

  const sections = [
    {
      title: "Tổng quan hệ thống",
      items: [
        { to: R.DASHBOARD, label: "Dashboard Điều Hành", icon: LayoutDashboard, end: true },
        { to: R.ACCOUNTS, label: "Tài Khoản Phụ Huynh & KDV", icon: UserCog },
      ],
    },
    { title: "Gói dịch vụ & Giá", items: [{ to: R.PLANS, label: "Gói & Định Giá", icon: BadgePercent }] },
    { title: "Hạ tầng & AI", items: [{ to: R.AI_CONFIG, label: "Cấu Hình AI Engine", icon: Cpu }] },
    {
      title: "Quản trị tài chính",
      items: [
        { to: R.WITHDRAWALS, label: "Quản Lý Rút Tiền", icon: Wallet, badge: badges.withdrawals, badgeTone: "secondary" },
        { to: R.REFUNDS, label: "Yêu Cầu Hoàn Tiền", icon: ArrowLeftRight, badge: badges.refunds, badgeTone: "danger" },
        { to: R.REVENUE, label: "Báo Cáo Doanh Thu", icon: LineChart },
        { to: R.AI_COSTS, label: "Chi Phí Vận Hành AI", icon: ReceiptText },
        { to: R.PROFIT_LOSS, label: "Báo Cáo Lãi Lỗ P&L", icon: TrendingUp },
      ],
    },
    {
      title: "Giám sát & Tuân thủ",
      items: [
        { to: R.APPEALS, label: "Kháng Nghị Cảnh Cáo", icon: Gavel, badge: badges.appeals, badgeTone: "danger" },
        { to: R.AUDIT_LOGS, label: "Nhật Ký Kiểm Toán", icon: ScrollText },
      ],
    },
  ];

  const footer = data && (
    <div className="space-y-2 text-sm">
      <p className="flex items-center gap-2 px-1 text-xs font-semibold text-navy/60">
        <span className={`h-2 w-2 animate-pulse rounded-full ${data.status.aiHealthy ? "bg-secondary" : "bg-danger"}`} />
        {data.status.uptime}% • AI: {data.status.aiHealthy ? "Hoạt động" : "Gián đoạn"}
      </p>
      <div className="flex items-center gap-2">
        <img src={data.admin.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-bold">{data.admin.name}</p>
          <p className="text-xs font-bold text-primary-dark">{data.admin.role}</p>
        </div>
        <button className="rounded-full p-1 text-navy/60 hover:text-navy" title="Cài đặt" aria-label="Cài đặt">
          <Settings size={17} />
        </button>
        <LogoutButton />
      </div>
    </div>
  );

  const status = data && (
    <span className="hidden items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy/70 2xl:flex">
      <span className="h-2 w-2 rounded-full bg-secondary" />
      {data.status.env} • {data.status.version}
    </span>
  );

  const isAiConfig = pathname.startsWith(R.AI_CONFIG);

  return (
    <div className="min-h-screen bg-canvas">
      <PortalSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        roleBadge={{ label: "ADMIN", className: "bg-primary text-white" }}
        subtitle="Hệ Thống & Tài Chính"
        sections={sections}
        activeClass="bg-primary-dark font-bold text-white shadow-mid"
        footer={footer}
      />
      <div className="lg:pl-72">
        <PortalHeader
          onOpenMenu={() => setMenuOpen(true)}
          breadcrumbs={[
            { label: "Cổng Quản Trị Hệ Thống", to: R.DASHBOARD },
            { label: isAiConfig ? "Cấu Hình AI Engine" : "Admin Portal" },
          ]}
          searchPlaceholder="Tìm kiếm tài khoản, GD, log, AI..."
          status={status}
          links={[
            { to: ROUTES.MODERATOR.DASHBOARD, label: "Cổng KDV" },
            { to: ROUTES.PARENT.DASHBOARD, label: "Cổng Phụ Huynh" },
          ]}
          user={data?.admin}
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

export default AdminLayout;
