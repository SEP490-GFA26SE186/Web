import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { APPEAL_STATUS, STRIKE_SOURCES, formatDate } from "../../../constants/moderation";
import { appealStrike, getMyStrikes } from "../../../services/sellingService";
import { toast } from "../../../stores/toastStore";

function AppealForm({ strikeId, onDone }) {
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const appeal = useMutation({
    mutationFn: () => appealStrike(strikeId, reason.trim()),
    onSuccess: () => {
      toast.success("Đã gửi kháng nghị, Admin sẽ xem xét");
      queryClient.invalidateQueries({ queryKey: ["selling", "strikes"] });
      onDone();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (reason.trim().length < 20) return toast.error("Lý do kháng nghị tối thiểu 20 ký tự");
        appeal.mutate();
      }}
      className="space-y-2"
    >
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        maxLength={2000}
        placeholder="Vì sao ba mẹ cho rằng cảnh cáo này chưa đúng? (tối thiểu 20 ký tự)"
        aria-label="Lý do kháng nghị"
        className="w-full resize-none rounded-card border-2 border-outline p-3 text-sm"
      />
      <div className="flex gap-2">
        <button type="submit" disabled={appeal.isPending} className="btn-primary px-4 py-2 text-sm">
          {appeal.isPending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Gửi kháng nghị
        </button>
        <button type="button" onClick={onDone} className="btn-ghost px-4 py-2 text-sm">
          Hủy
        </button>
      </div>
    </form>
  );
}

// Cảnh cáo của người bán: lý do, hạn hiệu lực, kháng nghị (mỗi cảnh cáo một lần, Admin xét).
function StrikesPanel() {
  const [appealing, setAppealing] = useState(null);
  const { data } = useQuery({ queryKey: ["selling", "strikes"], queryFn: getMyStrikes });
  if (!data?.strikes.length) return null;

  return (
    <section className="card space-y-3 p-6">
      <h2 className="flex items-center gap-2 text-lg">
        <AlertTriangle size={20} className="text-danger" /> Cảnh cáo ({data.activeStrikes}/{data.strikeLimit} còn hiệu lực)
      </h2>
      <p className="text-sm text-navy/60">
        Mỗi cảnh cáo có hiệu lực 90 ngày. Đủ {data.strikeLimit} cảnh cáo còn hiệu lực thì tài khoản bán bị khoá. Ba mẹ được kháng nghị mỗi cảnh cáo một lần.
      </p>
      <ul className="divide-y divide-outline">
        {data.strikes.map((s) => {
          const ap = s.appeal && APPEAL_STATUS[s.appeal.status];
          return (
            <li key={s.id} className="space-y-1.5 py-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <b>{STRIKE_SOURCES[s.source]}</b>
                <span className="text-navy/50">{formatDate(s.issuedAt)}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${s.active ? "bg-danger-tint text-danger" : "bg-navy-tint text-navy"}`}>
                  {s.revokedAt ? "Đã gỡ" : s.active ? `Hiệu lực đến ${formatDate(s.expiresAt)}` : "Hết hạn"}
                </span>
                {ap && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${ap.tone}`}>Kháng nghị: {ap.label}</span>}
              </div>
              <p className="text-sm text-navy/80">{s.reason}</p>
              {s.appeal?.decisionNote && <p className="text-sm text-navy/60">Admin: {s.appeal.decisionNote}</p>}
              {s.active && !s.appeal &&
                (appealing === s.id ? (
                  <AppealForm strikeId={s.id} onDone={() => setAppealing(null)} />
                ) : (
                  <button type="button" onClick={() => setAppealing(s.id)} className="text-sm font-bold text-primary hover:underline">
                    Kháng nghị cảnh cáo này
                  </button>
                ))}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default StrikesPanel;
