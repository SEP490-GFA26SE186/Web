import { Link } from "react-router-dom";
import {
  BadgeDollarSign,
  BookOpen,
  Coins,
  CreditCard,
  HelpCircle,
  LayoutGrid,
  PenTool,
  Settings,
  Smile,
  Store,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import EmailVerifyBanner from "../components/auth/EmailVerifyBanner";
import ChildSwitcher from "../components/parent/ChildSwitcher";
import AppShell from "../components/shell/AppShell";
import { ROUTES } from "../constants/routes";
import { useParentProfile } from "../hooks/useParent";

const R = ROUTES.PARENT;

const SECTIONS = [
  {
    title: "Gia đình",
    items: [
      { to: R.DASHBOARD, label: "Tổng quan", icon: LayoutGrid, end: true },
      { to: R.LIBRARY, label: "Tủ sách", icon: BookOpen },
      { to: R.CHILDREN, label: "Bé nhà mình", icon: Smile },
      { to: R.FAMILY_CHARACTERS, label: "Nhân vật gia đình", icon: UsersRound },
      { to: R.EQ_JOURNEY, label: "Báo cáo EQ", icon: TrendingUp },
    ],
  },
  {
    title: "Sáng tác & Chợ truyện",
    items: [
      { to: R.STUDIO, label: "Sáng tác truyện", icon: PenTool },
      { to: R.MARKETPLACE, label: "Chợ truyện", icon: Store },
      { to: R.SELLING, label: "Bán truyện", icon: BadgeDollarSign },
    ],
  },
  {
    title: "Tài khoản",
    items: [
      { to: R.BILLING, label: "Gói dịch vụ & Credit", icon: CreditCard },
      { to: R.SETTINGS, label: "Cài đặt", icon: Settings },
      { to: R.HELP, label: "Trợ giúp", icon: HelpCircle },
    ],
  },
];

// Trang con không có trong menu — tiêu đề topbar (cụ thể trước, chung sau)
const EXTRA_TITLES = {
  "/parent/studio/new": "Tạo truyện mới",
  "/parent/studio/": "Biên tập truyện",
  "/parent/marketplace/result": "Kết quả thanh toán",
  "/parent/marketplace/": "Chi tiết truyện",
  "/parent/selling/new": "Đăng bán truyện",
  "/parent/billing/result": "Kết quả thanh toán",
};

function ParentLayout() {
  const parent = useParentProfile();
  return (
    <AppShell
      homeTo={R.DASHBOARD}
      brand={{ subtitle: "Nuôi dưỡng EQ" }}
      sections={SECTIONS}
      extraTitles={EXTRA_TITLES}
      user={{ name: parent.name, subtitle: parent.planName ?? "…" }}
      beforeContent={
        <div className="mb-6 empty:hidden">
          <EmailVerifyBanner />
        </div>
      }
      topbarRight={
        <>
          <ChildSwitcher />
          {parent.creditBalance != null && (
            <Link
              to={R.BILLING}
              title="Credit AI còn lại trong tháng"
              className="hidden items-center gap-1.5 rounded-full border border-outline bg-white px-3 py-2 text-xs font-bold hover:bg-surface sm:flex"
            >
              <Coins size={15} className="text-primary" /> {parent.creditBalance} credit
            </Link>
          )}
        </>
      }
    />
  );
}

export default ParentLayout;
