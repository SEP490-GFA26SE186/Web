import api, { getErrorMessage } from "./api";

// Từ khoá bị chặn (blocked_keywords) — chuyên gia quản lý. Dùng khi AI viết truyện và khi phụ huynh tự viết / sửa:
// `block` chặn hẳn (không lưu được), `warn` chỉ cảnh báo.

const call = async (request) => {
  try {
    const { data } = await request;
    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const clean = (params) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== "all"));

/** GET /moderation/keywords?search&severity → [{ id, keyword, severity, isActive, createdAt, creator }] */
export const getKeywords = async ({ search, severity } = {}) =>
  (await call(api.get("/moderation/keywords", { params: clean({ search: search?.trim(), severity }) }))).keywords;

/** Một từ → POST /moderation/keywords (409 nếu đã có); nhiều từ → POST /bulk (từ đã có được cập nhật mức độ, bật lại). */
export const addKeywords = (keywords, severity) =>
  keywords.length === 1
    ? call(api.post("/moderation/keywords", { keyword: keywords[0], severity })).then(() => ({ count: 1 }))
    : call(api.post("/moderation/keywords/bulk", { keywords, severity }));

/** PUT /moderation/keywords/:id { severity?, isActive? } */
export const updateKeyword = (id, payload) => call(api.put(`/moderation/keywords/${id}`, payload));

export const deleteKeyword = (id) => call(api.delete(`/moderation/keywords/${id}`));
