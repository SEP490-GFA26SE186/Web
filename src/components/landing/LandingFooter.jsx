import { Link } from "react-router-dom";
import { Ban, ShieldCheck } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { scrollToSection } from "./scroll";

const COLUMNS = [
  {
    title: "Nền tảng",
    links: [
      { label: "Giới thiệu chung", section: "gioi-thieu" },
      { label: "Cách hoạt động", section: "cach-hoat-dong" },
      { label: "Khung chuẩn CASEL", section: "mo-hinh-casel" },
      { label: "Trải nghiệm Kid Mode", to: ROUTES.KID.story("s_101") },
    ],
  },
  {
    title: "Dành cho bạn",
    links: [
      { label: "Phụ huynh & Gia đình", section: "danh-cho-gia-dinh" },
      { label: "Cộng đồng Tác giả", section: "cong-dong" },
      { label: "Góc chuyên gia EQ", to: "/goc-chuyen-gia" },
      { label: "Thư viện truyện tương tác", to: ROUTES.PARENT.EXPLORE },
    ],
  },
];

const linkClass = "text-left text-sm text-navy/65 transition hover:text-navy";

function LandingFooter() {
  return (
    <footer className="mt-10 w-full bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 pb-8 md:grid-cols-12">
          <div className="flex flex-col gap-4 md:col-span-5">
            <span className="font-display text-2xl font-bold">
              StoryWeaver <span className="text-primary">AI</span>
            </span>
            <p className="max-w-md text-navy/70">
              Bảo vệ & nuôi dưỡng trí tuệ cảm xúc cho trẻ thông qua những câu
              chuyện tương tác cá nhân hóa, đồng hành cùng phụ huynh và nhà giáo
              dục xây dựng nền tảng vững chắc cho tương lai.
            </p>
            {/* <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-outline/70 px-4 py-1 text-xs font-bold text-secondary-dark">
                <ShieldCheck size={16} /> COPPA Safe Certified
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-outline/70 px-4 py-1 text-xs font-bold text-secondary-dark">
                <Ban size={16} /> 100% No Ads
              </span>
            </div> */}
          </div>

          {COLUMNS.map((col) => (
            <nav
              key={col.title}
              className="flex flex-col gap-2 md:col-span-2"
              aria-label={col.title}
            >
              <span className="font-bold">{col.title}</span>
              {col.links.map((l) =>
                l.section ? (
                  <button
                    key={l.label}
                    onClick={() => scrollToSection(l.section)}
                    className={linkClass}
                  >
                    {l.label}
                  </button>
                ) : (
                  <Link key={l.label} to={l.to} className={linkClass}>
                    {l.label}
                  </Link>
                ),
              )}
            </nav>
          ))}

          <div className="flex flex-col gap-2 md:col-span-3">
            <span className="font-bold">Cam kết An toàn</span>
            <p className="text-sm text-navy/65">
              Môi trường không quảng cáo, không thu thập dữ liệu nhạy cảm, bảo
              vệ quyền riêng tư tuyệt đối cho trẻ thơ.
            </p>
            <Link to="/chinh-sach-bao-mat" className={`${linkClass} mt-1`}>
              Chính sách bảo mật trẻ em
            </Link>
            <Link to="/dieu-khoan-dich-vu" className={linkClass}>
              Điều khoản dịch vụ
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-outline pt-6 text-center text-sm text-navy/60 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} StoryWeaver AI. Nền tảng kể chuyện nuôi
            dưỡng EQ thông minh cho trẻ em. Tất cả quyền được bảo lưu.
          </p>
          <span className="text-xs font-bold text-secondary-dark">
            Warm Modern Guardian
          </span>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
