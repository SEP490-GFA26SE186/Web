import { Bell, ChevronDown, ChevronRight, Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";

// Header dùng chung cho cổng Kiểm duyệt & Admin
function PortalHeader({ onOpenMenu, breadcrumbs = [], searchPlaceholder, status, links, user }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 bg-canvas/90 px-4 shadow-low backdrop-blur md:px-6">
      <button onClick={onOpenMenu} className="rounded-full p-2 hover:bg-surface lg:hidden" aria-label="Mở menu">
        <Menu size={22} />
      </button>

      <nav className="hidden items-center gap-1 text-sm text-navy/60 md:flex" aria-label="Breadcrumb">
        {breadcrumbs.map((b, i) => (
          <span key={b.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="text-navy/40" />}
            {b.to && i < breadcrumbs.length - 1 ? (
              <Link to={b.to} className="hover:text-navy">
                {b.label}
              </Link>
            ) : (
              <span className={i === breadcrumbs.length - 1 ? "font-bold text-navy" : ""}>{b.label}</span>
            )}
          </span>
        ))}
      </nav>

      {searchPlaceholder && (
        <label className="relative ml-2 hidden w-80 xl:block">
          <Search size={17} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-navy/40" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="w-full rounded-full border border-outline bg-white py-1.5 pr-4 pl-10 text-sm outline-none placeholder:text-navy/40 focus:border-secondary focus:ring-[3px] focus:ring-secondary/15"
          />
        </label>
      )}

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {status}
        {links && (
          <div className="hidden items-center gap-1 text-xs font-semibold text-navy/60 lg:flex">
            {links.map((l, i) => (
              <span key={l.to} className="flex items-center gap-1">
                {i > 0 && <span className="text-navy/20">|</span>}
                <Link to={l.to} className="rounded-full px-2 py-1 hover:text-primary-dark">
                  {l.label}
                </Link>
              </span>
            ))}
          </div>
        )}
        <button className="relative rounded-full p-2 hover:bg-surface" aria-label="Thông báo">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>
        {user && (
          <button className="flex items-center gap-1 rounded-full p-0.5 hover:bg-surface" aria-label="Tài khoản">
            <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            <ChevronDown size={16} className="text-navy/50" />
          </button>
        )}
      </div>
    </header>
  );
}

export default PortalHeader;
