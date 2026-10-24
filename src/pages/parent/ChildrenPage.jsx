import { useState } from "react";
import { Leaf, PlusCircle } from "lucide-react";
import CharacterCard from "../../components/parent/children/CharacterCard";
import { ActiveChildCard, AddChildCard, OtherChildCard } from "../../components/parent/children/ChildCards";
import ChildFormModal from "../../components/parent/children/ChildFormModal";
import KidPinCard from "../../components/parent/children/KidPinCard";
import EnterKidModeButton from "../../components/parent/children/EnterKidModeButton";
import useAuthStore from "../../stores/authStore";
import ReadingSettingsCard from "../../components/parent/children/ReadingSettingsCard";
import { useCreateChild, useDeleteChild, useSelectedChild, useUpdateChild } from "../../hooks/useChildProfile";
import useParentStore from "../../stores/parentStore";
import { toast as notify } from "../../stores/toastStore";
import { ConfirmDialog } from "../../components/ui";

function ChildrenPage() {
  const setSelectedChildId = useParentStore((s) => s.setSelectedChildId);
  const hasKidPin = useAuthStore((s) => !!s.user?.hasKidPin);
  const { child: active, children, isLoading, isEmpty } = useSelectedChild();
  const [modal, setModal] = useState(null); // "create" | "edit" | "delete" | null

  const createChild = useCreateChild();
  const updateChild = useUpdateChild(active?.id);
  const deleteChild = useDeleteChild();

  const others = children.filter((c) => c.id !== active?.id);

  const openModal = (type) => {
    createChild.reset();
    updateChild.reset();
    setModal(type);
  };

  const handleSubmit = (payload) => {
    if (modal === "create") {
      createChild.mutate(payload, {
        onSuccess: (child) => {
          setSelectedChildId(child.id);
          setModal(null);
          notify.success(`Đã tạo hồ sơ cho ${child.name} 🎉`);
        },
      });
    } else {
      updateChild.mutate(payload, {
        onSuccess: (child) => {
          setModal(null);
          notify.success(`Đã cập nhật hồ sơ ${child.name}`);
        },
      });
    }
  };

  const handleDelete = () =>
    deleteChild.mutate(active.id, {
      onSuccess: () => {
        setModal(null);
        if (others[0]) setSelectedChildId(others[0].id);
        notify.info(`Đã xóa hồ sơ ${active.name}`);
      },
      onError: (err) => notify.error(err.message),
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
            <Leaf size={16} /> Hồ sơ của bé
          </p>
          <h1 className="text-3xl">Bé nhà mình</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Quản lý hồ sơ từng bé, nhân vật đại diện trong truyện và giới hạn thời gian dùng Chế độ Trẻ Em.
          </p>
        </div>
        <button onClick={() => openModal("create")} className="btn-primary shrink-0 self-start whitespace-nowrap shadow-glow md:self-auto">
          <PlusCircle size={20} /> Thêm hồ sơ bé mới
        </button>
      </div>

      {isEmpty ? (
        <div className="mx-auto max-w-md">
          <AddChildCard onClick={() => openModal("create")} />
        </div>
      ) : isLoading || !active ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-48 animate-pulse rounded-card bg-surface lg:col-span-7" />
          <div className="h-48 animate-pulse rounded-card bg-surface lg:col-span-5" />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ActiveChildCard
                child={active}
                onEdit={() => openModal("edit")}
                onDelete={() => setModal("delete")}
                action={<EnterKidModeButton child={active} hasPin={hasKidPin} />}
              />
            </div>
            <div className="flex flex-col gap-4 lg:col-span-5">
              {others.map((c) => (
                <OtherChildCard
                  key={c.id}
                  child={c}
                  onSelect={() => {
                    setSelectedChildId(c.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              ))}
              {others.length === 0 && <AddChildCard onClick={() => openModal("create")} />}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* key theo bé để form được khởi tạo lại khi chuyển hồ sơ */}
            <ReadingSettingsCard key={active.id} child={active} />
            <div className="flex flex-col gap-6">
              <CharacterCard child={active} onEdit={() => openModal("edit")} />
              <KidPinCard />
            </div>
          </section>
        </>
      )}

      {(modal === "create" || modal === "edit") && (
        <ChildFormModal
          open
          child={modal === "edit" ? active : null}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          isPending={createChild.isPending || updateChild.isPending}
          error={(modal === "create" ? createChild.error : updateChild.error)?.message}
        />
      )}

      <ConfirmDialog
        open={modal === "delete" && !!active}
        onClose={() => setModal(null)}
        onConfirm={handleDelete}
        loading={deleteChild.isPending}
        title={`Xóa hồ sơ ${active?.name ?? ""}?`}
        description="Giá sách, lịch sử đọc và nhân vật của bé sẽ không còn hiển thị. Phiên Chế độ Trẻ Em đang mở của bé cũng bị đăng xuất."
        cancelLabel="Giữ lại"
        confirmLabel="Xóa hồ sơ"
      />
    </div>
  );
}

export default ChildrenPage;
