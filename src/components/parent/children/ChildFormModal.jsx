import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../../common/Modal";

const AVATARS = ["🧒", "👧", "👦", "👶", "🧒🏻", "👧🏻", "🐻", "🐰", "🦊", "🐼", "🦁", "🐯"];
const today = new Date().toISOString().slice(0, 10);
const minDate = `${new Date().getFullYear() - 12}-01-01`;

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-3 outline-none transition placeholder:text-navy/40 focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

// Dùng cho cả Thêm bé mới và Sửa hồ sơ bé (khi truyền `child`)
function ChildFormModal({ open, onClose, child, onSubmit, isPending }) {
  const [form, setForm] = useState(() => ({
    name: child?.name ?? "",
    birthday: child?.birthday ?? "",
    gender: child?.gender ?? "boy",
    avatarEmoji: child?.avatarEmoji ?? AVATARS[0],
  }));
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target?.value ?? e }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Ba mẹ nhập tên gọi của bé nhé");
    if (!form.birthday) return setError("Ba mẹ chọn ngày sinh của bé nhé");
    setError("");
    onSubmit({ ...form, name: form.name.trim() });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={child ? `Sửa hồ sơ ${child.name}` : "Thêm hồ sơ bé mới"}
      description="Thông tin giúp AI chọn truyện phù hợp với độ tuổi của bé"
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button type="submit" form="child-form" disabled={isPending} className="btn-primary py-2.5 text-sm disabled:opacity-70">
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {child ? "Lưu thông tin" : "Tạo hồ sơ"}
          </button>
        </>
      }
    >
      <form id="child-form" onSubmit={submit} className="space-y-4">
        <div>
          <span className="mb-2 block text-sm font-semibold">Ảnh đại diện</span>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => set("avatarEmoji")(a)}
                aria-pressed={form.avatarEmoji === a}
                className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl transition ${
                  form.avatarEmoji === a ? "bg-primary-tint ring-2 ring-primary" : "bg-surface hover:bg-outline"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Tên gọi ở nhà</span>
          <input value={form.name} onChange={set("name")} maxLength={30} placeholder="Ví dụ: Bé Bi" className={inputClass} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Ngày sinh</span>
            <input type="date" value={form.birthday} onChange={set("birthday")} min={minDate} max={today} className={inputClass} />
          </label>
          <div>
            <span className="mb-1.5 block text-sm font-semibold">Giới tính</span>
            <div className="flex gap-2">
              {[
                { value: "boy", label: "Bé trai" },
                { value: "girl", label: "Bé gái" },
              ].map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => set("gender")(g.value)}
                  className={`flex-1 rounded-full py-3 text-sm font-bold transition ${
                    form.gender === g.value ? "bg-secondary text-white" : "bg-surface hover:bg-outline"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      </form>
    </Modal>
  );
}

export default ChildFormModal;
