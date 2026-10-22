import {
  ArrowLeftRight,
  BadgePercent,
  Cpu,
  Gavel,
  LayoutDashboard,
  LineChart,
  ScrollText,
  UserCog,
  Wallet,
} from "lucide-react";
import AppShell from "../components/shell/AppShell";
import { ROUTES } from "../constants/routes";
import { useAdminOverview } from "../hooks/useAdmin";

const R = ROUTES.ADMIN;

function AdminLayout() {
  const { data } = useAdminOverview();
  const badges = data?.navBadges ?? {};

  const sections = [
    {
      title: "Tổng quan",
      items: [
        { to: R.DASHBOARD, label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: R.ACCOUNTS, label: "Tài khoản", icon: UserCog },
      ],
    },
    {
      title: "Cấu hình",
      items: [
        { to: R.PLANS, label: "Gói & định giá", icon: BadgePercent },
        { to: R.AI_CONFIG, label: "Cấu hình AI", icon: Cpu },
      ],
    },
    {
      title: "Tài chính",
      items: [
        { to: R.WITHDRAWALS, label: "Rút tiền người bán", icon: Wallet, badge: badges.withdrawals, badgeTone: "secondary" },
        { to: R.REFUNDS, label: "Hoàn tiền", icon: ArrowLeftRight, badge: badges.refunds, badgeTone: "danger" },
        { to: R.REVENUE, label: "Doanh thu", icon: LineChart },
      ],
    },
    {
      title: "Giám sát",
      items: [
        { to: R.APPEALS, label: "Kháng nghị cảnh cáo", icon: Gavel, badge: badges.appeals, badgeTone: "danger" },
        { to: R.AUDIT_LOGS, label: "Nhật ký kiểm toán", icon: ScrollText },
      ],
    },
  ];

  return (
    <AppShell
      homeTo={R.DASHBOARD}
      brand={{ subtitle: "Quản trị", badge: { label: "ADMIN", className: "bg-primary text-white" } }}
      sections={sections}
      user={data && { name: data.admin.name, subtitle: "Quản trị viên" }}
    />
  );
}

export default AdminLayout;
