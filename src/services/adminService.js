import api, { getErrorMessage } from "./api";
import useAuthStore from "../stores/authStore";

// Quản trị (rev8): tài khoản, gói & bậc giá, cấu hình, hoàn tiền, tài chính, nhật ký. Lỗi BE giữ nguyên message.
const call = async (request) => {
  try {
    return (await request).data.data;
  } catch (error) {
    const err = new Error(getErrorMessage(error), { cause: error });
    err.status = error.response?.status;
    throw err;
  }
};

/** Layout: tên Admin + badge số việc đang chờ (rút tiền / hoàn tiền / kháng nghị). */
export const getAdminOverview = async () => {
  const { navBadges } = await call(api.get("/admin/overview"));
  const user = useAuthStore.getState().user;
  return { admin: { name: user?.fullName || user?.username || "Quản trị viên", role: "Quản trị viên", avatar: null }, navBadges };
};

/** range: today | 7d | 30d | 90d | year → { revenue, series, aiCost, pnl, newParents, activePaidSubscriptions, sellerFunds } */
export const getFinanceSummary = (range = "30d") => call(api.get("/admin/finance/summary", { params: { range } }));
export const getReconciliation = () => call(api.get("/admin/finance/reconciliation"));
export const fixCounters = () => call(api.post("/admin/finance/reconciliation/fix-counters"));

/** { role, status, search, page } → { accounts, pagination } */
export const getAccounts = (params) =>
  call(api.get("/admin/accounts", { params: Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null)) }));
export const setAccountActive = (userId, isActive) => call(api.patch(`/admin/accounts/${userId}`, { isActive }));
export const createModerator = (body) => call(api.post("/admin/accounts/moderators", body));

export const getAdminPlans = async () => (await call(api.get("/admin/plans"))).plans;
export const createPlan = (body) => call(api.post("/admin/plans", body));
export const updatePlan = (planId, body) => call(api.put(`/admin/plans/${planId}`, body));
export const getPriceTiers = async () => (await call(api.get("/admin/price-tiers"))).tiers;
export const createPriceTier = (body) => call(api.post("/admin/price-tiers", body));
export const updatePriceTier = (tierId, body) => call(api.put(`/admin/price-tiers/${tierId}`, body));

/** → { groups: { ai, market, moderation }, settings: [{ key, group, label, hint, unit, type, min, max, value, isDefault, updatedAt, updatedBy }] } */
export const getSettings = () => call(api.get("/admin/settings"));
export const updateSetting = (key, value) => call(api.put(`/admin/settings/${encodeURIComponent(key)}`, { value }));

export const getRefunds = async (status = "pending") => (await call(api.get("/admin/refunds", { params: { status } }))).refunds;
/** { approve, bankTransactionRef?, note? } */
export const decideRefund = (refundId, body) => call(api.post(`/admin/refunds/${refundId}/decision`, body));

/** { action?, page } → { prefixes, logs, pagination } */
export const getAuditLogs = (params) =>
  call(api.get("/admin/audit-logs", { params: Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null && v !== "all")) }));
