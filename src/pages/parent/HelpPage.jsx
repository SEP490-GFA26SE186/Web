import { Link } from "react-router-dom";
import { FileText, HelpCircle, ShieldCheck } from "lucide-react";
import { FAQS } from "../../constants/landingContent";

// Trợ giúp: câu hỏi thường gặp (dùng chung nội dung với trang chủ) + chính sách.
function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
          <HelpCircle size={16} /> Trợ giúp
        </p>
        <h1 className="text-3xl">Ba mẹ cần giúp gì?</h1>
      </div>
      <div className="space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="card group p-5">
            <summary className="cursor-pointer list-none font-display text-lg font-bold">{f.q}</summary>
            <p className="mt-2 text-navy/75">{f.a}</p>
          </details>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/chinh-sach-bao-mat" className="card flex items-center gap-3 p-5 transition hover:shadow-mid">
          <ShieldCheck size={24} className="text-secondary" /> <span className="font-bold">Chính sách bảo mật</span>
        </Link>
        <Link to="/dieu-khoan-dich-vu" className="card flex items-center gap-3 p-5 transition hover:shadow-mid">
          <FileText size={24} className="text-primary" /> <span className="font-bold">Điều khoản dịch vụ</span>
        </Link>
      </div>
    </div>
  );
}

export default HelpPage;
