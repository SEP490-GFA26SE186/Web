import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Leaf, Loader2, PlusCircle, RotateCcw } from "lucide-react";
import { ActiveChildCard, AddChildCard, OtherChildCard } from "../../components/parent/children/ChildCards";
import ChildFormModal from "../../components/parent/children/ChildFormModal";
import CompanionCard from "../../components/parent/children/CompanionCard";
import EqGoalsCard from "../../components/parent/children/EqGoalsCard";
import InterestsCard from "../../components/parent/children/InterestsCard";
import LimitsCard from "../../components/parent/children/LimitsCard";
import {
  childSettingsKey,
  useChildSettings,
  useCreateChild,
  useSaveChildSettings,
  useUpdateChild,
} from "../../hooks/useChildProfile";
import { useChildren } from "../../hooks/useParent";
import { DEFAULT_SETTINGS } from "../../mocks/childProfiles";
import useParentStore from "../../stores/parentStore";

const TABS = [
  { value: "overview", label: "Tổng quan" },
  { value: "interests", label: "Sở thích & Thế giới bé yêu" },
  { value: "eq", label: "Mục tiêu EQ & Hành vi" },
  { value: "companion", label: "Nhân vật AI đồng hành" },
  { value: "limits", label: "Giới hạn sử dụng & Phụ huynh" },
];

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function SettingsEditor({ child, saved, tab }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(saved);
  const [toast, setToast] = useState("");
  const save = useSaveChildSettings(child.id);
  const dirty = !isEqual(form, saved);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const patch = (key) => (value) =>
    setForm((f) => ({ ...f, [key]: typeof f[key] === "object" && !Array.isArray(f[key]) ? { ...f[key], ...value } : value }));

  // PIN được lưu ngay ở server, nên cập nhật cả cache lẫn form để không bị tính là "chưa lưu"
  const handlePinSaved = () => {
    queryClient.setQueryData(childSettingsKey(child.id), (old) => old && { ...old, limits: { ...old.limits, pinSet: true } });
    patch("limits")({ pinSet: true });
    setToast("Đã cập nhật mã PIN phụ huynh 🔒");
  };

  const resetDefaults = () =>
    setForm((f) => ({
      ...DEFAULT_SETTINGS,
      interests: f.interests,
      eqFocus: f.eqFocus,
      eqGoals: f.eqGoals,
      limits: { ...DEFAULT_SETTINGS.limits, pinSet: f.limits.pinSet },
    }));

  const cards = {
    interests: <InterestsCard interests={form.interests} onChange={patch("interests")} childAge={child.age} />,
    eq: (
      <EqGoalsCard
        eqFocus={form.eqFocus}
        goals={form.eqGoals}
        realWorldMissions={form.realWorldMissions}
        onChange={(value) => setForm((f) => ({ ...f, ...value }))}
      />
    ),
    companion: <CompanionCard companion={form.companion} onChange={patch("companion")} childName={child.name} />,
    limits: <LimitsCard childId={child.id} limits={form.limits} onChange={patch("limits")} onPinSaved={handlePinSaved} />,
  };

  return (
    <>
      {tab === "overview" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            {cards.interests}
            {cards.eq}
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            {cards.companion}
            {cards.limits}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl">{cards[tab]}</div>
      )}

      {/* Thanh lưu dính ở cuối màn hình */}
      <div className="sticky bottom-4 z-10 mt-6 flex flex-wrap items-center justify-end gap-2 rounded-full border border-outline bg-white/90 p-2 pl-5 shadow-high backdrop-blur">
        <span className="mr-auto text-sm">
          {toast ? (
            <span className="flex items-center gap-1.5 font-semibold text-secondary-dark">
              <CheckCircle2 size={17} /> {toast}
            </span>
          ) : dirty ? (
            <span className="flex items-center gap-1.5 font-semibold text-primary-dark">
              <span className="h-2 w-2 rounded-full bg-primary" /> Có thay đổi chưa lưu
            </span>
          ) : (
            <span className="text-navy/50">Mọi thay đổi đã được lưu</span>
          )}
        </span>
        {dirty && (
          <button
            onClick={() => setForm(saved)}
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-navy/60 hover:bg-surface"
          >
            Hoàn tác
          </button>
        )}
        <button
          onClick={resetDefaults}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface px-5 py-2.5 text-sm font-semibold text-navy/70 transition hover:bg-outline"
        >
          <RotateCcw size={15} /> Đặt lại mặc định
        </button>
        <button
          disabled={!dirty || save.isPending}
          onClick={() =>
            save.mutate(form, {
              onSuccess: () => setToast(`Đã lưu thay đổi cho ${child.name} ✨`),
              onError: () => setToast("Lưu thất bại, ba mẹ thử lại nhé"),
            })
          }
          className="btn-primary py-2.5 text-sm disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
        >
          {save.isPending && <Loader2 size={16} className="animate-spin" />}
          Lưu thay đổi cho {child.name}
        </button>
      </div>
    </>
  );
}

function ChildSettings({ child, tab }) {
  const { data, isLoading, isError, refetch } = useChildSettings(child.id);

  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="h-[640px] animate-pulse rounded-card bg-surface lg:col-span-7" />
        <div className="h-[640px] animate-pulse rounded-card bg-surface lg:col-span-5" />
      </div>
    );

  if (isError)
    return (
      <div className="card p-8 text-center">
        <p className="font-display font-bold">Không tải được cài đặt của {child.name} 😢</p>
        <button onClick={() => refetch()} className="btn-primary mt-4">
          Thử lại
        </button>
      </div>
    );

  return <SettingsEditor child={child} saved={data} tab={tab} />;
}

function ChildrenPage() {
  const { selectedChildId, setSelectedChildId } = useParentStore();
  const { data: children = [], isLoading } = useChildren();
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null); // "create" | "edit" | null

  const createChild = useCreateChild();
  const updateChild = useUpdateChild(selectedChildId);

  const active = children.find((c) => c.id === selectedChildId);
  const others = children.filter((c) => c.id !== selectedChildId);

  const handleSubmit = (payload) => {
    if (modal === "create") {
      createChild.mutate(payload, {
        onSuccess: (child) => {
          setSelectedChildId(child.id);
          setModal(null);
        },
      });
    } else {
      updateChild.mutate(payload, { onSuccess: () => setModal(null) });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
            <Leaf size={16} /> Hệ sinh thái nuôi dưỡng cảm xúc
          </p>
          <h1 className="text-3xl">Quản lý hồ sơ bé yêu</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Thiết lập mục tiêu phát triển EQ, sở thích thế giới kỳ ảo và giới hạn trải nghiệm an toàn riêng biệt cho
            từng bạn nhỏ.
          </p>
        </div>
        <button onClick={() => setModal("create")} className="btn-primary self-start shadow-glow md:self-auto">
          <PlusCircle size={20} /> Thêm hồ sơ bé mới
        </button>
      </div>

      {isLoading || !active ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-48 animate-pulse rounded-card bg-surface lg:col-span-7" />
          <div className="h-48 animate-pulse rounded-card bg-surface lg:col-span-5" />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ActiveChildCard child={active} onEdit={() => setModal("edit")} />
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
              {others.length === 0 && <AddChildCard onClick={() => setModal("create")} />}
            </div>
          </section>

          <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.value}
                role="tab"
                aria-selected={tab === t.value}
                onClick={() => setTab(t.value)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm whitespace-nowrap transition ${
                  tab === t.value
                    ? "bg-primary font-bold text-white shadow-mid"
                    : "bg-surface font-semibold hover:bg-outline"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* key theo bé để form được khởi tạo lại khi chuyển hồ sơ */}
          <ChildSettings key={active.id} child={active} tab={tab} />
        </>
      )}

      {modal && (
        <ChildFormModal
          open
          child={modal === "edit" ? active : null}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          isPending={createChild.isPending || updateChild.isPending}
        />
      )}
    </div>
  );
}

export default ChildrenPage;
