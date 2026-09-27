import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveWithdrawal,
  getAdminDashboard,
  getAdminOverview,
  getAiConfig,
  getAuditLog,
  pingProviders,
  processRefund,
  rotateProviderKey,
  saveAiConfig,
} from "../services/adminService";

export const adminKeys = {
  all: ["admin"],
  overview: ["admin", "overview"],
  dashboard: (range) => ["admin", "dashboard", range],
  aiConfig: ["admin", "ai-config"],
  auditLog: ["admin", "audit-log"],
};

const useInvalidateAdmin = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: adminKeys.all });
};

export const useAdminOverview = () => useQuery({ queryKey: adminKeys.overview, queryFn: getAdminOverview });

export const useAdminDashboard = (range) =>
  useQuery({ queryKey: adminKeys.dashboard(range), queryFn: () => getAdminDashboard(range), placeholderData: keepPreviousData });

export const useApproveWithdrawal = () => {
  const invalidate = useInvalidateAdmin();
  return useMutation({ mutationFn: approveWithdrawal, onSuccess: invalidate });
};

export const useProcessRefund = () => {
  const invalidate = useInvalidateAdmin();
  return useMutation({ mutationFn: processRefund, onSuccess: invalidate });
};

export const useAiConfig = () => useQuery({ queryKey: adminKeys.aiConfig, queryFn: getAiConfig });

export const useSaveAiConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveAiConfig,
    onSuccess: (config) => {
      queryClient.setQueryData(adminKeys.aiConfig, (old) => (old ? { ...old, config } : old));
      queryClient.invalidateQueries({ queryKey: adminKeys.auditLog });
    },
  });
};

export const usePingProviders = () => useMutation({ mutationFn: pingProviders });

export const useRotateKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rotateProviderKey,
    onSuccess: (provider) => {
      queryClient.setQueryData(adminKeys.aiConfig, (old) =>
        old ? { ...old, providers: old.providers.map((p) => (p.id === provider.id ? provider : p)) } : old,
      );
      queryClient.invalidateQueries({ queryKey: adminKeys.auditLog });
    },
  });
};

export const useAuditLog = (enabled) => useQuery({ queryKey: adminKeys.auditLog, queryFn: getAuditLog, enabled });
