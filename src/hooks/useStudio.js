import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCharacter,
  createCheckpoint,
  createPage,
  createStory,
  deleteCheckpoint,
  deletePage,
  deleteStory,
  generateStory,
  getCharacters,
  getGeneration,
  getStories,
  getStory,
  reviewStory,
  updateCheckpoint,
  updatePage,
} from "../services/storyService";
import { getMe } from "../services/authService";
import useAuthStore from "../stores/authStore";
import { parentKeys } from "./useParent";

export const studioKeys = {
  all: ["studio"],
  list: (params) => ["studio", "list", params],
  story: (id) => ["studio", "story", id],
  generation: (id) => ["studio", "generation", id],
  characters: ["studio", "characters"],
};

const ACTIVE = new Set(["queued", "processing"]);

/**
 * Credit trên topbar đọc từ user trong authStore (đồng bộ từ GET /auth/me) → sau mỗi thao tác giữ / hoàn credit
 * gọi lại /auth/me và ghi thẳng vào store, không chờ query ["auth","me"] tự tải lại.
 */
export const refreshCredit = async (queryClient) => {
  try {
    const me = await getMe();
    useAuthStore.getState().setUser(me);
    queryClient.setQueryData(["auth", "me", me.id], me);
  } catch {
    // Lỗi mạng thì giữ số cũ; lần tải /auth/me sau sẽ đúng lại
  }
};
export const isGenerating = (generation) => !!generation && ACTIVE.has(generation.status);

export const useStories = (params) => useQuery({ queryKey: studioKeys.list(params), queryFn: () => getStories(params) });

export const useStory = (id) => useQuery({ queryKey: studioKeys.story(id), queryFn: () => getStory(id), enabled: !!id });

/** Tiến độ AI viết: hỏi lại mỗi 3 s khi job đang chạy; xong thì tải lại truyện và số credit. */
export const useGeneration = (id, { enabled = true } = {}) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: studioKeys.generation(id),
    queryFn: async () => {
      const generation = await getGeneration(id);
      if (generation && !ACTIVE.has(generation.status)) {
        queryClient.invalidateQueries({ queryKey: studioKeys.story(id) });
        refreshCredit(queryClient); // credit hoàn lại khi lỗi
      }
      return generation;
    },
    enabled: !!id && enabled,
    refetchInterval: (query) => (isGenerating(query.state.data) ? 3000 : false),
  });
};

export const useCharacters = () => useQuery({ queryKey: studioKeys.characters, queryFn: getCharacters });

export const useCreateCharacter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studioKeys.characters });
      queryClient.invalidateQueries({ queryKey: parentKeys.subscription }); // usage.charactersCount
    },
  });
};

export const useCreateStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studioKeys.all }),
  });
};

export const useGenerateStory = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => generateStory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studioKeys.generation(id) });
      queryClient.invalidateQueries({ queryKey: studioKeys.story(id) });
      refreshCredit(queryClient); // credit bị giữ
    },
  });
};

export const useDeleteStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStory,
    onSuccess: () => {
      // Chỉ làm mới danh sách: đụng vào cache của truyện vừa xóa sẽ làm trang editor còn mở gọi lại → 404.
      // Cache đó không còn ai dùng sau khi rời trang nên React Query tự dọn.
      queryClient.invalidateQueries({ queryKey: ["studio", "list"] });
      queryClient.invalidateQueries({ queryKey: parentKeys.drafts });
    },
  });
};

/** Mọi lệnh editor trả lại toàn bộ truyện → ghi thẳng vào cache, không cần tải lại. */
const useEditorMutation = (storyId, mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (story) => {
      queryClient.setQueryData(studioKeys.story(storyId), story);
      queryClient.invalidateQueries({ queryKey: ["studio", "list"] });
      queryClient.invalidateQueries({ queryKey: parentKeys.drafts });
    },
  });
};

export const useStoryEditor = (storyId) => ({
  updatePage: useEditorMutation(storyId, ({ pageId, contentText }) => updatePage(storyId, pageId, contentText)),
  createPage: useEditorMutation(storyId, () => createPage(storyId)),
  deletePage: useEditorMutation(storyId, (pageId) => deletePage(storyId, pageId)),
  updateCheckpoint: useEditorMutation(storyId, ({ checkpointId, body }) => updateCheckpoint(storyId, checkpointId, body)),
  createCheckpoint: useEditorMutation(storyId, (body) => createCheckpoint(storyId, body)),
  deleteCheckpoint: useEditorMutation(storyId, (checkpointId) => deleteCheckpoint(storyId, checkpointId)),
  review: useEditorMutation(storyId, () => reviewStory(storyId)),
});
