import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpenCheck, ChevronRight, Info, Loader2, MessageCircleHeart, Search, Sparkles, TrendingUp } from "lucide-react";
import Modal from "../../components/common/Modal";
import { LevelBadge, RadarChart } from "../../components/parent/EqRadarCard";
import CaselTag from "../../components/parent/library/CaselTag";
import NoChildState from "../../components/parent/NoChildState";
import { CASEL } from "../../constants/casel";
import { EQ_LEVEL_ORDER, EQ_LEVELS, EQ_REPORT_NOTE, EVIDENCE_SOURCE_LABEL, NO_DATA_LABEL, levelLabel } from "../../constants/eqLevels";
import { ROUTES } from "../../constants/routes";
import { useChildEqJourney, useSelectedChild } from "../../hooks/useChildProfile";

const weekLabel = (d) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;
const vnDate = (d) => new Date(d).toLocaleDateString("vi-VN");

/** Chú giải thang mức (dùng chung cho radar và biểu đồ tuần). */
function LevelLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-navy/70">
      {EQ_LEVEL_ORDER.map((l) => (
        <span key={l} className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ background: EQ_LEVELS[l].fill }} /> {EQ_LEVELS[l].label}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded border border-dashed border-navy/30" /> {NO_DATA_LABEL}
      </span>
    </div>
  );
}

/**
 * Theo tuần: mỗi ô = một năng lực trong một tuần; số = số câu chấm trong tuần, màu = mức cuối tuần.
 * Không có điểm / %.
 */
function WeeklyTrend({ trend, competencies }) {
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-150 border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th className="w-44 text-left text-xs font-semibold text-navy/55">Năng lực</th>
              {trend.map((w) => (
                <th key={w.weekStart} className="text-center text-xs font-semibold text-navy/55" title={`Tuần bắt đầu ${vnDate(w.weekStart)}`}>
                  {weekLabel(w.weekStart)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {competencies.map((c) => (
              <tr key={c.caselCode}>
                <th scope="row" className="pr-2 text-left text-xs font-bold">
                  {CASEL[c.caselCode]?.short ?? c.nameVi}
                </th>
                {trend.map((w) => {
                  const cell = w.competencies[c.caselCode] ?? { items: 0, level: null };
                  const meta = EQ_LEVELS[cell.level];
                  const dark = cell.level === "developing" || cell.level === "secure";
                  return (
                    <td key={w.weekStart} className="p-0">
                      <div
                        title={`${c.nameVi}, tuần ${weekLabel(w.weekStart)}: ${cell.items} câu trong tuần, mức cuối tuần: ${levelLabel(cell.level)}`}
                        className={`grid h-9 place-items-center rounded-lg text-xs font-bold ${
                          meta ? (dark ? "text-white" : "text-navy") : "border border-dashed border-navy/20 text-navy/45"
                        }`}
                        style={meta ? { background: meta.fill } : undefined}
                      >
                        {cell.items ? `${cell.items} câu` : "–"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LevelLegend />
      <p className="text-xs text-navy/55">Số trong ô là số câu bé trả lời trong tuần; màu là mức của năng lực tính đến hết tuần đó.</p>
    </div>
  );
}

function EvidenceModal({ subSkill, evidence, onClose }) {
  return (
    <Modal
      open
      onClose={onClose}
      title={subSkill.nameVi}
      description={subSkill.caselTextEn ? `Theo khung CASEL: ${subSkill.nameVi} (${subSkill.caselTextEn})` : "Kỹ năng do chuyên gia bổ sung"}
      size="max-w-2xl"
    >
      {evidence.length === 0 ? (
        <p className="text-sm text-navy/60">Chưa có câu trả lời nào cho kỹ năng này.</p>
      ) : (
        <ul className="space-y-3">
          {evidence.map((e, i) => (
            <li key={i} className="space-y-1.5 rounded-2xl bg-surface p-4 text-sm">
              <p className="font-semibold">{e.question}</p>
              <p className="text-xs text-navy/60">
                Truyện “{e.storyTitle}” · {vnDate(e.answeredAt)}
              </p>
              {e.momentSummary && (
                <p className="rounded-xl bg-white px-3 py-1.5 text-xs text-navy/70">
                  Từ chuyện: <span className="font-semibold text-navy">{e.momentSummary}</span>
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                {e.firstChoiceText && (
                  <span>
                    Bé chọn lần đầu: <span className="font-semibold">{e.firstChoiceText}</span>
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    e.correctFirstTry ? "bg-secondary-tint text-secondary-dark" : "bg-primary-tint text-primary-dark"
                  }`}
                >
                  {e.correctFirstTry ? "Đúng ngay lần đầu" : e.usedHint ? "Cần gợi ý" : "Chưa chọn cách tốt nhất"}
                </span>
              </div>
              <p className="text-xs text-navy/50">Nguồn câu hỏi: {EVIDENCE_SOURCE_LABEL[e.source] ?? EVIDENCE_SOURCE_LABEL.ai_template}</p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

function CompetencyCard({ competency, evidenceBySub, windowSize, onShowEvidence }) {
  const meta = CASEL[competency.caselCode];
  const Icon = meta?.icon;
  return (
    <section className="card space-y-3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base">
          {Icon && <Icon size={18} className="text-secondary-dark" />} {competency.nameVi}
        </h3>
        <LevelBadge level={competency.level} />
      </div>
      {competency.subSkills.length === 0 ? (
        <p className="text-sm text-navy/55">Chưa có kỹ năng con.</p>
      ) : (
        <ul className="divide-y divide-outline">
          {competency.subSkills.map((s) => {
            const count = evidenceBySub.get(s.id)?.length ?? 0;
            return (
              <li key={s.id} className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{s.nameVi}</p>
                  {s.caselTextEn && <p className="text-xs italic text-navy/50">{s.caselTextEn}</p>}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <LevelBadge level={s.level} />
                  <span className="text-xs text-navy/50" title={`Xét ${windowSize} câu gần nhất`}>
                    {s.items} câu
                  </span>
                  <button
                    type="button"
                    onClick={() => onShowEvidence(s)}
                    disabled={!count}
                    className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-bold text-primary-dark hover:bg-primary-tint disabled:cursor-not-allowed disabled:text-navy/35 disabled:hover:bg-surface"
                  >
                    <Search size={13} /> Xem bằng chứng
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// Báo cáo EQ (luồng 5.6, spec sư phạm CASEL §7): mức độ theo kỹ năng con, gộp lên 5 năng lực; bằng chứng;
// gợi ý trò chuyện; chuyện mẫu nên đọc tiếp; theo tuần. Chỉ lượt đọc đầu, câu không bị chuyên gia gắn cờ.
function EqJourneyPage() {
  const { child, isEmpty } = useSelectedChild();
  const [weeks, setWeeks] = useState(8);
  const [evidenceFor, setEvidenceFor] = useState(null);
  const { data: r, isLoading, error, isFetching } = useChildEqJourney(child?.id, weeks);

  const evidenceBySub = useMemo(() => {
    const m = new Map();
    for (const e of r?.evidence ?? []) m.set(e.subSkillId, [...(m.get(e.subSkillId) ?? []), e]);
    return m;
  }, [r?.evidence]);
  const subSkillName = useMemo(
    () => new Map((r?.competencies ?? []).flatMap((c) => c.subSkills.map((s) => [s.id, s.nameVi]))),
    [r?.competencies],
  );

  if (isEmpty) return <NoChildState />;
  if (isLoading || !child) return <Loader2 size={32} className="animate-spin text-primary" />;
  if (error) return <p className="card p-6 text-danger">{error.message}</p>;

  const hasAnyLevel = r.competencies.some((c) => c.level);
  const { window: windowSize, minItems } = r.settings;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
            <TrendingUp size={16} /> Báo cáo EQ
          </p>
          <h1 className="text-3xl">Hành trình cảm xúc của {r.childName}</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Mỗi kỹ năng được xếp mức theo {windowSize} câu trả lời gần nhất ở lượt đọc đầu của truyện AI; cần ít nhất {minItems} câu mới xếp mức.
            Mức của năng lực là mức thấp nhất trong các kỹ năng đã có mức.
          </p>
        </div>
        {isFetching && <Loader2 size={18} className="animate-spin text-primary" />}
      </div>

      <p className="flex items-start gap-2 rounded-2xl bg-navy-tint px-4 py-3 text-sm text-navy/80">
        <Info size={16} className="mt-0.5 shrink-0" /> {EQ_REPORT_NOTE}
      </p>

      <div className="grid gap-6 xl:grid-cols-5">
        <section className="card space-y-3 p-5 xl:col-span-3">
          <h2 className="text-lg">5 năng lực CASEL</h2>
          {hasAnyLevel ? (
            <RadarChart competencies={r.competencies} />
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-8 text-center">
              <Sparkles size={32} className="text-primary" />
              <p className="font-display font-bold">Chưa có dữ liệu để vẽ biểu đồ</p>
              <p className="max-w-md text-sm text-navy/60">
                Khi {r.childName} đọc truyện AI và trả lời câu hỏi trong Chế độ Trẻ Em, mức độ từng năng lực sẽ hiện ở đây.
              </p>
            </div>
          )}
          <LevelLegend />
        </section>

        <section className="card space-y-3 p-5 xl:col-span-2">
          <h2 className="flex items-center gap-2 text-lg">
            <BookOpenCheck size={19} className="text-primary" /> Chuyện mẫu nên đọc tiếp
          </h2>
          {r.recommendations.length === 0 ? (
            <p className="text-sm text-navy/60">Chưa có chuyện mẫu phù hợp để gợi ý lúc này.</p>
          ) : (
            <ul className="space-y-3">
              {r.recommendations.map((t) => (
                <li key={t.id}>
                  <Link
                    to={ROUTES.PARENT.studioNewFromTopic(t.id)}
                    className="group flex items-center gap-3 rounded-2xl border-2 border-outline p-4 transition hover:border-primary/50 hover:bg-primary-tint/40"
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <CaselTag competency={t.skill?.caselCode} className="bg-secondary-tint" />
                      <p className="font-display font-bold">{t.title}</p>
                      {t.subSkills?.length > 0 && <p className="text-xs text-navy/60">{t.subSkills.map((s) => s.nameVi).join(" · ")}</p>}
                    </div>
                    <span className="flex shrink-0 items-center gap-0.5 text-sm font-bold text-primary-dark group-hover:gap-1.5">
                      Tạo truyện <ChevronRight size={16} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-navy/50">Ưu tiên năng lực chưa có dữ liệu hoặc đang làm quen, bỏ qua chuyện mẫu bé vừa đọc.</p>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {r.competencies.map((c) => (
          <CompetencyCard
            key={c.caselCode}
            competency={c}
            evidenceBySub={evidenceBySub}
            windowSize={windowSize}
            onShowEvidence={setEvidenceFor}
          />
        ))}
      </div>

      <section className="card space-y-3 p-5">
        <h2 className="flex items-center gap-2 text-lg">
          <MessageCircleHeart size={19} className="text-primary" /> Gợi ý trò chuyện
        </h2>
        {r.conversation.length === 0 ? (
          <p className="text-sm text-navy/60">Khi {r.childName} đọc truyện, câu hỏi gợi ý để ba mẹ trò chuyện cùng con sẽ hiện ở đây.</p>
        ) : (
          <ul className="grid gap-3 lg:grid-cols-3">
            {r.conversation.map((s) => (
              <li key={s.storyId} className="space-y-2 rounded-2xl bg-surface p-4 text-sm">
                <p className="font-display font-bold">“{s.storyTitle}”</p>
                {s.subSkillId && subSkillName.get(s.subSkillId) && (
                  <p className="text-xs font-semibold text-secondary-dark">{subSkillName.get(s.subSkillId)}</p>
                )}
                {s.prompts.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-navy/55">Ba mẹ có thể hỏi con:</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {s.prompts.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.reflection && (
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs font-semibold text-navy/55">Câu hỏi liên hệ bản thân trong truyện:</p>
                    <p className="mt-0.5">{s.reflection.question}</p>
                    <p className="mt-1 text-xs text-navy/55">
                      {s.reflection.answered ? "Con đã trả lời câu này trong truyện. Ba mẹ hỏi lại để nghe con kể thêm nhé." : "Con chưa trả lời câu này, ba mẹ có thể hỏi con."}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg">Theo tuần</h2>
          <div className="flex gap-2" role="tablist" aria-label="Khoảng thời gian">
            {[4, 8, 12].map((n) => (
              <button
                key={n}
                type="button"
                role="tab"
                aria-selected={weeks === n}
                onClick={() => setWeeks(n)}
                className={`rounded-full px-3 py-1 text-sm font-bold ${weeks === n ? "bg-primary text-white" : "bg-surface text-navy/70"}`}
              >
                {n} tuần
              </button>
            ))}
          </div>
        </div>
        <WeeklyTrend trend={r.trend} competencies={r.competencies} />
      </section>

      {evidenceFor && (
        <EvidenceModal subSkill={evidenceFor} evidence={evidenceBySub.get(evidenceFor.id) ?? []} onClose={() => setEvidenceFor(null)} />
      )}
    </div>
  );
}

export default EqJourneyPage;
