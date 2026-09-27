import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";
import { LANDING_NAV } from "../../constants/landingContent";
import { ROUTES } from "../../constants/routes";
import { scrollToSection } from "./scroll";

// Theo dõi section đang hiển thị để tô sáng mục menu tương ứng
function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const NAV_IDS = LANDING_NAV.map((n) => n.id);

function LandingHeader() {
  const active = useActiveSection(NAV_IDS);
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-canvas/90 shadow-low backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-4 md:px-8">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2" aria-label="Về đầu trang">
          <img src={logo} alt="" className="h-10 w-10 rounded-full" />
          <span className="font-display text-xl font-bold tracking-tight">
            StoryWeaver <span className="text-primary">AI</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Điều hướng trang">
          {LANDING_NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              aria-current={active === n.id ? "true" : undefined}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                active === n.id ? "bg-surface font-bold text-primary-dark" : "font-semibold text-navy/65 hover:text-navy"
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.KID.story("s_101")}
            className="hidden rounded-full bg-secondary-tint px-4 py-2 text-sm font-bold text-secondary-dark transition hover:bg-secondary hover:text-white sm:inline-flex"
          >
            Dùng thử Kid Mode
          </Link>
          <Link to={ROUTES.LOGIN} className="btn-primary px-5 py-2 text-sm">
            Đăng nhập / Đăng ký
          </Link>
          <button onClick={() => setMenuOpen((v) => !v)} className="rounded-full p-2 hover:bg-surface xl:hidden" aria-label="Mở menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-outline bg-canvas px-4 py-3 xl:hidden" aria-label="Điều hướng trang (di động)">
          {LANDING_NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`block w-full rounded-2xl px-4 py-3 text-left font-semibold ${active === n.id ? "bg-surface text-primary-dark" : "hover:bg-surface"}`}
            >
              {n.label}
            </button>
          ))}
          <Link to={ROUTES.KID.story("s_101")} className="mt-1 block rounded-2xl px-4 py-3 font-bold text-secondary-dark hover:bg-secondary-tint sm:hidden">
            Dùng thử Kid Mode
          </Link>
        </nav>
      )}
    </header>
  );
}

export default LandingHeader;
