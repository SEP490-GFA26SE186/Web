import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLibraryStories, getLibrarySummary, toggleFavoriteStory } from "../services/parentService";

export const libraryKeys = {
  all: (childId) => ["library", childId],
  summary: (childId) => ["library", childId, "summary"],
  list: (childId, params) => ["library", childId, "list", params],
};

export const useLibrarySummary = (childId) =>
  useQuery({
    queryKey: libraryKeys.summary(childId),
    queryFn: () => getLibrarySummary(childId),
    enabled: !!childId,
  });

export const useLibraryStories = (childId, params) =>
  useQuery({
    queryKey: libraryKeys.list(childId, params),
    queryFn: () => getLibraryStories(childId, params),
    enabled: !!childId,
    placeholderData: keepPreviousData, // giữ danh sách cũ khi đổi trang/bộ lọc
  });

export const useToggleFavorite = (childId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storyId, isFavorite }) => toggleFavoriteStory(childId, storyId, isFavorite),
    // Cập nhật lạc quan để trái tim đổi màu ngay
    onMutate: async ({ storyId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: libraryKeys.all(childId) });
      const snapshot = queryClient.getQueriesData({ queryKey: [...libraryKeys.all(childId), "list"] });
      queryClient.setQueriesData({ queryKey: [...libraryKeys.all(childId), "list"] }, (old) =>
        old
          ? { ...old, items: old.items.map((s) => (s.id === storyId ? { ...s, isFavorite } : s)) }
          : old,
      );
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => ctx?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: libraryKeys.all(childId) }),
  });
};
