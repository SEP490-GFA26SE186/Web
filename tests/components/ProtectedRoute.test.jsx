import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { ROUTES } from "../../src/constants/routes";
import ProtectedRoute from "../../src/routes/ProtectedRoute";
import useAuthStore from "../../src/stores/authStore";
import useKidSessionStore from "../../src/stores/kidSessionStore";

function LoginPage() {
  const from = useLocation().state?.from?.pathname;
  return <p>Trang đăng nhập (from {from})</p>;
}

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.KID.BOOKSHELF} element={<p>Tủ sách của bé</p>} />
        <Route path={ROUTES.SPECIALIST.DASHBOARD} element={<p>Trang chuyên gia</p>} />
        <Route path={ROUTES.HOME} element={<p>Trang chủ</p>} />
        <Route
          path="/parent/secret"
          element={
            <ProtectedRoute roles={["parent"]}>
              <p>Trang phụ huynh</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

const signIn = (role) =>
  useAuthStore.setState({ user: { id: "u1", role }, accessToken: "a", refreshToken: "r", isAuthenticated: true });

beforeEach(() => {
  useAuthStore.setState({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  useKidSessionStore.setState({ token: null, child: null });
});

describe("ProtectedRoute", () => {
  it("chưa đăng nhập → về /login, nhớ trang đang vào", () => {
    renderAt("/parent/secret");
    expect(screen.getByText("Trang đăng nhập (from /parent/secret)")).toBeInTheDocument();
  });

  it("đúng vai trò → hiện trang", () => {
    signIn("parent");
    renderAt("/parent/secret");
    expect(screen.getByText("Trang phụ huynh")).toBeInTheDocument();
  });

  it("sai vai trò → về trang chủ của vai trò hiện tại", () => {
    signIn("specialist");
    renderAt("/parent/secret");
    expect(screen.getByText("Trang chuyên gia")).toBeInTheDocument();
    expect(screen.queryByText("Trang phụ huynh")).not.toBeInTheDocument();
  });

  it("vai trò lạ → về trang chủ", () => {
    signIn("unknown");
    renderAt("/parent/secret");
    expect(screen.getByText("Trang chủ")).toBeInTheDocument();
  });

  it("đang ở Kid Mode → luôn về tủ sách của bé, kể cả khi phụ huynh đã đăng nhập", () => {
    signIn("parent");
    useKidSessionStore.setState({ token: "kid", child: { id: "c1" } });
    renderAt("/parent/secret");
    expect(screen.getByText("Tủ sách của bé")).toBeInTheDocument();
  });
});
