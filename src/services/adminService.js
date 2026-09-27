// import api from "./api";
import {
  DATE_RANGES,
  mockAdmin,
  mockAiActions,
  mockAiKpis,
  mockAppeals,
  mockAuditLog,
  mockEscrow,
  mockGuardrails,
  mockKpisBase,
  mockPipeline,
  mockPricingTiers,
  mockPromptTemplates,
  mockProviders,
  mockRefunds,
  mockRevenueBreakdown,
  mockRevenueSeries,
  mockSystemStatus,
  mockWithdrawals,
} from "../mocks/admin";

// TODO: bỏ mock khi BE hoàn thiện API — thay bằng các lời gọi api đã comment bên dưới.
const USE_MOCK = true;
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// State mock trong phiên làm việc
const db = {
  withdrawals: structuredClone(mockWithdrawals),
  refunds: structuredClone(mockRefunds),
  aiConfig: {
    actions: structuredClone(mockAiActions),
    guardrails: structuredClone(mockGuardrails),
    templates: structuredClone(mockPromptTemplates.items),
  },
  providers: structuredClone(mockProviders),
  auditLog: structuredClone(mockAuditLog),
};

const logAudit = (action) =>
  db.auditLog.unshift({
    id: `a_${Date.now()}`,
    time: new Date().toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }),
    actor: mockAdmin.name,
    action,
  });

export const getAdminOverview = async () => {
  if (USE_MOCK) {
    await delay(250);
    return {
      admin: mockAdmin,
      status: {
        ...mockSystemStatus,
        navBadges: { ...mockSystemStatus.navBadges, withdrawals: db.withdrawals.length, refunds: db.refunds.length },
      },
    };
  }
  // const { data } = await api.get("/admin/overview");
  // return data;
};

/** range: "today" | "7d" | "month" | "year" */
export const getAdminDashboard = async (range = "7d") => {
  if (USE_MOCK) {
    await delay(500);
    const { scale } = DATE_RANGES.find((r) => r.value === range) ?? DATE_RANGES[1];
    const k = mockKpisBase;
    const money = (n) => Math.round(n * scale);
    return structuredClone({
      kpis: {
        ...k,
        gmv: { ...k.gmv, amount: money(k.gmv.amount), transactions: Math.round(k.gmv.transactions * scale) },
        commission: { ...k.commission, amount: money(k.commission.amount), escrow: k.commission.escrow },
        aiCost: { ...k.aiCost, amount: money(k.aiCost.amount) },
        sellers: { ...k.sellers, newThisPeriod: Math.max(1, Math.round(k.sellers.newThisPeriod * scale)) },
        pendingWithdrawals: { count: db.withdrawals.length, amount: db.withdrawals.reduce((s, w) => s + w.amount, 0) },
      },
      withdrawals: db.withdrawals,
      appeals: mockAppeals,
      refunds: db.refunds,
      revenueSeries: mockRevenueSeries,
      revenueBreakdown: mockRevenueBreakdown.map((b) => ({ ...b, amount: money(b.amount) })),
      pricingTiers: mockPricingTiers,
      escrow: mockEscrow,
      pipeline: mockPipeline,
    });
  }
  // const { data } = await api.get("/admin/dashboard", { params: { range } });
  // return data;
};

export const approveWithdrawal = async (id) => {
  if (USE_MOCK) {
    await delay(600);
    const w = db.withdrawals.find((x) => x.id === id);
    db.withdrawals = db.withdrawals.filter((x) => x.id !== id);
    logAudit(`Phê duyệt lệnh rút tiền ${id} (${w?.seller})`);
    return { id, status: "approved" };
  }
  // const { data } = await api.post(`/admin/withdrawals/${id}/approve`);
  // return data;
};

export const processRefund = async (id) => {
  if (USE_MOCK) {
    await delay(600);
    db.refunds = db.refunds.filter((x) => x.id !== id);
    logAudit(`Hoàn tiền giao dịch ${id}`);
    return { id, status: "refunded" };
  }
  // const { data } = await api.post(`/admin/refunds/${id}/process`);
  // return data;
};

// ===== Cấu hình AI Engine =====
export const getAiConfig = async () => {
  if (USE_MOCK) {
    await delay(500);
    return structuredClone({
      kpis: mockAiKpis,
      providers: db.providers,
      config: db.aiConfig,
      templatesTotal: mockPromptTemplates.total,
    });
  }
  // const { data } = await api.get("/admin/ai-config");
  // return data;
};

/** config: { actions, guardrails, templates } */
export const saveAiConfig = async (config) => {
  if (USE_MOCK) {
    await delay(700);
    if (config.guardrails.imagesPerHour < 1 || config.guardrails.imagesPerHour > 500) {
      throw new Error("Hạn mức sinh ảnh phải nằm trong khoảng 1 – 500 lần/giờ");
    }
    db.aiConfig = structuredClone(config);
    logAudit("Cập nhật cấu hình AI Engine & biểu phí tín chỉ");
    return structuredClone(db.aiConfig);
  }
  // const { data } = await api.put("/admin/ai-config", config);
  // return data;
};

export const pingProviders = async () => {
  if (USE_MOCK) {
    await delay(1200);
    const jitter = () => Math.round(Math.random() * 60);
    return [
      { name: "OpenAI", ms: 210 + jitter() },
      { name: "AWS Bedrock", ms: 160 + jitter() },
      { name: "ElevenLabs", ms: 270 + jitter() },
    ];
  }
  // const { data } = await api.post("/admin/ai-config/ping");
  // return data;
};

/** Xoay vòng khóa: BE tạo khóa mới trong KMS, FE chỉ nhận lại bản đã che */
export const rotateProviderKey = async (providerId) => {
  if (USE_MOCK) {
    await delay(900);
    const p = db.providers.find((x) => x.id === providerId);
    const suffix = Math.random().toString(16).slice(2, 6).toUpperCase();
    p.keyMasked = p.keyMasked.replace(/.{4}$/, suffix);
    p.lastRotated = new Date().toLocaleDateString("vi-VN");
    logAudit(`Xoay vòng khóa ${p.name} (…${suffix})`);
    return structuredClone(p);
  }
  // const { data } = await api.post(`/admin/ai-providers/${providerId}/rotate-key`);
  // return data;
};

export const getAuditLog = async () => {
  if (USE_MOCK) {
    await delay(400);
    return structuredClone(db.auditLog);
  }
  // const { data } = await api.get("/admin/audit-logs", { params: { scope: "ai-config" } });
  // return data;
};
