import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import logo from "../../assets/logo.png";

const badgeTones = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  danger: "bg-danger text-white",
};

/**
 * Sidebar dùng chung cho cổng Kiểm duyệt & Admin.
 * sections: [{ title?, items: [{ to, label, icon, end?, badge?, badgeTone? }] }]
 */
function PortalSidebar({ open, onClose, roleBadge, subtitle, sections, activeClass, footer }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-navy/30 backdrop-blur-sm transition lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-surface shadow-low transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 pt-5 pb-4">
          <img src={logo} alt="StoryWeaver" className="h-10 w-10 rounded-full" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold">StoryWeaver</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wider ${roleBadge.className}`}>
                {roleBadge.label}
              </span>
            </div>
            <p className="text-xs font-semibold text-navy/60">{subtitle}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 lg:hidden" aria-label="Đóng menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
          {sections.map((section, i) => (
            <div key={section.title ?? i} className="flex flex-col gap-0.5">
              {section.title && (
                <p className="px-3 pt-1 pb-1.5 text-[11px] font-extrabold tracking-wider text-navy/50 uppercase">
                  {section.title}
                </p>
              )}
              {section.items.map(({ to, label, icon: Icon, end, badge, badgeTone = "primary" }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                      isActive ? activeClass : "text-navy/75 hover:bg-outline/60 hover:text-navy"
                    }`
                  }
                >
                  <Icon size={19} className="shrink-0" />
                  <span className="flex-1 truncate">{label}</span>
                  {badge > 0 && (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${badgeTones[badgeTone]}`}>{badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {footer && <div className="m-3 rounded-card bg-outline/50 p-3">{footer}</div>}
      </aside>
    </>
  );
}

export default PortalSidebar;
