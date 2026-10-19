import { Suspense, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ChevronRight, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import logo from "../../assets/logo.png";
import InitialAvatar from "../common/InitialAvatar";
import LogoutButton from "../common/LogoutButton";
import useUiStore from "../../stores/uiStore";

const BADGE_TONES = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  danger: "bg-danger text-white",
};

/** Tìm mục menu đang mở (khớp đường dẫn dài nhất) cùng nhóm của nó — dùng làm breadcrumb trên topbar. */
function findActive(sections, pathname) {
  let best = null;
  for (const s of sections) {
    for (const item of s.items) {
      const match = item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);
      if (match && (!best || item.to.length > best.item.to.length)) best = { item, section: s.title };
    }
  }
  return best;
}

/** Mục menu. `rail` = sidebar đang thu gọn (chỉ có tác dụng từ lg; trên điện thoại ngăn kéo luôn đầy đủ). */
function NavItem({ item, rail, onNavigate }) {
  const { to, label, icon: Icon, end, badge, badgeTone = "primary", soon } = item;
  const hideOnRail = rail ? "lg:hidden" : "";
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      title={rail ? `${label}${soon ? " (sắp có)" : ""}${badge > 0 ? ` • ${badge}` : ""}` : undefined}
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${rail ? "lg:justify-center lg:px-0" : ""} ${
          isActive ? "bg-primary text-white shadow-mid" : "text-navy/75 hover:bg-primary-tint hover:text-primary-dark"
        }`
      }
    >
      <Icon size={19} className="shrink-0" />
      <span className={`flex-1 truncate ${soon ? "opacity-60" : ""} ${hideOnRail}`}>{label}</span>
      {soon && <span className={`rounded-full bg-outline px-2 py-0.5 text-[10px] font-bold text-navy/60 ${hideOnRail}`}>Sắp có</span>}
      {badge > 0 && <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${BADGE_TONES[badgeTone]} ${hideOnRail}`}>{badge}</span>}
      {rail && badge > 0 && <span className={`absolute top-1.5 right-2 hidden h-2 w-2 rounded-full lg:block ${BADGE_TONES[badgeTone].split(" ")[0]}`} />}
    </NavLink>
  );
}

/**
 * Khung chung cho cổng phụ huynh / kiểm duyệt / admin: sidebar (thu gọn được trên desktop, ngăn kéo trên điện thoại),
 * topbar (tiêu đề theo mục đang mở + phần phải tuỳ vai trò), vùng nội dung.
 *
 * brand: { subtitle, badge?: { label, className } }
 * sections: [{ title?, items: [{ to, label, icon, end?, badge?, badgeTone?, soon? }] }]
 * user: { name, subtitle } • extraTitles: { [pathPrefix]: "Tiêu đề" } cho trang không có trong menu
 * topbarRight: node • beforeContent: node (vd. banner xác thực email)
 */
function AppShell({ brand, sections, user, topbarRight, extraTitles = {}, beforeContent, homeTo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggle = useUiStore((s) => s.toggleSidebar);
  const { pathname } = useLocation();
  const active = findActive(sections, pathname);
  const extra = Object.entries(extraTitles).find(([prefix]) => pathname.startsWith(prefix));
  // Breadcrumb: nhóm › mục menu (› trang con nếu có, vd. "Lượt duyệt").
  const crumbs = [...new Set([active?.section, active?.item.label, extra?.[1]].filter(Boolean))];
  const close = () => setMenuOpen(false);

  // Ngăn kéo trên điện thoại: Esc để đóng, khoá cuộn trang phía sau khi mở.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  // Trên điện thoại sidebar luôn đầy đủ (ngăn kéo); thu gọn chỉ áp dụng từ lg.
  const rail = collapsed;

  return (
    <div className="min-h-screen bg-canvas">
      <div
        onClick={close}
        className={`fixed inset-0 z-30 bg-navy/30 backdrop-blur-sm transition lg:hidden ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-outline bg-white transition-all duration-200 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } ${rail ? "lg:w-[76px]" : "lg:w-64"}`}
      >
        <div className={`flex items-center gap-3 pt-5 pb-4 ${rail ? "lg:justify-center lg:px-0" : ""} px-4`}>
          <Link to={homeTo} onClick={close} className="shrink-0" aria-label="Trang chính">
            <img src={logo} alt="StoryWeaver" className="h-10 w-10 rounded-full" />
          </Link>
          <div className={`min-w-0 flex-1 leading-tight ${rail ? "lg:hidden" : ""}`}>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold text-primary">StoryWeaver</span>
              {brand.badge && <span className={`hidden rounded-full px-2 py-0.5 lg:inline text-[10px] font-extrabold tracking-wider ${brand.badge.className}`}>{brand.badge.label}</span>}
            </div>
            <p className="truncate text-[11px] font-extrabold tracking-wider text-secondary uppercase">{brand.subtitle}</p>
          </div>
          <button onClick={close} className="rounded-full p-1 lg:hidden" aria-label="Đóng menu">
            <X size={20} />
          </button>
        </div>

        <nav className={`scrollbar-none flex-1 space-y-4 overflow-y-auto pb-4 ${rail ? "px-3 lg:px-2.5" : "px-3"}`} aria-label="Menu chính">
          {sections.map((section, i) => (
            <div key={section.title ?? i} className="flex flex-col gap-0.5">
              {section.title && rail && <hr className="mx-2 mb-1 hidden border-outline lg:block" />}
              {section.title && <p className={`px-3 pt-1 pb-1.5 text-[11px] font-extrabold tracking-wider text-navy/45 uppercase ${rail ? "lg:hidden" : ""}`}>{section.title}</p>}
              {section.items.map((item) => (
                <NavItem key={item.to} item={item} rail={rail} onNavigate={close} />
              ))}
            </div>
          ))}
        </nav>

        {user && (
          <div className={`m-3 flex items-center gap-2 rounded-2xl bg-surface p-2.5 ${rail ? "lg:flex-col lg:p-2" : ""}`}>
            <InitialAvatar name={user.name} className="h-9 w-9 shrink-0 text-sm" />
            <div className={`min-w-0 flex-1 leading-tight ${rail ? "lg:hidden" : ""}`}>
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="truncate text-xs font-semibold text-secondary-dark">{user.subtitle}</p>
            </div>
            <LogoutButton />
          </div>
        )}
      </aside>

      <div className={`transition-all duration-200 ${rail ? "lg:pl-[76px]" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-outline/70 bg-canvas/90 px-4 backdrop-blur md:px-6">
          <button onClick={() => setMenuOpen(true)} className="rounded-full p-2 hover:bg-surface lg:hidden" aria-label="Mở menu">
            <Menu size={22} />
          </button>
          <button
            onClick={toggle}
            className="hidden rounded-full p-2 text-navy/60 hover:bg-surface hover:text-navy lg:inline-flex"
            aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
          <nav aria-label="Vị trí" className="min-w-0">
            <ol className="flex min-w-0 items-center gap-1 text-sm">
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={c} className={`flex min-w-0 items-center gap-1 ${last ? "" : "hidden sm:flex"}`}>
                    <span className={last ? "truncate font-display text-base font-bold text-navy" : "font-semibold whitespace-nowrap text-navy/50"} aria-current={last ? "page" : undefined}>
                      {c}
                    </span>
                    {!last && <ChevronRight size={14} className="shrink-0 text-navy/35" />}
                  </li>
                );
              })}
            </ol>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:gap-3">{topbarRight}</div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-6 lg:px-8">
          {beforeContent}
          <Suspense fallback={<div className="h-96 animate-pulse rounded-stage bg-surface" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
