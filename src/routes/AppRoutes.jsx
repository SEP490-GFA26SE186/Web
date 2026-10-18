import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../constants/roles";
import ParentLayout from "../layouts/ParentLayout";
import ParentDashboardPage from "../pages/parent/ParentDashboardPage";
import ComingSoonPage from "../pages/parent/ComingSoonPage";
import LibraryPage from "../pages/parent/LibraryPage";
import MarketplacePage from "../pages/parent/MarketplacePage";
import SettingsPage from "../pages/parent/SettingsPage";
import ChildrenPage from "../pages/parent/ChildrenPage";
import StudioPage from "../pages/parent/studio/StudioPage";
import CreateStoryPage from "../pages/parent/studio/CreateStoryPage";
import StoryEditorPage from "../pages/parent/studio/StoryEditorPage";

// Cổng Kiểm duyệt & Admin tách bundle riêng — phụ huynh không phải tải code quản trị
const ModeratorLayout = lazy(() => import("../layouts/ModeratorLayout"));
const TopicsPage = lazy(() => import("../pages/moderator/TopicsPage"));
const FamilyCharactersPage = lazy(() => import("../pages/parent/FamilyCharactersPage"));
const EqJourneyPage = lazy(() => import("../pages/parent/EqJourneyPage"));
const KeywordsPage = lazy(() => import("../pages/moderator/KeywordsPage"));
const ReportsPage = lazy(() => import("../pages/moderator/ReportsPage"));
const SuspendedPage = lazy(() => import("../pages/moderator/SuspendedPage"));
const StrikesPage = lazy(() => import("../pages/moderator/StrikesPage"));
const AuditsPage = lazy(() => import("../pages/moderator/AuditsPage"));
const AppealsPage = lazy(() => import("../pages/admin/AppealsPage"));
const AccountsPage = lazy(() => import("../pages/admin/AccountsPage"));
const PlansPage = lazy(() => import("../pages/admin/PlansPage"));
const RefundsPage = lazy(() => import("../pages/admin/RefundsPage"));
const FinanceReportPage = lazy(() => import("../pages/admin/FinanceReportPage"));
const AuditLogsPage = lazy(() => import("../pages/admin/AuditLogsPage"));
const SellerApplicationsPage = lazy(() => import("../pages/moderator/SellerApplicationsPage"));
const ModeratorDashboardPage = lazy(
  () => import("../pages/moderator/ModeratorDashboardPage"),
);
const ReviewWorkspacePage = lazy(
  () => import("../pages/moderator/ReviewWorkspacePage"),
);
const WorkspaceIndexRedirect = lazy(() =>
  import("../pages/moderator/ReviewWorkspacePage").then((m) => ({
    default: m.WorkspaceIndexRedirect,
  })),
);
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminDashboardPage = lazy(
  () => import("../pages/admin/AdminDashboardPage"),
);
const AiConfigPage = lazy(() => import("../pages/admin/AiConfigPage"));
const KidLayout = lazy(() => import("../layouts/KidLayout"));
const StoryReaderPage = lazy(() => import("../pages/kid/StoryReaderPage"));
const KidBookshelfPage = lazy(() => import("../pages/kid/KidBookshelfPage"));
const BillingPage = lazy(() => import("../pages/parent/billing/BillingPage"));
const SellingPage = lazy(() => import("../pages/parent/selling/SellingPage"));
const WithdrawalsPage = lazy(() => import("../pages/admin/WithdrawalsPage"));
const ListingDetailPage = lazy(() => import("../pages/parent/marketplace/ListingDetailPage"));
const PurchaseResultPage = lazy(() => import("../pages/parent/marketplace/PurchaseResultPage"));
const NewListingPage = lazy(() => import("../pages/parent/selling/NewListingPage"));
const BillingResultPage = lazy(() => import("../pages/parent/billing/BillingResultPage"));
const KidReaderIndex = lazy(() =>
  import("../pages/kid/StoryReaderPage").then((m) => ({ default: m.KidReaderIndex })),
);

function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas">
      <span
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary-tint border-t-primary"
        aria-label="Đang tải"
      />
    </div>
  );
}

const parentPlaceholders = [
  { path: "help", title: "Trợ giúp" },
];

const moderatorPlaceholders = [
  { path: "backgrounds", title: "Thư viện bối cảnh" },
  { path: "ai-flags", title: "Cảnh báo AI" },
  { path: "guidelines", title: "Quy chuẩn kiểm duyệt" },
];

const publicPlaceholders = [
  { path: "/chinh-sach-bao-mat", title: "Chính sách bảo mật trẻ em" },
  { path: "/dieu-khoan-dich-vu", title: "Điều khoản dịch vụ" },
];

const placeholderRoutes = (items) =>
  items.map(({ path, title }) => (
    <Route key={path} path={path} element={<ComingSoonPage title={title} />} />
  ));

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/parent"
          element={
            <ProtectedRoute roles={[ROLES.PARENT]}>
              <ParentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ParentDashboardPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="eq-journey" element={<EqJourneyPage />} />
          <Route path="family-characters" element={<FamilyCharactersPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="marketplace/result" element={<PurchaseResultPage />} />
          <Route path="marketplace/:listingId" element={<ListingDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="children" element={<ChildrenPage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="studio/new" element={<CreateStoryPage />} />
          <Route path="studio/:storyId" element={<StoryEditorPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="selling" element={<SellingPage />} />
          <Route path="selling/new" element={<NewListingPage />} />
          <Route path="billing/result" element={<BillingResultPage />} />
          {placeholderRoutes(parentPlaceholders)}
        </Route>

        <Route
          path="/moderator"
          element={
            <ProtectedRoute roles={[ROLES.MODERATOR]}>
              <ModeratorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ModeratorDashboardPage />} />
          <Route path="topics" element={<TopicsPage />} />
          <Route path="keywords" element={<KeywordsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="suspended" element={<SuspendedPage />} />
          <Route path="strikes" element={<StrikesPage />} />
          <Route path="audits" element={<AuditsPage />} />
          <Route path="workspace" element={<WorkspaceIndexRedirect />} />
          <Route path="workspace/:storyId" element={<ReviewWorkspacePage />} />
          <Route path="seller-applications" element={<SellerApplicationsPage />} />
          <Route path="queue" element={<Navigate to="/moderator" replace />} />
          {placeholderRoutes(moderatorPlaceholders)}
        </Route>

        {/* Chế độ Trẻ Em: cần phiên Kid Mode (ba mẹ mở ở trang Bé nhà mình); thoát ra phải qua cổng PIN */}
        <Route path="/kid" element={<KidLayout />}>
          <Route index element={<Navigate to="bookshelf" replace />} />
          <Route path="bookshelf" element={<KidBookshelfPage />} />
          <Route path="story" element={<KidReaderIndex />} />
          <Route path="story/:storyId" element={<StoryReaderPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="ai-config" element={<AiConfigPage />} />
          <Route path="withdrawals" element={<WithdrawalsPage />} />
          <Route path="appeals" element={<AppealsPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="refunds" element={<RefundsPage />} />
          <Route path="revenue" element={<FinanceReportPage view="revenue" />} />
          <Route path="ai-costs" element={<FinanceReportPage view="ai-costs" />} />
          <Route path="profit-loss" element={<FinanceReportPage view="profit-loss" />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Route>

        {/* Trang công khai chưa làm (link từ footer Landing) */}
        {publicPlaceholders.map(({ path, title }) => (
          <Route
            key={path}
            path={path}
            element={
              <div className="min-h-screen bg-canvas px-4 py-10">
                <ComingSoonPage title={title} />
              </div>
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
