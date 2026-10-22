import { useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import Modal from "../../common/Modal";
import CaselTag from "../library/CaselTag";
import { CASEL } from "../../../constants/casel";
import { useSubSkills } from "../../../hooks/usePedagogy";

const MAX = 2;

/**
 * "Đổi kỹ năng": chọn 1–2 kỹ năng con đang dùng (GET /sub-skills — phụ huynh chỉ thấy mục đang bật),
 * nhóm theo 5 năng lực CASEL. Thứ tự chọn = thứ tự ưu tiên (mục chọn đầu là kỹ năng chính).
 */
function SubSkillPicker({ initial = [], busy, onClose, onConfirm }) {
  const { data: subSkills = [], isLoading, error } = useSubSkills({});
  const [picked, setPicked] = useState(initial.slice(0, MAX));

  const groups = useMemo(() => {
    const byCode = new Map();
    for (const s of subSkills) {
      if (s.isActive === false) continue;
      const code = s.skill?.caselCode ?? "other";
      byCode.set(code, [...(byCode.get(code) ?? []), s]);
    }
    const order = [...Object.keys(CASEL), "other"];
    return order.filter((code) => byCode.has(code)).map((code) => ({ code, items: byCode.get(code) }));
  }, [subSkills]);

  const toggle = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= MAX ? [...p.slice(1), id] : [...p, id]));

  return (
    <Modal
      open
      onClose={onClose}
      size="max-w-2xl"
      title="Đổi kỹ năng bé sẽ tập"
      description="Chọn 1–2 kỹ năng. Kỹ năng chọn đầu tiên là kỹ năng chính; hệ thống đọc lại chuyện để tìm chỗ cho bé tập."
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button type="button" onClick={() => onConfirm(picked)} disabled={busy || picked.length === 0} className="btn-primary py-2.5 text-sm disabled:opacity-60">
            {busy && <Loader2 size={16} className="animate-spin" />} Dùng {picked.length || ""} kỹ năng này
          </button>
        </>
      }
    >
      {isLoading && <Loader2 className="animate-spin text-primary" />}
      {error && <p className="text-sm font-semibold text-danger">{error.message}</p>}
      <div className="space-y-5">
        {groups.map(({ code, items }) => (
          <section key={code} className="space-y-2">
            {CASEL[code] ? <CaselTag competency={code} className="bg-secondary-tint" /> : <p className="text-sm font-bold">Khác</p>}
            <ul className="grid gap-2 sm:grid-cols-2">
              {items.map((s) => {
                const index = picked.indexOf(s.id);
                const on = index >= 0;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => toggle(s.id)}
                      aria-pressed={on}
                      className={`flex h-full w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition ${
                        on ? "border-primary bg-primary-tint" : "border-outline hover:border-primary/50"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 text-xs font-bold ${
                          on ? "border-primary bg-primary text-white" : "border-outline"
                        }`}
                      >
                        {on && (picked.length > 1 ? index + 1 : <Check size={14} />)}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{s.nameVi}</span>
                        {s.descriptionVi && <span className="mt-0.5 block text-xs text-navy/60">{s.descriptionVi}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
}

export default SubSkillPicker;
