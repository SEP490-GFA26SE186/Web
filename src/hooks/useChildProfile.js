import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChild,
  getChildSettings,
  updateChild,
  updateChildSettings,
  updateParentPin,
} from "../services/parentService";
import { parentKeys } from "./useParent";

export const childSettingsKey = (childId) => ["children", childId, "settings"];

export const useChildSettings = (childId) =>
  useQuery({
    queryKey: childSettingsKey(childId),
    queryFn: () => getChildSettings(childId),
    enabled: !!childId,
  });

export const useSaveChildSettings = (childId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings) => updateChildSettings(childId, settings),
    onSuccess: (data) => queryClient.setQueryData(childSettingsKey(childId), data),
  });
};

export const useUpdatePin = (childId) => useMutation({ mutationFn: (pin) => updateParentPin(childId, pin) });

export const useCreateChild = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChild,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: parentKeys.children }),
  });
};

export const useUpdateChild = (childId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateChild(childId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: parentKeys.children }),
  });
};
