import api, { getErrorMessage } from "./api";

// Bài học (topics) — mỗi bài học gắn 1 năng lực CASEL (eq_skills). Moderator/Admin quản lý.

const call = async (request) => {
  try {
    const { data } = await request;
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const clean = (params) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== "all"));

/** GET /eq-skills → [{ id, caselCode, nameVi, nameEn, description, displayOrder, activeTopicsCount }] */
export const getEqSkills = async () => (await call(api.get("/eq-skills"))).data.skills;

/**
 * GET /topics?skillId&search&isActive&page&limit
 * → [{ id, title, guidance, ageMin, ageMax, displayOrder, isActive, skill, creator, storiesCount }]
 * BE hiện không trả thông tin phân trang (meta bị bỏ trong ApiResponse) → lấy tối đa 100 bài học / lần.
 */
export const getTopics = async ({ skillId, search, isActive } = {}) =>
  (await call(api.get("/topics", { params: clean({ skillId, search: search?.trim(), isActive, limit: 100 }) }))).data;

/** POST /topics { title, skillId, guidance, ageMin, ageMax, displayOrder, isActive } */
export const createTopic = async (payload) => (await call(api.post("/topics", payload))).data;

/** PUT /topics/:id — gửi field cần đổi */
export const updateTopic = async (id, payload) => (await call(api.put(`/topics/${id}`, payload))).data;

/**
 * DELETE /topics/:id → { message }
 * Bài học đã có truyện dùng thì BE không xóa mà chuyển sang ngưng kích hoạt.
 */
export const deleteTopic = (id) => call(api.delete(`/topics/${id}`));
