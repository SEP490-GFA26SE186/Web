import api, { getErrorMessage } from "./api";

// Truyện riêng của phụ huynh — BE: /api/v1/stories (schema rev8), nhân vật: /api/v1/characters.

/** Lỗi có kèm danh sách `errors` của BE (VD hoàn tất khi còn trang trống: [{ path: "pages.<id>", message }]). */
export class StoryApiError extends Error {
  constructor(error) {
    super(getErrorMessage(error), { cause: error });
    this.status = error.response?.status;
    this.errors = error.response?.data?.errors ?? [];
  }
}

const call = async (request) => {
  try {
    const { data } = await request;
    return data;
  } catch (error) {
    throw new StoryApiError(error);
  }
};

const clean = (params) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));

// ---- Truyện ----

/** GET /stories?status&reviewed&page&limit → { data: story[], pagination } */
export const getStories = ({ status, reviewed, page = 1, limit = 20 } = {}) =>
  call(api.get("/stories", { params: clean({ status, reviewed, page, limit }) }));

/** GET /stories/:id → story (chữ dạng token; `characters` là bảng token → tên) */
export const getStory = async (id) => (await call(api.get(`/stories/${id}`))).data.story;

/**
 * POST /stories { topicId, length, title, situation?, characters: [{ characterId, isMain }], useAiImage, useTts }
 * BE dựng khung trang + điểm dừng theo độ dài; truyện ở trạng thái draft.
 */
export const createStory = async (payload) => (await call(api.post("/stories", payload))).data.story;

/** PUT /stories/:id { title?, situation?, useAiImage?, useTts? } */
export const updateStory = async (id, payload) => (await call(api.put(`/stories/${id}`, payload))).data.story;

export const deleteStory = (id) => call(api.delete(`/stories/${id}`));

/** POST /stories/:id/generate → { aiRequestId }. Giữ credit; 402 khi không đủ credit. */
export const generateStory = async (id) => (await call(api.post(`/stories/${id}/generate`))).data;

/** GET /stories/:id/generation → { status: queued|processing|succeeded|failed|blocked, errorCode, errorMessage } | null */
export const getGeneration = async (id) => (await call(api.get(`/stories/${id}/generation`))).data.generation;

// ---- Editor (mỗi lệnh trả lại toàn bộ truyện) ----

export const updatePage = async (storyId, pageId, contentText) =>
  (await call(api.put(`/stories/${storyId}/pages/${pageId}`, { contentText }))).data.story;

export const createPage = async (storyId) => (await call(api.post(`/stories/${storyId}/pages`, {}))).data.story;

export const deletePage = async (storyId, pageId) =>
  (await call(api.delete(`/stories/${storyId}/pages/${pageId}`))).data.story;

/** body: { question?, hint?, answerEmotion?, options?: [{ text, role?, isCorrect?, feedback? }] } */
export const updateCheckpoint = async (storyId, checkpointId, body) =>
  (await call(api.put(`/stories/${storyId}/checkpoints/${checkpointId}`, body))).data.story;

/** body: { type, afterPageId, targetToken? } — chỉ truyện tự viết */
export const createCheckpoint = async (storyId, body) =>
  (await call(api.post(`/stories/${storyId}/checkpoints`, body))).data.story;

export const deleteCheckpoint = async (storyId, checkpointId) =>
  (await call(api.delete(`/stories/${storyId}/checkpoints/${checkpointId}`))).data.story;

/** POST /stories/:id/review — hoàn tất; 422 kèm errors khi còn chỗ chưa viết xong */
export const reviewStory = async (id) => (await call(api.post(`/stories/${id}/review`))).data.story;

// ---- Nhân vật gia đình ----

/** GET /characters → [{ id, name, appearance, childId, child, portraitImageKey, … }] */
export const getCharacters = async () => (await call(api.get("/characters"))).data.characters;

/** POST /characters { name, appearance } */
export const createCharacter = async (payload) => (await call(api.post("/characters", payload))).data.character;
