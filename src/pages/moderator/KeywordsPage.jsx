import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, Loader2, Plus, Search, SearchX, ShieldAlert, Trash2, TriangleAlert } from "lucide-react";
import Modal from "../../components/common/Modal";
import Switch from "../../components/common/Switch";
import useDebounce from "../../hooks/useDebounce";
import { addKeywords, deleteKeyword, getKeywords, updateKeyword } from "../../services/keywordService";
import { toast } from "../../stores/toastStore";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

const SEVERITY = {
  block: { label: "Chặn hẳn", hint: "Không lưu được truyện có từ này", icon: Ban, className: "bg-danger-tint text-danger" },
  warn: { label: "Cảnh báo", hint: "Vẫn lưu được, phụ huynh thấy cảnh báo", icon: TriangleAlert, className: "bg-amber-100 text-amber-700" },
};

const FILTERS = [
  { value: "all", label: "Mọi mức độ" },
  { value: "block", label: "Chặn hẳn" },
  { value: "warn", label: "Cảnh báo" },
];

const keywordKeys = { all: ["moderation-keywords"], list: (f) => ["moderation-keywords", f] };

const useKeywordMutation = (mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: keywordKeys.all }) });
};

function AddKeywordsForm() {
  const [text, setText] = useState("");
  const [severity, setSeverity] = useState("block");
  const add = useKeywordMutation(({ keywords, severity }) => addKeywords(keywords, severity));

  const keywords = [...new Set(text.split("\n").map((s) => s.trim()).filter(Boolean))];

  const submit = (e) => {
    e.preventDefault();
    if (!keywords.length) return;
    if (keywords.some((k) => k.length > 100)) return toast.error("Mỗi từ khoá tối đa 100 ký tự");
    add.mutate(
      { keywords, severity },
      {
        onSuccess: ({ count }) => {
          toast.success(count === 1 ? "Đã thêm từ khoá" : `Đã thêm / cập nhật ${count} từ khoá`);
          setText("");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <form onSubmit={submit} className="card space-y-3 p-5">
      <h2 className="text-lg">Thêm từ khoá</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder={"Mỗi dòng một từ hoặc cụm từ, VD:\nđánh nhau"}
        className={`${inputClass} resize-y`}
      />
      <p className="text-xs text-navy/50">
        Khớp nguyên tiếng, không phân biệt hoa thường, giữ dấu ("ngu" không khớp "ngủ" hay "nguyên"). Thêm nhiều từ cùng lúc: từ đã có sẽ được cập nhật mức độ và bật lại.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          {Object.entries(SEVERITY).map(([value, s]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSeverity(value)}
              title={s.hint}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                severity === value ? s.className + " ring-2 ring-current/30" : "bg-surface text-navy/60 hover:bg-outline"
              }`}
            >
              <s.icon size={15} /> {s.label}
            </button>
          ))}
        </div>
        <button type="submit" disabled={!keywords.length || add.isPending} className="btn-primary py-2.5 text-sm disabled:opacity-60 sm:ml-auto">
          {add.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Thêm {keywords.length > 1 ? `${keywords.length} từ` : ""}
        </button>
      </div>
    </form>
  );
}

function KeywordsPage() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [deleting, setDeleting] = useState(null);
  const debouncedSearch = useDebounce(search);
  const filters = { search: debouncedSearch, severity };

  const { data: keywords = [], isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: keywordKeys.list(filters),
    queryFn: () => getKeywords(filters),
    placeholderData: keepPreviousData,
  });
  const update = useKeywordMutation(({ id, ...payload }) => updateKeyword(id, payload));
  const remove = useKeywordMutation(deleteKeyword);

  const patch = (k, payload) => update.mutate({ id: k.id, ...payload }, { onError: (err) => toast.error(err.message) });
  const confirmDelete = () =>
    remove.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Đã xoá từ khoá");
        setDeleting(null);
      },
      onError: (err) => toast.error(err.message),
    });

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
          <ShieldAlert size={16} /> An toàn nội dung
        </p>
        <h1 className="text-3xl">Từ khoá chặn</h1>
        <p className="mt-1 max-w-2xl text-navy/70">
          Áp dụng cho cả truyện AI viết và chữ phụ huynh tự viết / sửa. <b>Chặn hẳn</b>: không lưu được, phải diễn đạt khác.{" "}
          <b>Cảnh báo</b>: vẫn lưu được nhưng phụ huynh thấy nhắc nhở.
        </p>
      </div>

      <AddKeywordsForm />

      <div className="flex flex-col gap-3 rounded-card bg-white p-4 shadow-low sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-navy/40" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm từ khoá..." className={`${inputClass} rounded-full pl-11`} />
        </label>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={`${inputClass} cursor-pointer rounded-full sm:w-48`}>
          {FILTERS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-outline px-5 py-3">
          <h2 className="text-lg">Danh sách</h2>
          <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-navy/70">{keywords.length}</span>
          {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
        </div>
        {isLoading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="font-display font-bold">Không tải được danh sách từ khoá</p>
            <button onClick={() => refetch()} className="btn-primary mt-4">
              Thử lại
            </button>
          </div>
        ) : keywords.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <SearchX size={36} className="text-primary" />
            <p className="font-display font-bold">Chưa có từ khoá phù hợp</p>
          </div>
        ) : (
          <ul className={`divide-y divide-outline transition-opacity ${isFetching ? "opacity-60" : ""}`}>
            {keywords.map((k) => {
              const s = SEVERITY[k.severity];
              const busy = update.isPending && update.variables?.id === k.id;
              return (
                <li key={k.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold ${k.isActive ? "" : "text-navy/40 line-through"}`}>{k.keyword}</p>
                    <p className="text-xs text-navy/50">
                      {new Date(k.createdAt).toLocaleDateString("vi-VN")}
                      {k.creator && ` · ${k.creator}`}
                    </p>
                  </div>
                  <button
                    onClick={() => patch(k, { severity: k.severity === "block" ? "warn" : "block" })}
                    disabled={busy}
                    title="Bấm để đổi mức độ"
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition hover:opacity-80 disabled:opacity-60 ${s.className}`}
                  >
                    <s.icon size={13} /> {s.label}
                  </button>
                  <Switch checked={k.isActive} onChange={() => patch(k, { isActive: !k.isActive })} disabled={busy} label={k.isActive ? "Tắt từ khoá" : "Bật từ khoá"} />
                  <button onClick={() => setDeleting(k)} className="rounded-full p-2 text-navy/60 hover:bg-danger-tint hover:text-danger" aria-label="Xoá từ khoá">
                    <Trash2 size={17} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={`Xoá từ khoá "${deleting?.keyword ?? ""}"?`}
        description="Muốn tạm ngưng thì tắt công tắc thay vì xoá."
        size="max-w-md"
        footer={
          <>
            <button onClick={() => setDeleting(null)} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
              Hủy
            </button>
            <button
              onClick={confirmDelete}
              disabled={remove.isPending}
              className="inline-flex items-center gap-1.5 rounded-full bg-danger px-5 py-2.5 text-sm font-bold text-white transition hover:bg-danger-dark disabled:opacity-70"
            >
              {remove.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Xoá
            </button>
          </>
        }
      />
    </div>
  );
}

export default KeywordsPage;
