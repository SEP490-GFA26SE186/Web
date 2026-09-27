import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { ROUTES } from "../../constants/routes";

const FOOTER_LINKS = [
  { to: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
  { to: "/dieu-khoan-dich-vu", label: "Điều khoản sử dụng" },
  { to: "/huong-dan-phu-huynh", label: "Hướng dẫn phụ huynh" },
];

// Khung chung cho các trang xác thực (đăng nhập, đăng ký, quên mật khẩu...)
function AuthShell({ headerAction, children }) {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-canvas selection:bg-primary-tint selection:text-primary-dark">
      <header className="fixed top-0 z-40 w-full bg-canvas/90 shadow-low backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link to={ROUTES.HOME} className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01]">
            <img src={logo} alt="" className="h-10 w-10 rounded-full" />
            <span className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-primary-dark">StoryWeaver AI</span>
          </Link>
          {headerAction}
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-6 pt-20 lg:px-12">{children}</main>

      <footer className="w-full bg-surface py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted sm:flex-row lg:px-12">
          <nav className="flex flex-wrap items-center justify-center gap-5" aria-label="Liên kết chính sách">
            {FOOTER_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="transition-colors hover:text-navy">
                {l.label}
              </Link>
            ))}
          </nav>
          <p>© {new Date().getFullYear()} StoryWeaver AI. Mọi quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}

export default AuthShell;
