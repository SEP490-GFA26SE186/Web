import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import ParentLayout from "../layouts/ParentLayout";
import ParentDashboardPage from "../pages/parent/ParentDashboardPage";
import ComingSoonPage from "../pages/parent/ComingSoonPage";
import LibraryPage from "../pages/parent/LibraryPage";
import ExplorePage from "../pages/parent/ExplorePage";
import ChildrenPage from "../pages/parent/ChildrenPage";

const parentPlaceholders = [
  { path: "family-characters", title: "Nhân vật gia đình" },
  { path: "studio", title: "Sáng tác truyện" },
  { path: "eq-journey", title: "Hành trình EQ" },
  { path: "marketplace", title: "Chợ truyện" },
  { path: "billing", title: "Gói & AI Credits" },
  { path: "help", title: "Trợ giúp" },
  { path: "settings", title: "Cài đặt" },
];

function AppRoutes() {
  return (
    <Routes>
      {/* Tạm thời chuyển thẳng vào dashboard Parent khi chưa có luồng đăng nhập */}
      <Route path="/" element={<Navigate to="/parent" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/parent" element={<ParentLayout />}>
        <Route index element={<ParentDashboardPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="children" element={<ChildrenPage />} />
        {parentPlaceholders.map(({ path, title }) => (
          <Route key={path} path={path} element={<ComingSoonPage title={title} />} />
        ))}
      </Route>

      <Route path="*" element={<Navigate to="/parent" replace />} />
    </Routes>
  );
}

export default AppRoutes;
