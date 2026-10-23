import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createModerator,
  createPlan,
  decideRefund,
  fixCounters,
  getAccounts,
  getAdminOverview,
  getAdminPlans,
  getAuditLogs,
  getFinanceSummary,
  getReconciliation,
  getRefunds,
  getSettings,
  setAccountActive,
  updatePlan,
  updateSetting,
} from "../services/adminService";

export const adminKeys = {
  all: ["admin"],
  overview: ["admin", "overview"],
  finance: (range) => ["admin", "finance", range],
  reconciliation: ["admin", "reconciliation"],
  accounts: (params) => ["admin", "accounts", params],
  plans: ["admin", "plans"],
  settings: ["admin", "settings"],
  refunds: (status) => ["admin", "refunds", status],
  auditLogs: (params) => ["admin", "audit-logs", params],
};

/** Mọi thay đổi có thể đổi badge, số liệu, nhật ký → làm mới cả nhóm "admin". */
const useAdminMutation = (mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.all }) });
};

export const useAdminOverview = () => useQuery({ queryKey: adminKeys.overview, queryFn: getAdminOverview, refetchInterval: 60_000 });
export const useFinanceSummary = (range) =>
  useQuery({ queryKey: adminKeys.finance(range), queryFn: () => getFinanceSummary(range), placeholderData: keepPreviousData });

export const useReconciliation = () => useQuery({ queryKey: adminKeys.reconciliation, queryFn: getReconciliation });
export const useFixCounters = () => useAdminMutation(fixCounters);

export const useAccounts = (params) => useQuery({ queryKey: adminKeys.accounts(params), queryFn: () => getAccounts(params), placeholderData: keepPreviousData });
export const useSetAccountActive = () => useAdminMutation(({ userId, isActive }) => setAccountActive(userId, isActive));
export const useCreateModerator = () => useAdminMutation(createModerator);

export const useAdminPlans = () => useQuery({ queryKey: adminKeys.plans, queryFn: getAdminPlans });
export const useCreatePlan = () => useAdminMutation(createPlan);
export const useUpdatePlan = () => useAdminMutation(({ id, ...body }) => updatePlan(id, body));

export const useSettings = () => useQuery({ queryKey: adminKeys.settings, queryFn: getSettings });
export const useUpdateSetting = () => useAdminMutation(({ key, value }) => updateSetting(key, value));

export const useRefunds = (status) => useQuery({ queryKey: adminKeys.refunds(status), queryFn: () => getRefunds(status) });
export const useDecideRefund = () => useAdminMutation(({ id, ...body }) => decideRefund(id, body));

export const useAuditLogs = (params) => useQuery({ queryKey: adminKeys.auditLogs(params), queryFn: () => getAuditLogs(params), placeholderData: keepPreviousData });
