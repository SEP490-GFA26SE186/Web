import { useState } from "react";
import { Brain, Check, Flag, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import Switch from "../../common/Switch";
import { EQ_GOAL_TEMPLATES } from "../../../mocks/childProfiles";
import SectionCard from "./SectionCard";

const MAX_GOALS = 3;
const goalTones = [
  { badge: "bg-primary text-white", text: "text-primary-dark", bar: "bg-primary" },
  { badge: "bg-secondary text-white", text: "text-secondary-dark", bar: "bg-secondary" },
  { badge: "bg-navy-soft text-white", text: "text-navy-soft", bar: "bg-navy-soft" },
];

function EqGoalsCard({ eqFocus, goals, realWorldMissions, onChange }) {
  const [editing, setEditing] = useState(false);
  const available = EQ_GOAL_TEMPLATES.filter((t) => !goals.some((g) => g.id === t.id));

  const removeGoal = (id) => onChange({ eqGoals: goals.filter((g) => g.id !== id) });
  const addGoal = (template) => onChange({ eqGoals: [...goals, { ...template, progress: 0 }] });

  return (
    <SectionCard
      icon={Brain}
      tone="teal"
      title="Mục tiêu rèn luyện EQ trọng tâm"
      subtitle={eqFocus}
      action={
        <button
          onClick={() => setEditing((v) => !v)}
          className="flex shrink-0 items-center gap-1 text-sm font-bold text-secondary-dark hover:text-secondary"
        >
          {editing ? <Check size={16} /> : <SlidersHorizontal size={16} />}
          {editing ? "Xong" : "Tùy chỉnh"}
        </button>
      }
    >
      <div className="space-y-4">
        {goals.length === 0 && (
          <p className="rounded-2xl bg-surface p-4 text-center text-sm text-navy/60">
            Chưa có mục tiêu nào. Bấm <b>Tùy chỉnh</b> để chọn tối đa {MAX_GOALS} mục tiêu cho bé.
          </p>
        )}
        {goals.map((goal, i) => {
          const tone = goalTones[i % goalTones.length];
          return (
            <div key={goal.id} className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${tone.badge}`}>
                    {i + 1}
                  </span>
                  <span className="font-bold">{goal.title}</span>
                </div>
                {editing ? (
                  <button
                    onClick={() => removeGoal(goal.id)}
                    aria-label="Xóa mục tiêu"
                    className="rounded-full p-1.5 text-navy/50 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                ) : (
                  <span className={`text-sm font-bold ${tone.text}`}>{goal.progress}%</span>
                )}
              </div>
              <p className="pl-8 text-sm text-navy/65">{goal.description}</p>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-outline">
                <div className={`h-full rounded-full transition-all duration-500 ${tone.bar}`} style={{ width: `${goal.progress}%` }} />
              </div>
            </div>
          );
        })}

        {editing && goals.length < MAX_GOALS && available.length > 0 && (
          <div className="rounded-2xl border-2 border-dashed border-outline p-4">
            <p className="mb-2 text-xs font-bold text-navy/60">
              Thêm mục tiêu ({goals.length}/{MAX_GOALS}):
            </p>
            <div className="flex flex-wrap gap-2">
              {available.map((t) => (
                <button
                  key={t.id}
                  onClick={() => addGoal(t)}
                  className="flex items-center gap-1 rounded-full bg-secondary-tint px-3 py-1.5 text-xs font-bold text-secondary-dark transition hover:bg-secondary hover:text-white"
                >
                  <Plus size={13} /> {t.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-secondary-tint p-4">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-white p-2 text-secondary shadow-low">
            <Flag size={22} />
          </span>
          <div>
            <p className="font-bold">Kích hoạt Nhiệm vụ Đời thực</p>
            <p className="text-sm text-navy/65">Nhắc nhở bé thực hành hành động thực tế sau khi đọc xong câu chuyện</p>
          </div>
        </div>
        <Switch
          checked={realWorldMissions}
          onChange={(v) => onChange({ realWorldMissions: v })}
          label="Kích hoạt Nhiệm vụ Đời thực"
        />
      </div>
    </SectionCard>
  );
}

export default EqGoalsCard;
