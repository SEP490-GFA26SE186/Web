import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getChildren,
  getParentDashboard,
  getParentProfile,
  updateBedtimeMode,
} from "../services/parentService";

export const parentKeys = {
  profile: ["parent", "profile"],
  children: ["parent", "children"],
  dashboard: (childId) => ["parent", "dashboard", childId],
};

export const useParentProfile = () =>
  useQuery({ queryKey: parentKeys.profile, queryFn: getParentProfile });

export const useChildren = () =>
  useQuery({ queryKey: parentKeys.children, queryFn: getChildren });

export const useParentDashboard = (childId) =>
  useQuery({
    queryKey: parentKeys.dashboard(childId),
    queryFn: () => getParentDashboard(childId),
    enabled: !!childId,
  });

export const useToggleBedtime = (childId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enabled) => updateBedtimeMode(childId, enabled),
    onSuccess: ({ enabled }) => {
      queryClient.setQueryData(parentKeys.dashboard(childId), (old) =>
        old ? { ...old, bedtime: { ...old.bedtime, enabled } } : old,
      );
    },
  });
};
