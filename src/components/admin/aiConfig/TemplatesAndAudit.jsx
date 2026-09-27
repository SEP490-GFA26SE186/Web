import { useState } from "react";
import { ArrowRight, History, Loader2 } from "lucide-react";
import Modal from "../../common/Modal";
import { useAuditLog } from "../../../hooks/useAdmin";
import { toast } from "../../../stores/toastStore";

const TAG_TONES = {
  primary: "bg-primary-tint text-primary-dark",
  secondary: "bg-secondary-tint text-secondary-dark",
  navy: "bg-navy-tint text-navy-soft",
};

const bumpVersion = (v) => {
  const [major, minor] = v.replace("v", "").split(".").map(Number);
  return `v${major}.${minor + 1}`;
};

function EditTemplateModal({ template, onClose, onSave }) {
  const [form, setForm] = useState({ title: template.title, prompt: template.prompt, model: template.model });
  const invalid = !form.title.trim() || form.prompt.trim().length < 20;
  const field = "w-full rounded-2xl border-[1.5px] border-outline px-4 py-2.5 text-sm outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

  return (
    <Modal
      open
      onClose={onClose}
      title="Chỉnh sửa mẫu Prompt sư phạm"
      description={`${template.tag} • ${template.version} → ${bumpVersion(template.version)} sau khi lưu`}
      size="max-w-2xl"
      footer={
        <>
          <button onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button
            disabled={invalid}
            onClick={() => onSave({ ...form, version: bumpVersion(template.version) })}
            className="rounded-full bg-primary-dark px-5 py-2.5 text-sm font-bold text-white hover:bg-primary disabled:opacity-50"
          >
            Áp dụng
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Tên mẫu</span>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Nội dung prompt</span>
          <textarea
            rows={6}
            value={form.prompt}
            onChange={(e) => setForm({ ...form, prompt: e.target.value })}
            className={`${field} resize-none leading-relaxed`}
          />
          <span className="mt-1 block text-xs text-navy/50">Tối thiểu 20 ký tự. Không đưa thông tin định danh trẻ em vào prompt mẫu.</span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Mô hình gán</span>
          <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className={field} />
        </label>
      </div>
    </Modal>
  );
}

export function TemplatesSection({ templates, total, onChangeTemplate }) {
  const [editing, setEditing] = useState(null);

  return (
    <section id="section-templates" className="flex scroll-mt-24 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-3 text-lg">
          <span className="h-6 w-3 rounded-full bg-navy-soft" /> Mẫu Prompt Sư Phạm CASEL & Cảm Xúc Xã Hội
        </h2>
        <button
          onClick={() => toast.info(`Thư viện đầy đủ ${total} mẫu prompt sẽ có ở màn riêng`)}
          className="flex items-center gap-1 text-sm font-bold text-secondary-dark hover:underline"
        >
          Xem toàn bộ {total} Mẫu Prompt <ArrowRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {templates.map((t) => (
          <article key={t.id} className="flex flex-col justify-between gap-4 rounded-card bg-white p-4 shadow-low transition hover:shadow-mid">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${TAG_TONES[t.tone]}`}>{t.tag}</span>
                <span className="text-xs font-semibold text-navy/50">{t.version}</span>
              </div>
              <h3 className="pt-1 text-lg">{t.title}</h3>
              <p className="line-clamp-2 text-sm text-navy/65">"{t.prompt}"</p>
            </div>
            <div className="flex items-center justify-between text-xs text-navy/60">
              <span>
                Gán: <strong className="text-navy">{t.model}</strong>
              </span>
              <button onClick={() => setEditing(t)} className="font-bold text-primary-dark hover:underline">
                Chỉnh sửa
              </button>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <EditTemplateModal
          template={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            onChangeTemplate(editing.id, patch);
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

export function AuditLogModal({ open, onClose }) {
  const { data, isLoading } = useAuditLog(open);
  return (
    <Modal open={open} onClose={onClose} title="Lịch sử thay đổi cấu hình AI" description="Mọi thay đổi đều được ghi nhận để kiểm toán" size="max-w-2xl">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : (
        <ol className="flex flex-col gap-2">
          {data?.map((a) => (
            <li key={a.id} className="flex gap-3 rounded-2xl bg-surface p-3 text-sm">
              <History size={17} className="mt-0.5 shrink-0 text-navy/50" />
              <div>
                <p className="text-xs text-navy/60">
                  {a.time} • <b className="text-navy">{a.actor}</b>
                </p>
                <p>{a.action}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Modal>
  );
}
