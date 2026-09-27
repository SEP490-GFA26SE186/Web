import { useState } from "react";
import { BookOpen, Check, Coins, DollarSign, History, Loader2, PieChart, Radio, RotateCcw, Save, ShieldCheck, TrendingDown, Zap } from "lucide-react";
import ActionCostsTable from "../../components/admin/aiConfig/ActionCostsTable";
import { averageMargin } from "../../components/admin/aiConfig/pricing";
import { GuardrailsSection, ProvidersSection } from "../../components/admin/aiConfig/ProvidersAndGuardrails";
import { AuditLogModal, TemplatesSection } from "../../components/admin/aiConfig/TemplatesAndAudit";
import { useAiConfig, usePingProviders, useSaveAiConfig } from "../../hooks/useAdmin";
import { CREDIT_RATE_VND } from "../../mocks/admin";
import { toast } from "../../stores/toastStore";
import { formatNumber } from "../../utils/format";

const TABS = [
  { id: "section-actions", label: "Hành động AI & Bảng giá Tín chỉ" },
  { id: "section-providers", label: "Nhà cung cấp & Mô hình" },
  { id: "section-templates", label: "Mẫu Prompt sư phạm" },
  { id: "section-guardrails", label: "Hạn mức & Ngưỡng an toàn" },
];

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function KpiTile({ label, value, valueClass = "", hint, hintIcon: HintIcon, hintClass = "text-navy/60", icon: Icon, iconClass }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-card bg-surface p-4 shadow-low">
      <div>
        <p className="text-[11px] font-bold tracking-wider text-navy/60 uppercase">{label}</p>
        <p className={`pt-1 font-display text-2xl font-bold ${valueClass}`}>{value}</p>
        <p className={`flex items-center gap-0.5 pt-1 text-xs font-semibold ${hintClass}`}>
          {HintIcon && <HintIcon size={14} />} {hint}
        </p>
      </div>
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${iconClass}`}>
        <Icon size={24} />
      </span>
    </div>
  );
}

function AiConfigEditor({ data }) {
  const [form, setForm] = useState(data.config);
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [auditOpen, setAuditOpen] = useState(false);
  const save = useSaveAiConfig();
  const ping = usePingProviders();
  const dirty = !isEqual(form, data.config);
  const invalid = !(form.guardrails.imagesPerHour >= 1 && form.guardrails.imagesPerHour <= 500);

  const updateAction = (id, patch) => setForm((f) => ({ ...f, actions: f.actions.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
  const updateTemplate = (id, patch) => setForm((f) => ({ ...f, templates: f.templates.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  const updateGuardrails = (patch) => setForm((f) => ({ ...f, guardrails: { ...f.guardrails, ...patch } }));

  const handleSave = () =>
    save.mutate(form, {
      onSuccess: () => toast.success("Đã lưu cấu hình hạ tầng AI & biểu phí Tín chỉ"),
      onError: (err) => toast.error(err.message),
    });

  const handlePing = () =>
    ping.mutate(undefined, {
      onSuccess: (results) =>
        toast.success(`Ping hoàn tất: ${results.map((r) => `${r.name} (${r.ms}ms)`).join(", ")}. Tất cả kênh sẵn sàng!`),
      onError: () => toast.error("Không kết nối được tới một số nhà cung cấp"),
    });

  const scrollTo = (id) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { kpis } = data;
  const margin = averageMargin(form.actions);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-navy/60">
        <span>
          Cổng Quản Trị <span className="text-navy/30">/</span> Hạ Tầng & AI <span className="text-navy/30">/</span>{" "}
          <b className="text-primary-dark">Cấu Hình Động Cơ & Tín Chỉ</b>
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck size={15} className="text-secondary" /> KMS Bảo mật v4.8 • Tuân thủ COPPA Active
        </span>
      </div>

      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div className="flex max-w-3xl flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1 rounded-full bg-primary-tint px-3 py-0.5 text-primary-dark">
              <Zap size={13} /> ĐỘNG CƠ THỰC THI AI
            </span>
            <span className="flex items-center gap-1 rounded-full bg-secondary-tint px-3 py-0.5 text-secondary-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> {data.providers.length}/{data.providers.length} Nhà cung cấp ổn định
            </span>
          </div>
          <h1 className="text-3xl">Cấu hình Hạ tầng AI & Định giá Tín chỉ</h1>
          <p className="text-navy/70">
            Quản trị kết nối mô hình ngôn ngữ lớn (LLM), động cơ sinh ảnh sư phạm theo chuẩn CASEL, giọng đọc TTS và định mức tiêu hao tín chỉ
            minh bạch của phụ huynh.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            onClick={handlePing}
            disabled={ping.isPending}
            className="flex items-center gap-1.5 rounded-full bg-surface px-4 py-2.5 text-sm font-semibold shadow-low transition hover:bg-outline active:scale-95 disabled:opacity-70"
          >
            <Radio size={17} className={`text-secondary ${ping.isPending ? "animate-spin" : ""}`} /> Kiểm tra kết nối (Ping Test)
          </button>
          <button onClick={() => setAuditOpen(true)} className="flex items-center gap-1.5 rounded-full bg-outline/70 px-4 py-2.5 text-sm font-semibold transition hover:bg-outline">
            <History size={17} className="text-navy-soft" /> Xem lịch sử (Audit Log)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiTile
          label="Tổng chi tiêu AI tháng này" value={`$${kpis.monthlySpendUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          hint={`${kpis.spendDelta}% so với tháng trước`} hintIcon={TrendingDown} hintClass="text-secondary-dark"
          icon={DollarSign} iconClass="bg-primary-tint text-primary-dark"
        />
        <KpiTile
          label="Biên lợi nhuận gộp Tín chỉ" value={`${margin.toFixed(1)}%`} valueClass="text-secondary-dark"
          hint={dirty ? "Theo bảng giá đang chỉnh (chưa lưu)" : "Đảm bảo trợ giá giáo dục"}
          icon={PieChart} iconClass="bg-secondary-tint text-secondary-dark"
        />
        <KpiTile
          label="Tổng Requests AI / 24h" value={formatNumber(kpis.requests24h)}
          hint={`${kpis.successRate}% Thành công`} hintIcon={Check} hintClass="text-secondary-dark"
          icon={BookOpen} iconClass="bg-navy-tint text-navy-soft"
        />
        <KpiTile
          label="Tỷ giá Quy đổi Tín chỉ" value={`1 Credit = ${formatNumber(CREDIT_RATE_VND)}đ`} valueClass="text-primary-dark"
          hint="Cố định theo VNĐ Wallet" icon={Coins} iconClass="bg-primary-tint text-primary-dark"
        />
      </div>

      <nav className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full bg-surface p-1.5 shadow-inner" aria-label="Các mục cấu hình">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => scrollTo(t.id)}
            aria-current={activeTab === t.id}
            className={`shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap transition ${
              activeTab === t.id ? "bg-white font-bold text-primary-dark shadow-low" : "font-semibold text-navy/60 hover:text-navy"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <ActionCostsTable actions={form.actions} onChangeAction={updateAction} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <ProvidersSection providers={data.providers} />
        <GuardrailsSection guardrails={form.guardrails} onChange={updateGuardrails} />
      </div>

      <TemplatesSection templates={form.templates} total={data.templatesTotal} onChangeTemplate={updateTemplate} />

      {/* Thanh lưu dính cuối trang */}
      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-2 rounded-full border border-outline bg-white/90 p-2 pl-5 shadow-high backdrop-blur">
        <span className="mr-auto text-sm">
          {dirty ? (
            <span className="flex items-center gap-1.5 font-semibold text-primary-dark">
              <span className="h-2 w-2 rounded-full bg-primary" /> Có thay đổi cấu hình chưa lưu
            </span>
          ) : (
            <span className="text-navy/50">Cấu hình đang đồng bộ với hệ thống</span>
          )}
        </span>
        {dirty && (
          <button onClick={() => setForm(data.config)} className="flex items-center gap-1 rounded-full px-4 py-2.5 text-sm font-semibold text-navy/60 hover:bg-surface">
            <RotateCcw size={15} /> Hoàn tác
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!dirty || invalid || save.isPending}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary-dark px-6 py-2.5 text-sm font-bold text-white shadow-mid transition hover:bg-primary active:scale-95 disabled:opacity-50"
        >
          {save.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Lưu thay đổi cấu hình
        </button>
      </div>

      <AuditLogModal open={auditOpen} onClose={() => setAuditOpen(false)} />
    </div>
  );
}

function AiConfigPage() {
  const { data, isLoading } = useAiConfig();

  if (isLoading || !data) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-28 rounded-stage bg-surface" />
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-card bg-surface" />
          ))}
        </div>
        <div className="h-96 rounded-stage bg-surface" />
      </div>
    );
  }

  return <AiConfigEditor data={data} />;
}

export default AiConfigPage;
