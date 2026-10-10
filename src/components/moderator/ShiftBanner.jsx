import { useState } from "react";
import { AlertTriangle, PlayCircle, SearchCheck, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import { ROUTES } from "../../constants/routes";
import { toast } from "../../stores/toastStore";

function IncidentModal({ open, onClose }) {
  const [text, setText] = useState("");
  const submit = () => {
    if (!text.trim()) return;
    // TODO: gọi API báo cáo sự cố khi BE sẵn sàng
    toast.success("Đã gửi báo cáo sự cố tới Trưởng ca & đội kỹ thuật");
    setText("");
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Báo cáo sự cố"
      description="Sự cố hệ thống, nội dung khẩn cấp hoặc vấn đề cần Trưởng ca hỗ trợ ngay"
      footer={
        <>
          <button onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button onClick={submit} disabled={!text.trim()} className="rounded-full bg-danger px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            Gửi báo cáo
          </button>
        </>
      }
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        autoFocus
        placeholder="Mô tả sự cố, mã truyện liên quan (nếu có)..."
        className="w-full resize-none rounded-2xl border-[1.5px] border-outline p-3 text-sm outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/15"
      />
    </Modal>
  );
}

function ShiftBanner({ shift, onStart, canStart }) {
  const [incidentOpen, setIncidentOpen] = useState(false);

  return (
    <section className="relative flex flex-col justify-between gap-5 overflow-hidden rounded-stage bg-surface p-6 shadow-low xl:flex-row xl:items-center">
      <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute right-48 -bottom-16 h-56 w-56 rounded-full bg-secondary/15 blur-2xl" />

      <div className="relative z-10 flex max-w-3xl flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-0.5 text-white">
            <SearchCheck size={14} /> {shift.name} ({shift.time})
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-0.5 text-navy/70">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Khu vực: {shift.region}
          </span>
          <span className="font-semibold text-navy/50">Mã ca: {shift.code}</span>
        </div>
        <h1 className="mt-1 text-3xl">Bàn làm việc Kiểm duyệt viên</h1>
        <p className="leading-relaxed text-navy/70">
          Bảo đảm môi trường an toàn, chất lượng sư phạm và chuẩn đạo đức cảm xúc CASEL cho hơn{" "}
          <strong className="text-navy">10,000 truyện tương tác</strong> và cộng đồng tác giả nhí StoryWeaver.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-2 xl:justify-end">
        <button onClick={onStart} disabled={!canStart} className="btn-primary py-2.5 disabled:opacity-50">
          <PlayCircle size={20} className="fill-white/25" /> Bắt đầu duyệt ca trực
        </button>
        <Link to={ROUTES.MODERATOR.GUIDELINES} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold shadow-low transition hover:bg-canvas">
          <ShieldCheck size={17} /> Xem quy chuẩn kiểm duyệt
        </Link>
        <button
          onClick={() => setIncidentOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-outline/70 px-4 py-2.5 text-sm font-semibold text-navy/70 transition hover:bg-danger-tint hover:text-danger"
        >
          <AlertTriangle size={17} /> Báo cáo sự cố
        </button>
      </div>

      <IncidentModal open={incidentOpen} onClose={() => setIncidentOpen(false)} />
    </section>
  );
}

export default ShiftBanner;
