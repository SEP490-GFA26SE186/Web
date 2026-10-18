import { AlertTriangle, Ban, Bot, Brain, ClipboardList, Flag, IdCard, LayoutDashboard, ListChecks, Mountain, PauseCircle } from "lucide-react";
import AppShell from "../components/shell/AppShell";
import { ROUTES } from "../constants/routes";
import { useModeratorOverview } from "../hooks/useModerator";

const R = ROUTES.MODERATOR;

function ModeratorLayout() {
  const { data } = useModeratorOverview();
  const badges = data?.navBadges ?? {};

  const sections = [
    {
      title: "Kiểm duyệt",
      items: [
        { to: R.DASHBOARD, label: "Hàng chờ duyệt", icon: LayoutDashboard, end: true, badge: badges.storyQueue },
        { to: R.SELLER_APPLICATIONS, label: "Hồ sơ người bán", icon: IdCard, badge: badges.sellerApplications, badgeTone: "secondary" },
        { to: R.GUIDELINES, label: "Quy chuẩn kiểm duyệt", icon: ClipboardList },
      ],
    },
    {
      title: "Nội dung",
      items: [
        { to: R.TOPICS, label: "Bài học", icon: Brain },
        { to: R.KEYWORDS, label: "Từ khoá chặn", icon: Ban },
        { to: R.BACKGROUNDS, label: "Thư viện bối cảnh", icon: Mountain, soon: true },
      ],
    },
    {
      title: "Giám sát",
      items: [
        { to: R.REPORTS, label: "Báo cáo vi phạm", icon: Flag, badge: badges.reports, badgeTone: "danger" },
        { to: R.SUSPENDED, label: "Truyện tạm gỡ", icon: PauseCircle },
        { to: R.STRIKES, label: "Cảnh cáo tác giả", icon: AlertTriangle },
        { to: R.AUDITS, label: "Kiểm tra ngẫu nhiên", icon: ListChecks, badge: badges.audits },
        { to: R.AI_FLAGS, label: "Cảnh báo AI", icon: Bot },
      ],
    },
  ];

  return (
    <AppShell
      homeTo={R.DASHBOARD}
      brand={{ subtitle: "Kiểm duyệt", badge: { label: "MOD", className: "bg-primary-dark text-white" } }}
      sections={sections}
      extraTitles={{ "/moderator/workspace": "Lượt duyệt" }}
      user={data && { name: data.moderator.name, subtitle: "Kiểm duyệt viên" }}
    />
  );
}

export default ModeratorLayout;
