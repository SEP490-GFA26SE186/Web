import { useState } from "react";
import { Bot, Loader2, Lock, Unlock } from "lucide-react";
import { formatDateTime } from "../../constants/moderation";
import { useAiFlags, useSetAiBlock } from "../../hooks/useSpecialist";
import { toast } from "../../stores/toastStore";
import { Select } from "../../components/ui";

const WINDOWS = [7, 14, 30];

function BlockForm({ flag, onDone }) {
  const [days, setDays] = useState(3);
  const [reason, setReason] = useState("");
  const block = useSetAiBlock();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        block.mutate(
          { userId: flag.userId, days, reason: reason.trim() || undefined },
          { onSuccess: () => { toast.success(`Đã tạm khoá quyền dùng AI ${days} ngày`); onDone(); }, onError: (err) => toast.error(err.message) },
        );
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <Select
        value={days}
        onChange={setDays}
        label="Số ngày khoá"
        shape="pill"
        size="sm"
        width="w-28"
        options={[1, 3, 7, 14, 30].map((d) => ({ value: d, label: `${d} ngày` }))}
      />
      <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Lý do (ghi nhật ký)" aria-label="Lý do" className="min-w-48 flex-1 rounded-full border-[1.5px] border-outline px-4 py-1.5 text-sm" />
      <button type="submit" disabled={block.isPending} className="inline-flex items-center gap-1 rounded-full bg-danger px-4 py-1.5 text-sm font-bold text-white disabled:opacity-60">
        {block.isPending ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />} Khoá
      </button>
      <button type="button" onClick={onDone} className="text-sm text-navy/50">Huỷ</button>
    </form>
  );
}

// Cảnh báo AI (luồng 7.6): phụ huynh có nhiều lượt AI bị chặn (nội dung không an toàn / từ khoá cấm).
// Chuyên gia tạm khoá riêng quyền dùng AI — phụ huynh vẫn đọc truyện, tự viết truyện được.
function AiFlagsPage() {
  const [days, setDays] = useState(7);
  const [min, setMin] = useState(2);
  const [blocking, setBlocking] = useState(null);
  const { data, isLoading, error } = useAiFlags({ days, min });
  const unblock = useSetAiBlock();
  const flags = data?.flags ?? [];

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-danger">
          <Bot size={16} /> Giám sát
        </p>
        <h1 className="text-3xl">Cảnh báo AI</h1>
        <p className="mt-1 max-w-2xl text-navy/70">
          Phụ huynh có nhiều lần yêu cầu AI viết nội dung bị chặn (từ khoá cấm, nội dung không phù hợp cho trẻ). Tạm khoá chỉ chặn AI viết truyện — phụ huynh vẫn đọc và tự viết được.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-semibold">Trong</span>
        {WINDOWS.map((d) => (
          <button key={d} type="button" aria-pressed={days === d} onClick={() => setDays(d)} className={`rounded-full px-3 py-1 font-bold ${days === d ? "bg-primary text-white" : "bg-surface text-navy/70"}`}>
            {d} ngày
          </button>
        ))}
        <label className="flex items-center gap-2">
          có từ
          <input type="number" min={1} max={100} value={min} onChange={(e) => setMin(Math.max(1, Number(e.target.value) || 1))} aria-label="Số lượt bị chặn tối thiểu" className="w-16 rounded-full border-[1.5px] border-outline px-3 py-1" />
          lượt bị chặn
        </label>
      </div>

      <section className="card overflow-hidden">
        {isLoading && <Loader2 size={26} className="m-5 animate-spin text-primary" />}
        {error && <p className="p-5 text-danger">{error.message}</p>}
        {!isLoading && !error && flags.length === 0 && <p className="p-8 text-center text-navy/60">Không có phụ huynh nào bị gắn cờ ✨</p>}
        <ul className="divide-y divide-outline">
          {flags.map((f) => (
            <li key={f.userId} className="space-y-2 px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold">{f.fullName || f.email}</p>
                <span className="text-sm text-navy/50">{f.email}</span>
                {f.aiBlockedUntil && <span className="rounded-full bg-danger px-2 py-0.5 text-xs font-bold text-white">Khoá AI đến {formatDateTime(f.aiBlockedUntil)}</span>}
              </div>
              <p className="text-sm text-navy/70">
                <b className="text-danger">{f.blocked} lượt bị chặn</b> / {f.total} lượt gọi AI ({f.blockedRate}%) • {f.failed} lượt lỗi
              </p>
              {f.lastBlocked && (
                <p className="rounded-card bg-surface px-3 py-2 text-sm">
                  Gần nhất {formatDateTime(f.lastBlocked.at)}{f.lastBlocked.storyTitle && ` — truyện “${f.lastBlocked.storyTitle}”`}: <span className="text-navy/70">{f.lastBlocked.reason}</span>
                </p>
              )}
              {blocking === f.userId ? (
                <BlockForm flag={f} onDone={() => setBlocking(null)} />
              ) : f.aiBlockedUntil ? (
                <button
                  type="button"
                  disabled={unblock.isPending}
                  onClick={() => unblock.mutate({ userId: f.userId, days: 0 }, { onSuccess: () => toast.success("Đã mở khoá quyền dùng AI"), onError: (e) => toast.error(e.message) })}
                  className="inline-flex items-center gap-1 rounded-full bg-surface px-4 py-1.5 text-sm font-bold hover:bg-outline"
                >
                  <Unlock size={14} /> Mở khoá
                </button>
              ) : (
                <button type="button" onClick={() => setBlocking(f.userId)} className="inline-flex items-center gap-1 rounded-full bg-surface px-4 py-1.5 text-sm font-bold text-danger hover:bg-danger-tint">
                  <Lock size={14} /> Tạm khoá quyền dùng AI
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AiFlagsPage;
