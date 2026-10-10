import { Suspense } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Lock, Sparkles, UserRound, Volume2, VolumeX } from "lucide-react";
import logo from "../assets/logo.png";
import { ParentGateDialog } from "../components/kid/KidDialogs";
import { ROUTES } from "../constants/routes";
import { useSelectedChild } from "../hooks/useChildProfile";
import useKidStore from "../stores/kidStore";
import { childEmoji } from "../utils/child";
import { stopSpeaking } from "../utils/speech";

const NAV = [
  { to: ROUTES.KID.READER, label: "Khu Vườn Phép Thuật" },
  { to: ROUTES.KID.BOOKSHELF, label: "Tủ Sách Bé Ngoan" },
];

const iconBtn = "grid h-11 w-11 place-items-center rounded-full bg-surface shadow-low transition hover:bg-outline";

// Chế độ Trẻ Em: không sidebar, nút to, thoát ra ngoài phải qua cổng PIN của ba mẹ
function KidLayout() {
  const navigate = useNavigate();
  const { muted, toggleMuted, parentGateOpen, setParentGateOpen } = useKidStore();
  const { child } = useSelectedChild();

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="fixed top-0 z-40 w-full bg-canvas/90 shadow-low backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 lg:px-12">
          <div className="flex items-center gap-3">
            <Link to={ROUTES.KID.BOOKSHELF} aria-label="Về tủ sách" className="group grid h-12 w-12 place-items-center rounded-full bg-surface shadow-low transition hover:bg-outline">
              <ArrowLeft size={24} className="text-primary transition-transform group-hover:-translate-x-0.5" />
            </Link>
            <img src={logo} alt="" className="h-9 w-9 rounded-full" />
            <span className="hidden font-display text-lg font-bold text-primary-dark sm:inline">StoryWeaver</span>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 rounded-full bg-surface px-1.5 py-1.5 shadow-low md:flex">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-1.5 text-sm transition ${isActive ? "bg-primary font-bold text-white" : "font-semibold text-navy/60 hover:text-navy"}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
            {child && (
              <span className="hidden items-center gap-1.5 rounded-full bg-secondary-tint px-4 py-1.5 text-sm font-bold text-secondary-dark lg:flex">
                <BookOpen size={17} className="text-secondary" /> {child.completedSessionsCount} truyện đã đọc xong
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!muted) stopSpeaking();
                toggleMuted();
              }}
              aria-pressed={!muted}
              aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
              className={`${iconBtn} ${muted ? "text-navy/40" : "text-secondary"}`}
            >
              {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>
            <button onClick={() => setParentGateOpen(true)} className="flex items-center gap-1.5 rounded-full bg-surface px-4 py-2.5 text-navy/60 shadow-low transition hover:bg-outline hover:text-navy">
              <Lock size={17} /> <span className="hidden text-xs font-bold lg:inline">Bố Mẹ</span>
            </button>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-lg text-white">
              {child ? childEmoji(child) : <UserRound size={18} />}
            </span>
          </div>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col pt-20">
        <Suspense fallback={<div className="mx-auto mt-6 h-96 w-full max-w-7xl animate-pulse rounded-stage bg-surface" />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="w-full bg-surface/70 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-center text-xs text-navy/60 sm:flex-row sm:text-left lg:px-12">
          <span className="flex items-center gap-1">
            <Sparkles size={15} className="text-primary" /> Không gian đọc truyện an toàn và diệu kỳ dành cho Bé Yêu
          </span>
          <span>© StoryWeaver AI • Chế độ Trẻ Em</span>
        </div>
      </footer>

      {parentGateOpen && (
        <ParentGateDialog
          onClose={() => setParentGateOpen(false)}
          onUnlock={() => {
            stopSpeaking();
            setParentGateOpen(false);
            navigate(ROUTES.PARENT.DASHBOARD);
          }}
        />
      )}
    </div>
  );
}

export default KidLayout;
