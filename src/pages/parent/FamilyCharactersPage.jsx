import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Loader2, Pencil, Plus, Trash2, UsersRound } from "lucide-react";
import CharacterPortrait from "../../components/parent/CharacterPortrait";
import Modal from "../../components/common/Modal";
import { ROUTES } from "../../constants/routes";
import { studioKeys, useCharacters } from "../../hooks/useStudio";
import { parentKeys, useSubscription } from "../../hooks/useParent";
import { createCharacter, deleteCharacter, updateCharacter } from "../../services/storyService";
import { toast } from "../../stores/toastStore";
import { Link } from "react-router-dom";

const fieldClass = "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-2.5 text-sm outline-none focus:border-primary";

const useCharacterMutation = (fn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studioKeys.characters });
      queryClient.invalidateQueries({ queryKey: parentKeys.subscription }); // usage.charactersCount
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });
};

function CharacterModal({ character, onClose }) {
  const [name, setName] = useState(character?.name ?? "");
  const [appearance, setAppearance] = useState(character?.appearance ?? "");
  const create = useCharacterMutation(createCharacter);
  const update = useCharacterMutation(({ id, ...body }) => updateCharacter(id, body));
  const pending = create.isPending || update.isPending;
  const isChild = Boolean(character?.childId);
  const renamed = character && name.trim() !== character.name;

  const submit = (e) => {
    e.preventDefault();
    const body = { ...(isChild ? {} : { name: name.trim() }), appearance: appearance.trim() };
    const opts = { onSuccess: () => { toast.success(character ? "Đã lưu nhân vật" : "Đã thêm nhân vật"); onClose(); }, onError: (err) => toast.error(err.message) };
    if (character) update.mutate({ id: character.id, ...body }, opts);
    else create.mutate(body, opts);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={character ? `Sửa nhân vật ${character.name}` : "Thêm nhân vật gia đình"}
      description="Mô tả bằng chữ để AI viết đúng tính cách, ngoại hình. Tên thật chỉ hiện trong truyện của gia đình — khi gửi AI và khi đăng bán đều được thay bằng tên chung."
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">Hủy</button>
          <button type="submit" form="character-form" disabled={pending} className="btn-primary py-2.5 text-sm">
            {pending && <Loader2 size={16} className="animate-spin" />} Lưu
          </button>
        </>
      }
    >
      <form id="character-form" onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Tên gọi trong truyện</span>
          <input required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} disabled={isChild} placeholder="VD: Bà nội, Mèo Mướp, Anh Tí" className={`${fieldClass} disabled:bg-surface`} />
          {isChild && <span className="mt-1 block text-xs text-navy/50">Nhân vật này là bé — đổi tên ở trang “Bé nhà mình”.</span>}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Mô tả</span>
          <textarea required minLength={3} maxLength={1000} rows={4} value={appearance} onChange={(e) => setAppearance(e.target.value)} placeholder="VD: tóc bạc, đeo kính, rất hiền, hay kể chuyện cổ tích" className={`${fieldClass} resize-none`} />
        </label>
        {renamed && character.storiesCount > 0 && (
          <p className="rounded-2xl bg-primary-tint px-4 py-2.5 text-sm text-primary-dark">
            Tên mới sẽ hiện trong {character.storiesCount} truyện đang có nhân vật này. Truyện đã có giọng đọc cần bấm “Tạo lại giọng đọc” trong trang biên tập để bé nghe đúng tên.
          </p>
        )}
      </form>
    </Modal>
  );
}

// Nhân vật gia đình (luồng 1.1): ông bà, anh chị, thú cưng... dùng lại trong nhiều truyện. Chỉ mô tả bằng chữ;
// chân dung AI thuộc phần ảnh đang nghiên cứu.
function FamilyCharactersPage() {
  const { data: characters = [], isLoading, error } = useCharacters();
  const { data: sub } = useSubscription();
  const [editing, setEditing] = useState(null); // null | "new" | character
  const [deleting, setDeleting] = useState(null);
  const remove = useCharacterMutation(deleteCharacter);
  const limit = sub?.plan?.maxCharacters;
  const full = limit != null && characters.length >= limit;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end md:gap-8">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
            <UsersRound size={16} /> Nhân vật gia đình
          </p>
          <h1 className="text-3xl">Những người thân trong truyện của bé</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Thêm ông bà, anh chị, bạn thân hay thú cưng một lần, dùng lại cho mọi truyện. Nhân vật của chính bé được tạo cùng hồ sơ bé.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 self-start md:self-auto">
          {limit != null && (
            <span className="rounded-full bg-surface px-3 py-1.5 text-sm font-bold whitespace-nowrap text-navy/65" title="Số nhân vật / giới hạn của gói">
              {characters.length}/{limit} nhân vật
            </span>
          )}
          <button type="button" onClick={() => setEditing("new")} disabled={full} title={full ? "Đã đủ số nhân vật của gói" : undefined} className="btn-primary whitespace-nowrap disabled:opacity-50">
            <Plus size={18} /> Thêm nhân vật
          </button>
        </div>
      </div>
      {full && (
        <p className="rounded-card bg-primary-tint p-3 text-sm text-primary-dark">
          Gói hiện tại cho tối đa {limit} nhân vật. Xoá bớt nhân vật không dùng hoặc{" "}
          <Link to={ROUTES.PARENT.BILLING} className="font-bold underline">nâng cấp gói</Link>.
        </p>
      )}

      {isLoading && <Loader2 size={28} className="animate-spin text-primary" />}
      {error && <p className="card p-5 text-danger">{error.message}</p>}
      {!isLoading && !error && characters.length === 0 && (
        <div className="card p-10 text-center text-navy/60">Chưa có nhân vật nào. Thêm người thân để AI viết truyện gần gũi với bé hơn.</div>
      )}
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {characters.map((c) => (
          <li key={c.id} className="card flex flex-col gap-2 p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-lg font-bold">{c.name}</p>
                {c.child && <span className="rounded-full bg-secondary-tint px-2 py-0.5 text-xs font-bold text-secondary-dark">Là bé {c.child.name}</span>}
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => setEditing(c)} className="rounded-full p-2 text-navy/60 hover:bg-surface" aria-label={`Sửa ${c.name}`}>
                  <Pencil size={16} />
                </button>
                {!c.childId && (
                  <button type="button" onClick={() => setDeleting(c)} className="rounded-full p-2 text-navy/60 hover:bg-danger-tint hover:text-danger" aria-label={`Xoá ${c.name}`}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            <p className="line-clamp-3 text-sm text-navy/75">{c.appearance}</p>
            <CharacterPortrait character={c} />
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-1 text-xs text-navy/55">
              <span className="flex items-center gap-1"><BookOpen size={13} /> {c.storiesCount ? `Có trong ${c.storiesCount} truyện` : "Chưa có trong truyện nào"}</span>
            </div>
          </li>
        ))}
      </ul>

      {editing && <CharacterModal character={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={`Xoá nhân vật “${deleting?.name ?? ""}”?`}
        description={deleting?.storiesCount ? `Các truyện đã viết (${deleting.storiesCount}) vẫn giữ nguyên nhân vật này; chỉ không chọn được cho truyện mới.` : "Nhân vật chưa có trong truyện nào."}
        size="max-w-md"
        footer={
          <>
            <button type="button" onClick={() => setDeleting(null)} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">Hủy</button>
            <button
              type="button"
              disabled={remove.isPending}
              onClick={() => remove.mutate(deleting.id, { onSuccess: () => { toast.success("Đã xoá nhân vật"); setDeleting(null); }, onError: (e) => toast.error(e.message) })}
              className="inline-flex items-center gap-1.5 rounded-full bg-danger px-5 py-2.5 text-sm font-bold text-white disabled:opacity-70"
            >
              {remove.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Xoá
            </button>
          </>
        }
      />
    </div>
  );
}

export default FamilyCharactersPage;
