import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LandingFooter from "../landing/LandingFooter";
import LandingHeader from "../landing/LandingHeader";
import { LEGAL_EFFECTIVE_DATE, LEGAL_VERSION, SUPPORT_EMAIL } from "../../constants/legal";

/** Khung chung cho trang Chính sách / Điều khoản: mục lục + các mục đánh số. */
function LegalPage({ title, intro, sections }) {
  return (
    <div className="min-h-screen bg-canvas">
      <LandingHeader />
      <main className="mx-auto w-full max-w-4xl px-4 pt-28 pb-16 md:px-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-navy/60 hover:text-primary">
          <ArrowLeft size={16} /> Trang chủ
        </Link>
        <h1 className="mt-3 text-3xl sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-navy/55">
          Phiên bản {LEGAL_VERSION} • Hiệu lực từ {LEGAL_EFFECTIVE_DATE} • Áp dụng cho bản thử nghiệm của đồ án SEP490
        </p>
        <p className="mt-4 text-lg text-navy/75">{intro}</p>

        <nav aria-label="Mục lục" className="card mt-6 p-5">
          <p className="mb-2 font-bold">Mục lục</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#muc-${i + 1}`} className="text-primary-dark hover:underline">{s.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-8 space-y-8">
          {sections.map((s, i) => (
            <section key={s.title} id={`muc-${i + 1}`} className="scroll-mt-24 space-y-3">
              <h2 className="text-xl">
                {i + 1}. {s.title}
              </h2>
              {s.body.map((b, j) =>
                Array.isArray(b) ? (
                  <ul key={j} className="list-disc space-y-1.5 pl-6 text-navy/80">
                    {b.map((li) => <li key={li}>{li}</li>)}
                  </ul>
                ) : (
                  <p key={j} className="text-navy/80">{b}</p>
                ),
              )}
            </section>
          ))}
          <section className="rounded-card bg-surface p-5 text-sm text-navy/75">
            <p className="font-bold text-navy">Liên hệ</p>
            <p className="mt-1">
              {SUPPORT_EMAIL ? (
                <>Mọi câu hỏi về {title.toLowerCase()} xin gửi về <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-primary-dark">{SUPPORT_EMAIL}</a>.</>
              ) : (
                <>Mọi câu hỏi xin liên hệ nhóm phát triển StoryWeaver AI qua mục Trợ giúp sau khi đăng nhập.</>
              )}
            </p>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

export default LegalPage;
