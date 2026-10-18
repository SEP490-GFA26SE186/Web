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
  TrendingUp,
  UserCog,
  Wallet,
} from "lucide-react";
import LogoutButton from "../components/common/LogoutButton";
import PortalHeader from "../components/portal/PortalHeader";
import PortalSidebar from "../components/portal/PortalSidebar";
import { ROUTES } from "../constants/routes";
import { useAdminOverview } from "../hooks/useAdmin";
import InitialAvatar from "../components/common/InitialAvatar";

const R = ROUTES.ADMIN;

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { data } = useAdminOverview();
  const badges = data?.navBadges ?? {};

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
    <div className="flex items-center gap-2 text-sm">
      <InitialAvatar name={data.admin.name} className="h-8 w-8 text-sm" />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate font-bold">{data.admin.name}</p>
        <p className="text-xs font-bold text-primary-dark">{data.admin.role}</p>
      </div>
      <LogoutButton />
    </div>
  );

  const segment = pathname.split("/")[2] ?? "";
  const current = sections.flatMap((sec) => sec.items).find((i) => i.to === `/admin/${segment}` || (!segment && i.end));

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
            { label: current?.label ?? "Admin Portal" },
          ]}
          searchPlaceholder="Tìm kiếm tài khoản, GD, log, AI..."
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
