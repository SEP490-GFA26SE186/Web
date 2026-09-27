import { useState } from "react";
import { AlertTriangle, Brain, Brush, Info, Loader2, Lock, PlusCircle, RefreshCw, ShieldCheck, Volume2 } from "lucide-react";
import Modal from "../../common/Modal";
import Switch from "../../common/Switch";
import { useRotateKey } from "../../../hooks/useAdmin";
import { toast } from "../../../stores/toastStore";

const ICONS = { brain: Brain, brush: Brush, voice: Volume2 };
const TONES = {
  primary: { icon: "bg-primary-tint text-primary-dark", tag: "bg-primary-tint text-primary-dark", bar: "bg-primary-dark" },
  secondary: { icon: "bg-secondary-tint text-secondary-dark", tag: "bg-secondary-tint text-secondary-dark", bar: "bg-secondary" },
  navy: { icon: "bg-navy-tint text-navy-soft", tag: "bg-navy-tint text-navy-soft", bar: "bg-secondary" },
};

function ProviderCard({ provider, onRotate }) {
  const [showInfo, setShowInfo] = useState(false);
  const Icon = ICONS[provider.icon];
  const tone = TONES[provider.tone];
  const usage = (provider.spentUsd / provider.quotaUsd) * 100;

  return (
    <article className="flex flex-col gap-4 rounded-card bg-white p-5 shadow-low transition hover:shadow-mid">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${tone.icon}`}>
            <Icon size={22} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg">{provider.name}</h3>
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tone.tag}`}>{provider.tag}</span>
            </div>
            <p className="text-sm text-navy/60">{provider.models}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-bold text-secondary-dark">
          <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" /> {provider.status}
        </span>
      </div>

      <div className="flex flex-col justify-between gap-3 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-navy/60 uppercase">{provider.keyLabel}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded bg-outline/70 px-2 py-0.5 font-mono text-sm">{provider.keyMasked}</code>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-tint px-2 py-0.5 text-[11px] font-bold text-secondary-dark">
              <Lock size={12} /> Đã mã hóa KMS
            </span>
          </div>
          {showInfo && (
            <p className="mt-2 text-xs text-navy/60">
              Khóa gốc chỉ nằm trong KMS, giao diện không bao giờ hiển thị đầy đủ. Xoay vòng gần nhất: <b>{provider.lastRotated}</b>
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onRotate(provider)} className="rounded-full bg-outline/70 px-4 py-1.5 text-xs font-semibold transition hover:bg-outline">
            Xoay vòng khóa (Rotate)
          </button>
          <button
            onClick={() => setShowInfo((v) => !v)}
            aria-label="Thông tin khóa"
            aria-pressed={showInfo}
            className="rounded-full p-1.5 text-navy/60 hover:bg-outline/60 hover:text-navy"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-navy/65">
        <span>
          Hạn ngạch tiêu thụ tháng: <strong className="text-navy">{provider.spentUsd.toFixed(2)}$</strong> / {provider.quotaUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}$
        </span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-outline" title={`${usage.toFixed(1)}%`}>
          <div className={`h-full rounded-full ${usage > 80 ? "bg-danger" : tone.bar}`} style={{ width: `${usage}%` }} />
        </div>
      </div>
    </article>
  );
}

export function ProvidersSection({ providers }) {
  const [rotating, setRotating] = useState(null);
  const rotate = useRotateKey();

  const confirmRotate = () =>
    rotate.mutate(rotating.id, {
      onSuccess: (p) => {
        toast.success(`Đã xoay vòng khóa ${p.name}. Khóa cũ hết hiệu lực sau 5 phút.`);
        setRotating(null);
      },
      onError: () => toast.error("Xoay vòng khóa thất bại"),
    });

  return (
    <section id="section-providers" className="flex scroll-mt-24 flex-col gap-4 xl:col-span-7">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-3 text-lg">
          <span className="h-6 w-3 rounded-full bg-secondary" /> Nhà Cung Cấp & Khóa API An Toàn
        </h2>
        <button
          onClick={() => toast.info("Thêm Provider mới cần quyền Super Admin + xác thực 2 lớp (sẽ có ở bản sau)")}
          className="flex shrink-0 items-center gap-1 text-sm font-bold text-primary-dark hover:underline"
        >
          <PlusCircle size={16} /> Thêm Provider
        </button>
      </div>
      {providers.map((p) => (
        <ProviderCard key={p.id} provider={p} onRotate={setRotating} />
      ))}

      {rotating && (
        <Modal
          open
          onClose={() => !rotate.isPending && setRotating(null)}
          title={`Xoay vòng khóa ${rotating.name}?`}
          description="Hệ thống tạo khóa mới trong KMS và chuyển toàn bộ lưu lượng sang khóa mới."
          size="max-w-md"
          footer={
            <>
              <button onClick={() => setRotating(null)} disabled={rotate.isPending} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
                Hủy
              </button>
              <button
                onClick={confirmRotate}
                disabled={rotate.isPending}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-dark px-5 py-2.5 text-sm font-bold text-white hover:bg-primary disabled:opacity-60"
              >
                {rotate.isPending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} Xoay vòng ngay
              </button>
            </>
          }
        >
          <p className="flex items-start gap-2 rounded-2xl bg-primary-tint p-3 text-sm text-primary-dark">
            <AlertTriangle size={17} className="mt-0.5 shrink-0" />
            Khóa hiện tại <code className="font-mono">{rotating.keyMasked}</code> sẽ hết hiệu lực sau 5 phút. Các job đang chạy vẫn được hoàn tất.
          </p>
        </Modal>
      )}
    </section>
  );
}

export function GuardrailsSection({ guardrails, onChange }) {
  const g = guardrails;
  const invalidLimit = !(g.imagesPerHour >= 1 && g.imagesPerHour <= 500);

  return (
    <section id="section-guardrails" className="flex scroll-mt-24 flex-col gap-4 xl:col-span-5">
      <h2 className="flex items-center gap-3 text-lg">
        <span className="h-6 w-3 rounded-full bg-primary" /> Hạn Mức & Phòng Vệ Lạm Dụng (Circuit Breakers)
      </h2>
      <div className="flex flex-col overflow-hidden rounded-card bg-white shadow-low">
        <div className="flex flex-col gap-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold">Hạn mức sinh ảnh tối đa mỗi tài khoản/giờ</p>
              <p className="text-sm text-navy/60">Ngăn chặn spam script hoặc hành vi trẻ bấm liên tục</p>
            </div>
            <Switch checked={g.rateLimitEnabled} onChange={(v) => onChange({ rateLimitEnabled: v })} label="Bật hạn mức sinh ảnh" />
          </div>
          <label className={`mt-1 flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 ${!g.rateLimitEnabled ? "opacity-50" : ""} ${invalidLimit ? "ring-2 ring-danger/50" : ""}`}>
            <input
              type="number"
              min={1}
              max={500}
              disabled={!g.rateLimitEnabled}
              value={g.imagesPerHour}
              onChange={(e) => onChange({ imagesPerHour: Number(e.target.value) })}
              className="w-16 bg-transparent text-center font-display text-lg font-bold outline-none"
            />
            <span className="text-sm text-navy/60">lần tạo ảnh / 60 phút</span>
          </label>
          {invalidLimit && <p className="text-xs font-semibold text-danger">Giá trị hợp lệ từ 1 đến 500.</p>}
          <p className="rounded-xl bg-surface px-3 py-1.5 text-xs text-navy/60">
            * Vượt ngưỡng {g.imagesPerHour || "?"} lần: Hệ thống tạm dừng {g.cooldownMinutes} phút & gửi cảnh báo tới Kiểm duyệt viên.
          </p>
        </div>

        <div className="flex flex-col gap-2 bg-surface/60 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold">Tự động ngắt kết nối dự phòng (Auto-failover)</p>
              <p className="text-sm text-navy/60">Bảo vệ trải nghiệm đọc truyện liên tục cho bé</p>
            </div>
            <Switch checked={g.autoFailover} onChange={(v) => onChange({ autoFailover: v })} label="Bật auto-failover" />
          </div>
          <p className="flex items-start gap-1.5 text-sm">
            <AlertTriangle size={17} className="mt-0.5 shrink-0 text-primary" />
            <span>
              Nếu <strong className="text-primary-dark">{g.failoverFrom} lỗi &gt; {g.failoverErrorRate}%</strong> trong {g.failoverWindowMinutes} phút liên tiếp:
              Tự động chuyển toàn bộ luồng tạo dàn ý sang <strong className="text-secondary-dark">{g.failoverTo}</strong>.
            </span>
          </p>
          <p className={`flex items-center gap-2 text-xs font-semibold ${g.autoFailover ? "text-secondary-dark" : "text-danger"}`}>
            <span className={`h-2 w-2 rounded-full ${g.autoFailover ? "bg-secondary" : "bg-danger"}`} />
            Bộ ngắt mạch hiện tại: {g.autoFailover ? "SẴN SÀNG" : "ĐÃ TẮT"} (Lần kích hoạt gần nhất: {g.failoverLastTriggered})
          </p>
        </div>

        <div className="flex flex-col gap-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex flex-wrap items-center gap-1.5 text-sm font-bold">
                Mặt nạ hóa dữ liệu trẻ em (COPPA Masking)
                <span className="rounded-full bg-secondary-tint px-2 py-0.5 text-xs text-secondary-dark">Bắt buộc</span>
              </p>
              <p className="text-sm text-navy/60">Lược bỏ tên thật, địa chỉ, tuổi chính xác trước khi gửi payload AI</p>
            </div>
            <span title="Quy định pháp lý bắt buộc — không thể tắt">
              <Switch checked disabled onChange={() => {}} label="COPPA Masking (bắt buộc)" />
            </span>
          </div>
          <p className="flex items-center gap-2 rounded-xl bg-surface p-2 text-xs text-navy/65">
            <ShieldCheck size={18} className="shrink-0 text-secondary" />
            Mẫu ẩn danh: <code className="font-mono text-primary-dark">[BÉ_AN_6T] → &lt;CHILD_AVATAR_#942&gt;</code>
          </p>
        </div>

        <div className="m-5 mt-0 flex items-center justify-between rounded-2xl bg-primary-tint/70 p-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-primary-dark uppercase">Độ trễ phản hồi bình quân</p>
            <p className="font-display text-2xl font-bold text-primary-dark">{g.avgLatency}s</p>
            <p className="text-sm text-navy/60">Thời gian sinh 1 trang hoàn chỉnh</p>
          </div>
          <svg viewBox="0 0 100 40" className="h-12 w-24 text-primary-dark" fill="none" aria-hidden="true">
            <path d="M0 30 Q 15 32, 30 18 T 60 22 T 85 10 T 100 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="85" cy="10" r="3.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  );
}
