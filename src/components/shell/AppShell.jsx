import { Suspense, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ChevronRight, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import logo from "../../assets/logo.png";
import InitialAvatar from "../common/InitialAvatar";
import LogoutButton from "../common/LogoutButton";
import useUiStore from "../../stores/uiStore";
import { Badge, IconButton, Skeleton, cn } from "../ui";

const BADGE_TONES = { primary: "solidPrimary", secondary: "solidSecondary", danger: "solidDanger" };
const DOT_TONES = { primary: "bg-primary", secondary: "bg-secondary", danger: "bg-danger" };

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
        cn(
          "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition duration-200 ease-(--ease-out-soft) active:scale-[0.98]",
          rail && "lg:justify-center lg:px-0",
          isActive ? "bg-primary-tint font-bold text-primary-dark" : "font-semibold text-navy/65 hover:bg-navy/[0.04] hover:text-navy",
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Vạch chỉ báo mục đang mở */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-primary transition duration-300 ease-(--ease-out-soft)",
              isActive ? "opacity-100" : "scale-y-0 opacity-0",
              rail && "lg:hidden",
            )}
          />
          <Icon size={18} strokeWidth={isActive ? 2.25 : 2} className={cn("shrink-0 transition-colors", isActive ? "text-primary" : "text-navy/45 group-hover:text-navy/70")} />
          <span className={cn("flex-1 truncate", soon && "opacity-60", hideOnRail)}>{label}</span>
          {soon && (
            <Badge size="sm" className={hideOnRail}>
              Sắp có
            </Badge>
          )}
          {badge > 0 && (
            <Badge size="sm" tone={BADGE_TONES[badgeTone]} className={rail ? "lg:hidden" : undefined}>
              {badge}
            </Badge>
          )}
          {rail && badge > 0 && <span className={cn("absolute top-1.5 right-2 hidden h-2 w-2 rounded-full ring-2 ring-white lg:block", DOT_TONES[badgeTone])} />}
        </>
      )}
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
        className={cn("fixed inset-0 z-30 bg-navy/30 backdrop-blur-sm transition duration-300 lg:hidden", menuOpen ? "opacity-100" : "pointer-events-none opacity-0")}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-navy/[0.06] bg-white transition-[width,transform] duration-300 ease-(--ease-out-soft) lg:translate-x-0",
          menuOpen ? "translate-x-0 shadow-high" : "-translate-x-full",
          rail ? "lg:w-[76px]" : "lg:w-64",
        )}
      >
        <div className={cn("flex h-16 items-center gap-3 px-4", rail && "lg:justify-center lg:px-0")}>
          <Link to={homeTo} onClick={close} className="shrink-0" aria-label="Trang chính">
            <img src={logo} alt="StoryWeaver" className="h-9 w-9 rounded-full ring-1 ring-navy/[0.06] transition-transform duration-300 hover:-rotate-6" />
          </Link>
          <div className={cn("min-w-0 flex-1 leading-tight", rail && "lg:hidden")}>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-[17px] font-bold text-primary">StoryWeaver</span>
              {brand.badge && (
                <span className="hidden lg:inline-flex">
                  <Badge size="sm" tone={brand.badge.className}>
                    {brand.badge.label}
                  </Badge>
                </span>
              )}
            </div>
            <p className="truncate text-xs font-semibold text-navy/50">{brand.subtitle}</p>
          </div>
          <IconButton icon={X} label="Đóng menu" onClick={close} className="lg:hidden" />
        </div>

        <nav className={cn("scrollbar-none flex-1 space-y-5 overflow-y-auto pt-2 pb-4", rail ? "px-3 lg:px-3.5" : "px-3")} aria-label="Menu chính">
          {sections.map((section, i) => (
            <div key={section.title ?? i} className="flex flex-col gap-0.5">
              {section.title && rail && <hr className="mx-2 mb-1 hidden border-navy/[0.06] lg:block" />}
              {section.title && <p className={cn("px-3 pb-1.5 text-[11px] font-bold tracking-[0.08em] text-navy/40 uppercase", rail && "lg:hidden")}>{section.title}</p>}
              {section.items.map((item) => (
                <NavItem key={item.to} item={item} rail={rail} onNavigate={close} />
              ))}
            </div>
          ))}
        </nav>

        {user && (
          <div className={cn("m-3 flex items-center gap-2.5 rounded-2xl border border-navy/[0.06] p-2 pl-2.5", rail && "lg:flex-col lg:border-0 lg:p-1")}>
            <InitialAvatar name={user.name} className="h-9 w-9 shrink-0 text-sm" />
            <div className={cn("min-w-0 flex-1 leading-tight", rail && "lg:hidden")}>
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="truncate text-xs text-navy/55">{user.subtitle}</p>
            </div>
            <LogoutButton />
          </div>
        )}
      </aside>

      <div className={cn("transition-[padding] duration-300 ease-(--ease-out-soft)", rail ? "lg:pl-[76px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-1.5 border-b border-navy/[0.06] bg-canvas/80 px-4 backdrop-blur-md backdrop-saturate-150 md:px-6">
          <IconButton icon={Menu} label="Mở menu" size={21} onClick={() => setMenuOpen(true)} className="lg:hidden" />
          <IconButton
            icon={collapsed ? PanelLeftOpen : PanelLeftClose}
            label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            onClick={toggle}
            className="hidden lg:grid"
          />
          <span aria-hidden="true" className="mx-1.5 hidden h-5 w-px bg-navy/10 lg:block" />
          <nav aria-label="Vị trí" className="min-w-0">
            <ol className="flex min-w-0 items-center gap-1 text-sm">
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={c} className={cn("flex min-w-0 items-center gap-1", !last && "hidden sm:flex")}>
                    <span className={last ? "truncate font-bold text-navy" : "font-semibold whitespace-nowrap text-navy/45"} aria-current={last ? "page" : undefined}>
                      {c}
                    </span>
                    {!last && <ChevronRight size={14} className="shrink-0 text-navy/25" />}
                  </li>
                );
              })}
            </ol>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:gap-3">{topbarRight}</div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-6 md:py-8 lg:px-8">
          {beforeContent}
          <Suspense
            fallback={
              <div className="space-y-6" aria-busy="true">
                <Skeleton className="h-9 w-72" />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <Skeleton className="h-32 rounded-card" />
                  <Skeleton className="h-32 rounded-card" />
                  <Skeleton className="h-32 rounded-card" />
                </div>
                <Skeleton className="h-80 rounded-card" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
