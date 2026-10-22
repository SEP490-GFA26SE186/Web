import { AlertTriangle, Ban, Bot, Brain, ClipboardList, FileQuestion, Flag, IdCard, LayoutDashboard, ListChecks, Mountain, PauseCircle, ScanSearch, SlidersHorizontal, Sprout } from "lucide-react";
import AppShell from "../components/shell/AppShell";
import { ROUTES } from "../constants/routes";
import { useSpecialistOverview } from "../hooks/useSpecialist";

const R = ROUTES.SPECIALIST;

function SpecialistLayout() {
  const { data } = useSpecialistOverview();
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
      title: "Chương trình sư phạm",
      items: [
        { to: R.SUB_SKILLS, label: "Kỹ năng con", icon: Sprout },
        { to: R.TEMPLATES, label: "Mẫu câu hỏi", icon: FileQuestion },
        { to: R.TOPICS, label: "Chuyện mẫu", icon: Brain },
        { to: R.CHECKPOINT_REVIEW, label: "Soát câu hỏi AI", icon: ScanSearch },
        { to: R.REPORT_SETTINGS, label: "Tham số báo cáo", icon: SlidersHorizontal },
      ],
    },
    {
      title: "Nội dung",
      items: [
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
      brand={{ subtitle: "Chuyên gia sư phạm", badge: { label: "CG", className: "bg-primary-dark text-white" } }}
      sections={sections}
      extraTitles={{ "/specialist/workspace": "Lượt duyệt" }}
      user={data && { name: data.specialist.name, subtitle: "Chuyên gia sư phạm" }}
    />
  );
}

export default SpecialistLayout;
