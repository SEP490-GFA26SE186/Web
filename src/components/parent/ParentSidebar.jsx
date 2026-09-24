import { NavLink } from "react-router-dom";
import {
  BookOpen,
  Compass,
  CreditCard,
  HelpCircle,
  LayoutGrid,
  PenTool,
  Settings,
  Smile,
  Store,
  TrendingUp,
  UsersRound,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { ROUTES } from "../../constants/routes";
import { useParentProfile } from "../../hooks/useParent";

const mainNav = [
  { to: ROUTES.PARENT.DASHBOARD, label: "Tổng quan", icon: LayoutGrid, end: true },
  { to: ROUTES.PARENT.LIBRARY, label: "Tủ sách", icon: BookOpen },
  { to: ROUTES.PARENT.EXPLORE, label: "Khám phá", icon: Compass },
  { to: ROUTES.PARENT.CHILDREN, label: "Bé nhà mình", icon: Smile },
  { to: ROUTES.PARENT.FAMILY_CHARACTERS, label: "Nhân vật gia đình", icon: UsersRound },
  { to: ROUTES.PARENT.STUDIO, label: "Sáng tác truyện", icon: PenTool },
  { to: ROUTES.PARENT.EQ_JOURNEY, label: "Hành trình EQ", icon: TrendingUp },
  { to: ROUTES.PARENT.MARKETPLACE, label: "Chợ truyện", icon: Store },
  { to: ROUTES.PARENT.BILLING, label: "Gói & AI Credits", icon: CreditCard },
];

const bottomNav = [
  { to: ROUTES.PARENT.HELP, label: "Trợ giúp", icon: HelpCircle },
  { to: ROUTES.PARENT.SETTINGS, label: "Cài đặt", icon: Settings },
];

function NavItem({ to, label, icon: Icon, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-semibold transition ${
          isActive
            ? "bg-primary text-white shadow-mid"
            : "text-navy/80 hover:bg-primary-tint hover:text-primary-dark"
        }`
      }
    >
      <Icon size={18} strokeWidth={2.2} />
      {label}
    </NavLink>
  );
}

function ParentSidebar({ open, onClose }) {
  const { data: parent } = useParentProfile();

  return (
    <>
      {/* overlay cho màn nhỏ */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-navy/30 backdrop-blur-sm transition lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-outline bg-white px-4 py-5 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center gap-3 px-2">
          <img src={logo} alt="StoryWeaver" className="h-11 w-11 rounded-full" />
          <div className="leading-tight">
            <p className="font-display text-lg font-bold text-primary">StoryWeaver</p>
            <p className="text-[11px] font-extrabold tracking-wider text-secondary">
              NUÔI DƯỠNG EQ
            </p>
          </div>
          <button onClick={onClose} className="ml-auto rounded-full p-1 lg:hidden" aria-label="Đóng menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onClose} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          {bottomNav.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onClose} />
          ))}

          {parent && (
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-surface p-3">
              <img src={parent.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              <div className="leading-tight">
                <p className="text-sm font-bold">{parent.name}</p>
                <p className="text-xs font-bold text-secondary">{parent.plan} ✨</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default ParentSidebar;
