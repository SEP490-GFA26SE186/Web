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

// Cổng Kiểm duyệt & Admin tách bundle riêng — phụ huynh không phải tải code quản trị
const ModeratorLayout = lazy(() => import("../layouts/ModeratorLayout"));
const TopicsPage = lazy(() => import("../pages/moderator/TopicsPage"));
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
  { path: "family-characters", title: "Nhân vật gia đình" },
  { path: "studio", title: "Sáng tác truyện" },
  { path: "eq-journey", title: "Báo cáo EQ" },
  { path: "billing", title: "Gói dịch vụ & Credit" },
  { path: "help", title: "Trợ giúp" },
];

const moderatorPlaceholders = [
  { path: "seller-applications", title: "Duyệt đơn Seller" },
  { path: "queue", title: "Hàng chờ duyệt truyện" },
  { path: "backgrounds", title: "Thư viện bối cảnh" },
  { path: "reports", title: "Báo cáo vi phạm" },
  { path: "suspended", title: "Truyện tạm đình chỉ" },
  { path: "strikes", title: "Cảnh cáo tác giả" },
  { path: "audits", title: "Kiểm định ngẫu nhiên" },
  { path: "ai-flags", title: "Cảnh báo AI" },
  { path: "keywords", title: "Từ khóa chặn" },
  { path: "guidelines", title: "Quy chuẩn kiểm duyệt" },
];

const adminPlaceholders = [
  { path: "accounts", title: "Tài Khoản Phụ Huynh & KDV" },
  { path: "plans", title: "Gói & Định Giá" },
  { path: "withdrawals", title: "Quản Lý Rút Tiền" },
  { path: "refunds", title: "Yêu Cầu Hoàn Tiền" },
  { path: "revenue", title: "Báo Cáo Doanh Thu" },
  { path: "ai-costs", title: "Chi Phí Vận Hành AI" },
  { path: "profit-loss", title: "Báo Cáo Lãi Lỗ P&L" },
  { path: "appeals", title: "Kháng Nghị Cảnh Cáo" },
  { path: "audit-logs", title: "Nhật Ký Kiểm Toán" },
];

const kidPlaceholders = [
  { path: "bookshelf", title: "Tủ Sách Bé Ngoan" },
];

const publicPlaceholders = [
  { path: "/chinh-sach-bao-mat", title: "Chính sách bảo mật trẻ em" },
  { path: "/dieu-khoan-dich-vu", title: "Điều khoản dịch vụ" },
  { path: "/goc-chuyen-gia", title: "Góc chuyên gia EQ" },
  { path: "/huong-dan-phu-huynh", title: "Hướng dẫn phụ huynh" },
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
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="children" element={<ChildrenPage />} />
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
          <Route path="workspace" element={<WorkspaceIndexRedirect />} />
          <Route path="workspace/:storyId" element={<ReviewWorkspacePage />} />
          {placeholderRoutes(moderatorPlaceholders)}
        </Route>

        {/* Chế độ Trẻ Em — để mở cho bản demo "Dùng thử Kid Mode" ở Landing; thoát ra ngoài phải qua cổng PIN của ba mẹ */}
        <Route path="/kid" element={<KidLayout />}>
          <Route index element={<Navigate to="story" replace />} />
          <Route path="story" element={<KidReaderIndex />} />
          <Route path="story/:storyId" element={<StoryReaderPage />} />
          {placeholderRoutes(kidPlaceholders)}
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
          {placeholderRoutes(adminPlaceholders)}
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
