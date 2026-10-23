import { Bot, CheckCircle2, ClipboardCheck, FilePenLine, PenLine, ShieldCheck } from "lucide-react";
import { STORY_LENGTH_LABELS } from "../../constants/casel";
import { ROUTES } from "../../constants/routes";
import { Badge, Button, Card, CardHeader, EmptyState } from "../ui";
import CaselTag from "./library/CaselTag";

// Truyện riêng đã tạo xong, ba mẹ phải xem lại hết từng trang trước khi đưa lên giá sách của bé.
// Schema rev8 chỉ lưu reviewed_at (đã xem xong hay chưa), không lưu đã xem bao nhiêu trang.
function DraftReviewCard({ draft, moreCount = 0 }) {
  const reviewUrl = draft ? ROUTES.PARENT.studioStory(draft.id) : ROUTES.PARENT.STUDIO;
  const total = draft ? moreCount + 1 : 0;

  return (
    <Card reveal index={5} className="flex flex-1 flex-col">
      <CardHeader
        icon={ClipboardCheck}
        title="Truyện chờ ba mẹ xem lại"
        action={total > 0 && <Badge tone="solidPrimary">{total}</Badge>}
        className="mb-5"
      />

      <div className="flex flex-1 flex-col">
        {!draft ? (
          <EmptyState
            icon={CheckCircle2}
            tone="secondary"
            title="Không có truyện nào đang chờ"
            description="Mọi truyện ba mẹ tạo đều đã được xem lại."
            className="flex-1 justify-center rounded-2xl bg-secondary-tint/40"
          />
        ) : (
          <>
            <article className="space-y-3 rounded-2xl border border-navy/[0.06] bg-surface/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CaselTag competency={draft.topic?.competency} className="bg-white" />
                <Badge tone="neutral" icon={draft.mode === "ai" ? Bot : PenLine}>
                  {draft.mode === "ai" ? "AI viết giúp" : "Tự viết"}
                </Badge>
              </div>
              <div>
                <h3 className="text-lg leading-snug">{draft.title}</h3>
                {draft.topic && (
                  <p className="mt-1 text-sm text-navy/60">
                    Bài học: <span className="font-semibold text-navy">{draft.topic.title}</span>
                  </p>
                )}
              </div>
              <dl className="grid grid-cols-3 gap-2 border-t border-navy/[0.06] pt-3 text-center">
                <div>
                  <dt className="text-[11px] text-navy/50">Số trang</dt>
                  <dd className="text-sm font-bold tabular-nums">{draft.pageCount}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-navy/50">Độ dài</dt>
                  <dd className="text-sm font-bold">{STORY_LENGTH_LABELS[draft.length]}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-navy/50">Điểm dừng</dt>
                  <dd className="text-sm font-bold tabular-nums">{draft.checkpointCount}</dd>
                </div>
              </dl>
            </article>

            <div className="mt-4 flex flex-col gap-2">
              <Button size="lg" icon={FilePenLine} to={reviewUrl} className="w-full">
                Xem lại & hoàn tất
              </Button>
              {moreCount > 0 && (
                <Button variant="ghost" to={ROUTES.PARENT.STUDIO} className="w-full">
                  Còn {moreCount} truyện khác đang chờ
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <p className="mt-5 flex items-start gap-2 border-t border-navy/[0.06] pt-4 text-xs text-navy/55">
        <ShieldCheck size={15} className="mt-px shrink-0 text-secondary" />
        Tên thật của bé được che trước khi gửi AI. Ba mẹ xem lại mọi trang trước khi bé đọc.
      </p>
    </Card>
  );
}

export default DraftReviewCard;
